"use client";

import React from "react";
import { Star, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const movies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    rating: 9.3,
    image:
      "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=800&q=80",
    year: 1994,
    votes: "2.8M",
    rank: 1,
  },
  {
    id: 2,
    title: "The Godfather",
    rating: 9.2,
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
    year: 1972,
    votes: "2.1M",
    rank: 2,
  },
  {
    id: 3,
    title: "The Dark Knight",
    rating: 9.0,
    image:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80",
    year: 2008,
    votes: "2.7M",
    rank: 3,
  },
];

export default function TopRatedPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
        <Trophy className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-bold text-glow">Top Rated Movies</h1>
      </motion.div>
      <div className="space-y-6">
        {movies.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/movie/${movie.id}`} className="block group">
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl overflow-hidden shadow-lg hover:border-yellow-500/50 hover:shadow-yellow-500/10 transition-all duration-300">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-20 bg-yellow-500 flex items-center justify-center text-black font-extrabold text-2xl py-3 sm:py-0">
                    #{movie.rank}
                  </div>
                  <div className="relative w-full sm:w-48 aspect-[16/9] sm:aspect-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <h2 className="text-xl sm:text-2xl font-semibold text-white group-hover:text-yellow-400 transition-colors">
                        {movie.title}
                      </h2>
                      <div className="flex items-center gap-1.5 bg-black/60 border border-zinc-700 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-bold text-yellow-500">
                          {movie.rating}
                        </span>
                      </div>
                    </div>
                    <div className="text-zinc-400 text-sm">
                      <span>{movie.year}</span>
                      <span className="mx-2">•</span>
                      <span>{movie.votes} votes</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
