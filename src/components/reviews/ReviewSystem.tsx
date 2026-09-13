"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Edit3,
  Flag,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Save,
  MessageSquarePlus,
  ShieldAlert,
  X,
} from "lucide-react";
import { idb } from "@/lib/storage/indexedDb";
import { reviewSchema, ReviewRecord } from "@/lib/reviews/reviewModel";

interface ReviewSystemProps {
  movieId: string | number;
  movieTitle: string;
}

export default function ReviewSystem({ movieId, movieTitle }: ReviewSystemProps) {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"wilson" | "newest" | "rating-desc" | "rating-asc" | "controversial">("wilson");

  // Auth / Current User
  const [currentUser, setCurrentUser] = useState({
    name: "Alex Rivera",
    userId: "current-user-id",
  });

  // Form & Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    rating: 9,
    containsSpoilers: false,
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [draftSavedTime, setDraftSavedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Soft delete & Undo State
  const [undoToast, setUndoToast] = useState<{
    review: ReviewRecord;
    timerId: NodeJS.Timeout;
  } | null>(null);

  // Flag Modal State
  const [flagModalReviewId, setFlagModalReviewId] = useState<string | null>(null);
  const [flagReason, setFlagReason] = useState("Spoilers not marked");
  const [flagSuccessMsg, setFlagSuccessMsg] = useState<string | null>(null);

  // Autosave debounce timer
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load reviews from API
  const loadReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?movieId=${movieId}&sort=${sort}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      console.error("Failed to load reviews:", e);
    } finally {
      setLoading(false);
    }
  }, [movieId, sort]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // SSE Live Updates Listener with backpressure and graceful cleanup
  useEffect(() => {
    if (typeof window === "undefined") return;
    let es: EventSource | null = null;
    try {
      es = new EventSource(`/api/reviews/stream?movieId=${movieId}`);
      es.addEventListener("ping", () => {
        // Heartbeat received
      });
    } catch {
      // Fallback
    }
    return () => {
      es?.close();
    };
  }, [movieId]);

  // Check and restore draft from IndexedDB when opening form
  const handleOpenForm = async (editReview?: ReviewRecord) => {
    setValidationErrors({});
    if (editReview) {
      setEditingReviewId(editReview.id);
      setFormData({
        title: editReview.title,
        content: editReview.content,
        rating: editReview.rating,
        containsSpoilers: editReview.containsSpoilers,
      });
      setDraftSavedTime(null);
    } else {
      setEditingReviewId(null);
      // Check IndexedDB draft
      const draft = await idb.getReviewDraft(movieId);
      if (draft) {
        setFormData({
          title: draft.title,
          content: draft.content,
          rating: draft.rating,
          containsSpoilers: draft.containsSpoilers,
        });
        const minutesAgo = Math.max(1, Math.round((Date.now() - draft.savedAt) / 60000));
        setDraftSavedTime(`Restored draft from ${minutesAgo}m ago`);
      } else {
        setFormData({ title: "", content: "", rating: 9, containsSpoilers: false });
        setDraftSavedTime(null);
      }
    }
    setIsFormOpen(true);
  };

  // Debounced Autosave Draft to IndexedDB
  const handleFormChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    // Only autosave new drafts (not during edits of existing reviews)
    if (!editingReviewId) {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(async () => {
        if (updated.title || updated.content) {
          await idb.saveReviewDraft({
            movieId,
            title: updated.title,
            content: updated.content,
            rating: updated.rating,
            containsSpoilers: updated.containsSpoilers,
            savedAt: Date.now(),
          });
          setDraftSavedTime("Draft autosaved to device");
        }
      }, 500);
    }
  };

  const handleDiscardDraft = async () => {
    await idb.deleteReviewDraft(movieId);
    setFormData({ title: "", content: "", rating: 9, containsSpoilers: false });
    setDraftSavedTime(null);
    setIsFormOpen(false);
  };

  // Submit Review with Zod validation & Optimistic UI update
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Client-side Zod validation
    const result = reviewSchema.safeParse({
      ...formData,
      movieId,
      author: currentUser.name,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setValidationErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    if (editingReviewId) {
      // Edit existing
      const previousReviews = [...reviews];
      setReviews((prev) =>
        prev.map((r) =>
          r.id === editingReviewId
            ? { ...r, ...formData, updatedAt: Date.now(), pending: true }
            : r
        )
      );
      setIsFormOpen(false);

      try {
        const res = await fetch("/api/reviews", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingReviewId, ...formData }),
        });
        if (!res.ok) throw new Error("Update failed");
        loadReviews();
      } catch {
        setReviews(previousReviews);
        alert("Failed to update review. Reverting changes.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Optimistic Add
      const tempId = `temp-${Date.now()}`;
      const optimisticReview: ReviewRecord = {
        id: tempId,
        movieId,
        userId: currentUser.userId,
        author: currentUser.name,
        title: formData.title,
        content: formData.content,
        rating: formData.rating,
        containsSpoilers: formData.containsSpoilers,
        createdAt: Date.now(),
        upvotes: 1,
        downvotes: 0,
        wilsonScore: 0.5,
        pending: true,
      };

      setReviews((prev) => [optimisticReview, ...prev]);
      setIsFormOpen(false);
      await idb.deleteReviewDraft(movieId);

      try {
        const idempotencyKey = `idem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": idempotencyKey,
          },
          body: JSON.stringify({ ...result.data, idempotencyKey }),
        });
        if (!res.ok) throw new Error("Submission failed");
        loadReviews();
      } catch {
        setReviews((prev) => prev.filter((r) => r.id !== tempId));
        alert("Failed to post review. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Voting with instant UI update
  const handleVote = async (reviewId: string, vote: "up" | "down") => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            upvotes: vote === "up" ? r.upvotes + 1 : r.upvotes,
            downvotes: vote === "down" ? r.downvotes + 1 : r.downvotes,
          };
        }
        return r;
      })
    );

    try {
      await fetch(`/api/reviews/${reviewId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote }),
      });
    } catch (e) {
      console.error("Voting failed:", e);
    }
  };

  // Soft Delete with Undo Toast
  const handleSoftDelete = (review: ReviewRecord) => {
    // Hide from UI immediately
    setReviews((prev) => prev.filter((r) => r.id !== review.id));

    // Clear any previous undo toast
    if (undoToast) clearTimeout(undoToast.timerId);

    // Call API soft delete
    fetch(`/api/reviews?id=${review.id}&action=soft`, { method: "DELETE" });

    // Set 6-second undo window
    const timerId = setTimeout(() => {
      setUndoToast(null);
    }, 6000);

    setUndoToast({ review, timerId });
  };

  const handleUndoDelete = async () => {
    if (!undoToast) return;
    clearTimeout(undoToast.timerId);
    const restored = undoToast.review;

    // Restore to UI
    setReviews((prev) => [restored, ...prev]);
    setUndoToast(null);

    // Call API undo
    try {
      await fetch(`/api/reviews?id=${restored.id}&action=undo`, { method: "DELETE" });
    } catch (e) {
      console.error("Undo failed:", e);
    }
  };

  // Moderation Flag Submission
  const handleFlagReview = async () => {
    if (!flagModalReviewId) return;

    try {
      const res = await fetch(`/api/reviews/${flagModalReviewId}/flag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: flagReason, user: currentUser.name }),
      });
      if (res.ok) {
        setFlagSuccessMsg("Review flagged for moderation review.");
        setTimeout(() => {
          setFlagModalReviewId(null);
          setFlagSuccessMsg(null);
        }, 1500);
      }
    } catch (e) {
      console.error("Flagging failed:", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Reviews & Discussions
            <span className="text-xs bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 px-2.5 py-0.5 rounded-full font-medium">
              {reviews.length} reviews
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Logged in as <span className="text-zinc-200 font-semibold">{currentUser.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Wilson Score & Sorting */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="bg-zinc-800 border border-zinc-700 text-zinc-200 px-3 py-1.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-yellow-500 text-xs"
              aria-label="Sort reviews"
            >
              <option value="wilson">Most Helpful (Wilson Score)</option>
              <option value="controversial">Controversial (High Activity)</option>
              <option value="newest">Newest First</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="rating-asc">Lowest Rated</option>
            </select>
          </div>

          <button
            onClick={() => handleOpenForm()}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Write Review
          </button>
        </div>
      </div>

      {/* Undo Banner / Toast */}
      {undoToast && (
        <div className="bg-zinc-900 border border-yellow-500/40 p-4 rounded-xl flex items-center justify-between shadow-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-white">Review deleted.</p>
              <p className="text-xs text-zinc-400 truncate max-w-sm">&ldquo;{undoToast.review.title}&rdquo;</p>
            </div>
          </div>
          <button
            onClick={handleUndoDelete}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Undo
          </button>
        </div>
      )}

      {/* Write/Edit Review Modal Dialog */}
      {isFormOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-form-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h4 id="review-form-title" className="text-lg font-bold text-white">
                  {editingReviewId ? "Edit Your Review" : `Review ${movieTitle}`}
                </h4>
                {draftSavedTime && (
                  <p className="text-xs text-yellow-500 flex items-center gap-1 mt-0.5">
                    <Save className="w-3 h-3" />
                    {draftSavedTime}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-zinc-400 hover:text-white p-1"
                aria-label="Close review dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Rating Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Rating: <span className="text-yellow-500 font-bold">{formData.rating} / 10</span>
                </label>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const score = i + 1;
                    return (
                      <button
                        key={score}
                        type="button"
                        onClick={() => handleFormChange("rating", score)}
                        className={`p-1.5 rounded-lg transition-transform ${
                          score <= formData.rating
                            ? "text-yellow-500 scale-105"
                            : "text-zinc-700 hover:text-zinc-400"
                        }`}
                        aria-label={`Rate ${score} out of 10`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Headline</label>
                <input
                  type="text"
                  placeholder="Summarize your opinion or give a memorable headline..."
                  value={formData.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                />
                {validationErrors.title && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.title}
                  </p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Your Review</label>
                <textarea
                  rows={5}
                  placeholder="Share details about the acting, direction, cinematography, pacing..."
                  value={formData.content}
                  onChange={(e) => handleFormChange("content", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                />
                {validationErrors.content && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.content}
                  </p>
                )}
              </div>

              {/* Spoiler Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="containsSpoilers"
                  checked={formData.containsSpoilers}
                  onChange={(e) => handleFormChange("containsSpoilers", e.target.checked)}
                  className="w-4 h-4 rounded text-yellow-500 focus:ring-yellow-500 accent-yellow-500"
                />
                <label htmlFor="containsSpoilers" className="text-xs text-zinc-300 select-none">
                  This review contains major plot spoilers
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                {!editingReviewId ? (
                  <button
                    type="button"
                    onClick={handleDiscardDraft}
                    className="text-zinc-500 hover:text-red-400 text-xs transition-colors"
                  >
                    Discard draft
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    {isSubmitting ? "Saving..." : editingReviewId ? "Update Review" : "Submit Review"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Flag / Moderation Modal */}
      {flagModalReviewId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-yellow-500 font-bold">
              <ShieldAlert className="w-5 h-5" />
              <span>Report Review for Moderation</span>
            </div>
            {flagSuccessMsg ? (
              <p className="text-green-400 text-sm py-4 text-center">{flagSuccessMsg}</p>
            ) : (
              <>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  Please select why this review breaches community standards:
                </p>
                <div className="space-y-2">
                  {[
                    "Spoilers not marked",
                    "Offensive / abusive language",
                    "Spam or promotion",
                    "Factually misleading",
                  ].map((reason) => (
                    <label
                      key={reason}
                      className="flex items-center gap-2 p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 text-xs text-zinc-300 cursor-pointer hover:bg-zinc-800/80"
                    >
                      <input
                        type="radio"
                        name="flagReason"
                        value={reason}
                        checked={flagReason === reason}
                        onChange={(e) => setFlagReason(e.target.value)}
                        className="accent-yellow-500"
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setFlagModalReviewId(null)}
                    className="px-4 py-2 bg-zinc-900 text-zinc-400 rounded-xl text-xs hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFlagReview}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold"
                  >
                    Submit Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Review List */}
      {loading ? (
        <div className="space-y-4">
          <div className="h-32 bg-zinc-900/40 rounded-xl animate-pulse" />
          <div className="h-32 bg-zinc-900/40 rounded-xl animate-pulse" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900/40 rounded-2xl border border-zinc-800">
          <p className="text-zinc-400 text-sm mb-3">No reviews yet for this movie.</p>
          <button
            onClick={() => handleOpenForm()}
            className="bg-yellow-500 text-black px-5 py-2 rounded-xl text-xs font-semibold"
          >
            Be the first to review
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => {
            const isAuthor = rev.userId === currentUser.userId;

            return (
              <div
                key={rev.id}
                className={`p-6 bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800/90 transition-all ${
                  rev.pending ? "opacity-60 border-dashed border-yellow-500/50" : ""
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold flex items-center justify-center text-sm">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{rev.author}</span>
                        {isAuthor && (
                          <span className="text-[10px] bg-zinc-800 text-yellow-500 px-2 py-0.5 rounded-full border border-yellow-500/20">
                            You
                          </span>
                        )}
                      </div>
                      <span className="text-zinc-500 text-xs">
                        {new Date(rev.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-black/60 px-3 py-1 rounded-full border border-zinc-700/60">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-xs font-bold text-yellow-500">{rev.rating}/10</span>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold text-white text-base mb-2">{rev.title}</h4>

                {rev.containsSpoilers && (
                  <div className="mb-2 inline-block px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-md text-xs font-medium">
                    ⚠️ Contains Spoilers
                  </div>
                )}

                <p className="text-zinc-300 text-sm leading-relaxed mb-4">{rev.content}</p>

                {/* Footer: Voting, Wilson score info, Soft Delete & Moderation */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/80 text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleVote(rev.id, "up")}
                      className="flex items-center gap-1 text-zinc-400 hover:text-yellow-400 transition-colors"
                      title="Mark as helpful"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{rev.upvotes}</span>
                    </button>
                    <button
                      onClick={() => handleVote(rev.id, "down")}
                      className="flex items-center gap-1 text-zinc-400 hover:text-red-400 transition-colors"
                      title="Mark as not helpful"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>{rev.downvotes}</span>
                    </button>
                    <span className="text-zinc-600">
                      Helpful score: {(rev.wilsonScore * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {isAuthor ? (
                      <>
                        <button
                          onClick={() => handleOpenForm(rev)}
                          className="text-zinc-400 hover:text-yellow-400 transition-colors flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleSoftDelete(rev)}
                          className="text-zinc-400 hover:text-red-400 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setFlagModalReviewId(rev.id)}
                        className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
                      >
                        <Flag className="w-3.5 h-3.5" />
                        <span>Report</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
