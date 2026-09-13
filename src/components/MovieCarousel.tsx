"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import MovieCard, { MovieCardProps } from "./MovieCard";
import { usePrefetchMovie } from "@/lib/hooks/useMovieQueries";

export interface MovieCarouselProps {
  movies: (MovieCardProps & { id: number | string })[];
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies }) => {
  const [startIndex, setStartIndex] = useState(0);
  const { prefetchMovie } = usePrefetchMovie();
  const visibleMovies = 4;

  const nextSlide = () => {
    setStartIndex((prev) =>
      prev + visibleMovies >= movies.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev === 0 ? Math.max(0, movies.length - visibleMovies) : prev - 1
    );
  };

  return (
    <div className="relative group">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${startIndex * (100 / visibleMovies)}%)`,
          }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 p-2"
            >
              <Link
                href={`/movie/${movie.id}`}
                className="block h-full"
                onMouseEnter={() => prefetchMovie(movie.id)}
              >
                <MovieCard {...movie} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {movies.length > visibleMovies && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous movies slide"
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-zinc-700"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next movies slide"
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-zinc-700"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}
    </div>
  );
};

export default MovieCarousel;
