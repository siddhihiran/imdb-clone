"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, Trash2, Film, Star, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { watchlistStore } from "@/lib/watchlist/watchlistStore";
import { MovieItem } from "@/lib/data/mockData";

export default function WatchlistPage() {
  const [items, setItems] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [rollbackAlert, setRollbackAlert] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = watchlistStore.subscribe((updatedItems) => {
      setItems(updatedItems);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleRemove = async (movieId: string | number) => {
    await watchlistStore.remove(movieId);
  };

  // Trigger test for optimistic update rollback
  const handleTestRollback = async () => {
    const dummyMovie: MovieItem = {
      id: 9999,
      title: "Temporary Rollback Test Movie",
      rating: 7.5,
      year: 2024,
      genre: ["Action", "Test"],
      description: "This item will fail to save to backend and rollback optimistically.",
      image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=800&q=80",
    };

    setRollbackAlert("Adding item optimistically... backend will simulate a failure.");
    const success = await watchlistStore.add(dummyMovie, true /* simulate failure */);

    if (!success) {
      setRollbackAlert("Backend failed as expected! State was successfully rolled back.");
      setTimeout(() => setRollbackAlert(null), 4000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-yellow-500 fill-yellow-500/20" />
            <h1 className="text-3xl font-bold text-glow">My Watchlist</h1>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Persisted locally with IndexedDB & synced across devices and browser tabs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTestRollback}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 px-3.5 py-2 rounded-xl transition-all"
            title="Tests optimistic UI addition and automatic rollback when backend fails"
          >
            🧪 Test Backend Rollback
          </button>
          <span className="text-sm font-semibold bg-yellow-500 text-black px-3.5 py-1.5 rounded-full shadow-md">
            {items.length} {items.length === 1 ? "title" : "titles"}
          </span>
        </div>
      </div>

      {rollbackAlert && (
        <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{rollbackAlert}</span>
        </div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-zinc-900/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/40 rounded-3xl border border-zinc-800 shadow-xl max-w-xl mx-auto p-8">
          <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4 text-yellow-500">
            <Film className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Your watchlist is empty</h2>
          <p className="text-zinc-400 text-sm mb-6 max-w-sm mx-auto">
            Explore popular cinema and click &ldquo;Add to Watchlist&rdquo; on any movie details page.
          </p>
          <Link
            href="/movies"
            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md active:scale-95"
          >
            <span>Explore Movies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {items.map((movie) => (
              <motion.div
                key={movie.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
                className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-yellow-500/40 transition-all group"
              >
                <div className="flex">
                  <div className="w-28 sm:w-32 aspect-[2/3] relative flex-shrink-0 bg-zinc-800 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs text-zinc-400">{movie.year}</span>
                        <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md border border-zinc-800 text-xs">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-yellow-500 font-bold">{movie.rating}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-white text-base truncate group-hover:text-yellow-400 transition-colors">
                        {movie.title}
                      </h3>

                      {movie.genre && movie.genre.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {movie.genre.slice(0, 2).map((g) => (
                            <span
                              key={g}
                              className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-zinc-800/80">
                      <Link
                        href={`/movie/${movie.id}`}
                        className="text-xs text-yellow-500 hover:text-yellow-400 font-semibold"
                      >
                        View Details →
                      </Link>
                      <button
                        onClick={() => handleRemove(movie.id)}
                        className="text-zinc-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                        title="Remove from Watchlist"
                        aria-label="Remove from Watchlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
