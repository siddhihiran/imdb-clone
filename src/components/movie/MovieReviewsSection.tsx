import React from "react";
import { Star, MessageSquare } from "lucide-react";
import { Skeleton } from "../ui/Skeleton";

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  helpfulCount: number;
}

const mockReviewsByMovie: Record<string, ReviewItem[]> = {
  "1": [
    {
      id: "rev-1",
      author: "CinemaEnthusiast",
      rating: 9,
      date: "March 5, 2024",
      content:
        "Denis Villeneuve has crafted an absolute masterpiece. The scale, sound design, and performances from Timothée Chalamet and Zendaya elevate sci-fi to high art.",
      helpfulCount: 428,
    },
    {
      id: "rev-2",
      author: "SciFiCritic",
      rating: 10,
      date: "March 3, 2024",
      content:
        "Visually staggering and narratively gripping. A worthy successor to Part One that delivers on every front with jaw-dropping desert cinematography.",
      helpfulCount: 312,
    },
  ],
  "2": [
    {
      id: "rev-3",
      author: "HistoryBuff",
      rating: 9,
      date: "July 24, 2023",
      content:
        "Cillian Murphy gives the performance of a lifetime. The sound design during the Trinity test sequence left the entire auditorium breathless.",
      helpfulCount: 512,
    },
  ],
};

export function ReviewsSectionSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="p-6 bg-zinc-900/40 rounded-xl border border-zinc-800 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
}

export default async function MovieReviewsSection({ movieId }: { movieId: string | number }) {
  // Simulate asynchronous RSC fetch for progressive streaming
  const reviews = mockReviewsByMovie[movieId.toString()] || [
    {
      id: `default-rev-${movieId}`,
      author: "FilmAficionado",
      rating: 8,
      date: "Recently",
      content:
        "An engaging cinematic experience with exceptional direction and memorable set pieces.",
      helpfulCount: 89,
    },
  ];

  return (
    <div className="space-y-4">
      {reviews.map((rev) => (
        <div
          key={rev.id}
          className="p-6 bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-yellow-500/20 text-yellow-500 font-bold flex items-center justify-center text-sm">
                {rev.author.charAt(0)}
              </div>
              <div>
                <span className="font-semibold text-white text-sm">{rev.author}</span>
                <span className="text-zinc-500 text-xs ml-2">{rev.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-full border border-zinc-700/50">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
              <span className="text-xs font-semibold text-yellow-500">{rev.rating}/10</span>
            </div>
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed">{rev.content}</p>
          <div className="flex items-center gap-2 text-xs text-zinc-500 pt-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{rev.helpfulCount} people found this helpful</span>
          </div>
        </div>
      ))}
    </div>
  );
}
