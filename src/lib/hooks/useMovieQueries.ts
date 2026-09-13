"use client";

import { useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { MovieItem } from "../data/mockData";
import { PaginatedResult, PaginationParams } from "../api/client";

async function fetchMovies(params: PaginationParams = {}): Promise<PaginatedResult<MovieItem>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.cursor) searchParams.set("cursor", params.cursor);
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.genre) searchParams.set("genre", params.genre);
  if (params.search) searchParams.set("search", params.search);

  const res = await fetch(`/api/movies?${searchParams.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
}

async function fetchMovie(id: string | number): Promise<MovieItem> {
  const res = await fetch(`/api/movies/${id}`);
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}

/**
 * Standard query for movies with deduplication and caching
 */
export function useMoviesQuery(params: PaginationParams = {}) {
  return useQuery({
    queryKey: ["movies", params],
    queryFn: () => fetchMovies(params),
  });
}

/**
 * Cursor-based infinite query for seamless scrolling
 */
export function useInfiniteMovies(params: Omit<PaginationParams, "cursor"> = {}) {
  return useInfiniteQuery({
    queryKey: ["movies", "infinite", params],
    queryFn: ({ pageParam }) => fetchMovies({ ...params, cursor: pageParam as string | null }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor ?? undefined,
  });
}

/**
 * Single movie query with cache deduplication
 */
export function useMovie(id: string | number) {
  return useQuery({
    queryKey: ["movie", id.toString()],
    queryFn: () => fetchMovie(id),
    enabled: Boolean(id),
  });
}

/**
 * Prefetch on hover hook
 */
export function usePrefetchMovie() {
  const queryClient = useQueryClient();

  const prefetchMovie = (id: string | number) => {
    queryClient.prefetchQuery({
      queryKey: ["movie", id.toString()],
      queryFn: () => fetchMovie(id),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  return { prefetchMovie };
}
