import { NextRequest, NextResponse } from "next/server";
import { reviewSchema, calculateWilsonScore, ReviewRecord } from "@/lib/reviews/reviewModel";
import { rateLimiter } from "@/lib/api/rateLimiter";

// Idempotency cache: key -> ReviewRecord
const idempotencyStore = new Map<string, ReviewRecord>();

// Simple profanity list for content moderation filter
const BANNED_WORDS = ["scam", "hate_speech_sample", "bot_abuse", "malware_link"];

function containsProfanity(text: string): boolean {
  const lower = text.toLowerCase();
  return BANNED_WORDS.some((word) => lower.includes(word));
}

// In-memory persistent server store for reviews
const globalReviews: ReviewRecord[] = [
  {
    id: "rev-dune-1",
    movieId: "1",
    userId: "user-cine-101",
    author: "DenisFanboy",
    rating: 10,
    title: "The defining sci-fi epic of this generation",
    content:
      "Denis Villeneuve has accomplished something historic. The sand worms, the Harkonnen arena sequence in infrared monochrome, and Hans Zimmer's percussive soundtrack combine into pure cinematic perfection.",
    containsSpoilers: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    upvotes: 245,
    downvotes: 12,
    wilsonScore: calculateWilsonScore(245, 12),
  },
  {
    id: "rev-dune-2",
    movieId: "1",
    userId: "user-critic-99",
    author: "ArrakisWatcher",
    rating: 9,
    title: "Stunning ambition with extraordinary performances",
    content:
      "Timothée Chalamet's transformation from exiled prince to terrifying messiah is utterly commanding. Austin Butler as Feyd-Rautha is hypnotic.",
    containsSpoilers: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    upvotes: 180,
    downvotes: 9,
    wilsonScore: calculateWilsonScore(180, 9),
  },
  {
    id: "rev-opp-1",
    movieId: "2",
    userId: "user-history-77",
    author: "QuantumMind",
    rating: 9,
    title: "A masterclass in tension and moral catastrophe",
    content:
      "Christopher Nolan weaves three timelines seamlessly. The sound design during the Trinity test is unforgettable.",
    containsSpoilers: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    upvotes: 310,
    downvotes: 15,
    wilsonScore: calculateWilsonScore(310, 15),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get("movieId");
  const sort = searchParams.get("sort") || "wilson";
  const includeDeleted = searchParams.get("includeDeleted") === "true";

  let results = globalReviews.filter(
    (r) => (!movieId || r.movieId.toString() === movieId.toString()) && (includeDeleted || !r.isDeleted)
  );

  // Sorting
  if (sort === "wilson") {
    results.sort((a, b) => b.wilsonScore - a.wilsonScore);
  } else if (sort === "rating-desc") {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sort === "rating-asc") {
    results.sort((a, b) => a.rating - b.rating);
  } else if (sort === "newest") {
    results.sort((a, b) => b.createdAt - a.createdAt);
  } else if (sort === "controversial") {
    results.sort((a, b) => {
      const aTotal = a.upvotes + a.downvotes;
      const bTotal = b.upvotes + b.downvotes;
      const aDiff = Math.abs(a.upvotes - a.downvotes);
      const bDiff = Math.abs(b.upvotes - b.downvotes);
      const aControversy = aTotal / (aDiff + 1);
      const bControversy = bTotal / (bDiff + 1);
      return bControversy - aControversy;
    });
  }

  return NextResponse.json(results);
}

export async function POST(request: NextRequest) {
  // Rate limiting check
  if (!rateLimiter.isAllowed("review-submit")) {
    return NextResponse.json(
      { error: "Too many review submissions. Please wait a moment." },
      { status: 429, headers: { "Retry-After": "2" } }
    );
  }

  try {
    const json = await request.json();

    // Idempotency Key check to prevent double posts under flaky networks
    const idempotencyKey =
      request.headers.get("Idempotency-Key") || json.idempotencyKey;
    if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
      return NextResponse.json(idempotencyStore.get(idempotencyKey), { status: 200 });
    }

    // Profanity Filter check
    if (containsProfanity(json.title || "") || containsProfanity(json.content || "")) {
      return NextResponse.json(
        { error: "Review violates community moderation standards (prohibited content detected)." },
        { status: 422 }
      );
    }

    // Zod validation
    const parsed = reviewSchema.parse(json);

    const newReview: ReviewRecord = {
      ...parsed,
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      userId: "current-user-id",
      createdAt: Date.now(),
      upvotes: 1,
      downvotes: 0,
      wilsonScore: calculateWilsonScore(1, 0),
      idempotencyKey,
      revisionHistory: [],
    };

    globalReviews.unshift(newReview);

    if (idempotencyKey) {
      idempotencyStore.set(idempotencyKey, newReview);
    }

    return NextResponse.json(newReview, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.issues || error.errors || error.message || "Invalid review data" },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const json = await request.json();
    const { id, ...updates } = json;

    const index = globalReviews.findIndex((r) => r.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const existing = globalReviews[index];

    // Profanity filter on updates
    if (
      (updates.title && containsProfanity(updates.title)) ||
      (updates.content && containsProfanity(updates.content))
    ) {
      return NextResponse.json(
        { error: "Updated review violates community moderation standards." },
        { status: 422 }
      );
    }

    const parsed = reviewSchema.partial().parse(updates);

    // Record revision history for diff-based tracking
    const history = existing.revisionHistory || [];
    history.push({
      title: existing.title,
      content: existing.content,
      rating: existing.rating,
      editedAt: Date.now(),
    });

    const updatedReview: ReviewRecord = {
      ...existing,
      ...parsed,
      updatedAt: Date.now(),
      revisionHistory: history,
    };

    globalReviews[index] = updatedReview;
    return NextResponse.json(updatedReview);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const action = searchParams.get("action"); // 'soft', 'undo', or 'hard'

  if (!id) {
    return NextResponse.json({ error: "Review ID required" }, { status: 400 });
  }

  const review = globalReviews.find((r) => r.id === id);
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  if (action === "undo") {
    // Undo soft delete
    review.isDeleted = false;
    return NextResponse.json({ success: true, restored: true, review });
  } else {
    // Soft delete
    review.isDeleted = true;
    return NextResponse.json({ success: true, softDeleted: true, reviewId: id });
  }
}
