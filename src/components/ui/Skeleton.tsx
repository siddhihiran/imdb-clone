import React from "react";

export function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-zinc-800/60 ${className}`}
      {...props}
    />
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800/80 p-0 flex flex-col h-full">
      <div className="relative aspect-[2/3] w-full">
        <Skeleton className="w-full h-full rounded-none" />
        <div className="absolute top-4 right-4">
          <Skeleton className="w-14 h-6 rounded-md" />
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-12 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MovieCarouselSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function MovieDetailsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="relative h-[80vh] bg-zinc-900/60">
        <div className="container mx-auto px-4 h-full flex items-end pb-12">
          <div className="grid md:grid-cols-3 gap-8 items-end w-full">
            <Skeleton className="aspect-[2/3] rounded-xl hidden md:block" />
            <div className="md:col-span-2 space-y-4">
              <div className="flex gap-3">
                <Skeleton className="w-24 h-8 rounded-full" />
                <Skeleton className="w-24 h-8 rounded-full" />
              </div>
              <Skeleton className="w-3/4 h-12 rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="w-16 h-6 rounded-full" />
                <Skeleton className="w-16 h-6 rounded-full" />
              </div>
              <div className="flex gap-4 pt-2">
                <Skeleton className="w-40 h-12 rounded-xl" />
                <Skeleton className="w-40 h-12 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
