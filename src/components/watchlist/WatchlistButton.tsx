"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Heart, Check, Sparkles } from "lucide-react";
import { watchlistStore } from "@/lib/watchlist/watchlistStore";
import { MovieItem } from "@/lib/data/mockData";

interface WatchlistButtonProps {
  movie: MovieItem;
  variant?: "full" | "icon" | "pill";
  className?: string;
}

export default function WatchlistButton({
  movie,
  variant = "full",
  className = "",
}: WatchlistButtonProps) {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isSparkling, setIsSparkling] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      setInWatchlist(watchlistStore.isInWatchlist(movie.id));
    };
    checkStatus();

    // Subscribe to store updates (including cross-tab broadcasts!)
    const unsubscribe = watchlistStore.subscribe(() => {
      checkStatus();
    });

    return unsubscribe;
  }, [movie.id]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWatchlist) {
      await watchlistStore.remove(movie.id);
    } else {
      setIsSparkling(true);
      setTimeout(() => setIsSparkling(false), 800);
      await watchlistStore.add(movie);
    }
  };

  if (variant === "icon") {
    return (
      <motion.button
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        onClick={handleToggle}
        title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        aria-label={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        className={`relative p-2.5 rounded-full backdrop-blur-md transition-colors border shadow-md ${
          inWatchlist
            ? "bg-yellow-500 text-black border-yellow-400"
            : "bg-black/60 text-zinc-300 hover:text-white border-zinc-700/60 hover:bg-black/80"
        } ${className}`}
      >
        <AnimatePresence mode="wait">
          {inWatchlist ? (
            <motion.div
              key="saved"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 45 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </motion.div>
          ) : (
            <motion.div
              key="not-saved"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Bookmark className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      className={`relative px-6 py-3 rounded-xl font-semibold flex items-center gap-2.5 transition-all shadow-md active:scale-95 ${
        inWatchlist
          ? "bg-yellow-500 text-black border border-yellow-400 hover:bg-yellow-400"
          : "bg-zinc-800/80 backdrop-blur-sm text-white hover:bg-zinc-700 border border-zinc-700"
      } ${className}`}
      aria-pressed={inWatchlist}
    >
      <AnimatePresence mode="wait">
        {inWatchlist ? (
          <motion.div
            key="checked"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className="flex items-center gap-2"
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>In Watchlist</span>
          </motion.div>
        ) : (
          <motion.div
            key="unchecked"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            <Heart className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
            <span>Add to Watchlist</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Particle Feedback Burst */}
      {isSparkling && (
        <motion.span
          initial={{ opacity: 0, scale: 0.5, y: 0 }}
          animate={{ opacity: 1, scale: 1.3, y: -20 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute -top-3 right-2 text-yellow-400 pointer-events-none"
        >
          <Sparkles className="w-5 h-5 fill-current" />
        </motion.span>
      )}

      {/* Screen Reader ARIA-Live status update */}
      <span className="sr-only" role="status" aria-live="polite">
        {inWatchlist ? `${movie.title} added to watchlist` : `${movie.title} removed from watchlist`}
      </span>
    </motion.button>
  );
}
