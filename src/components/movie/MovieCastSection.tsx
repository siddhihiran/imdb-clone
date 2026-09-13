import React from "react";
import Link from "next/link";
import { requestCoalescer } from "@/lib/api/requestCoalescer";
import { movieApi } from "@/lib/api/client";
import { Skeleton } from "../ui/Skeleton";

interface CastProps {
  movieId: string | number;
}

export function CastSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-zinc-900/40 rounded-xl border border-zinc-800">
          <Skeleton className="w-24 h-24 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function MovieCastSection({ movieId }: CastProps) {
  // RSC server fetch with coalescing
  const movie = await requestCoalescer.coalesce(`cast-${movieId}`, () =>
    movieApi.getMovieById(movieId)
  );

  const cast = movie?.cast || [];

  if (cast.length === 0) {
    return (
      <div className="p-6 bg-zinc-900/40 rounded-xl border border-zinc-800 text-zinc-400 text-sm">
        No cast members listed for this title.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {cast.map((actor) => (
        <Link
          key={actor.id}
          href={`/actor/${actor.id}`}
          className="bg-zinc-900/60 backdrop-blur-sm rounded-xl p-4 hover:bg-zinc-800/70 transition-all flex gap-4 border border-zinc-800/80 group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={actor.image}
            alt={actor.name}
            className="w-24 h-24 rounded-xl object-cover"
            loading="lazy"
          />
          <div>
            <h3 className="font-semibold text-lg mb-1 group-hover:text-yellow-400 transition-colors">
              {actor.name}
            </h3>
            <p className="text-zinc-400 mb-2 text-sm">{actor.role}</p>
            <p className="text-xs text-zinc-500 line-clamp-2">
              {actor.bio}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
