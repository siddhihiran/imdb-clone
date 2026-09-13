import React from "react";
import { MovieCarouselSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-pulse">
      <div className="h-[50vh] bg-zinc-900/60 rounded-2xl w-full" />
      <div className="space-y-4">
        <div className="h-8 bg-zinc-800/80 rounded w-48" />
        <MovieCarouselSkeleton />
      </div>
    </div>
  );
}
