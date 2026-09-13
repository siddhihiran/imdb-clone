import React from "react";
import { SlidersHorizontal, Star } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Movies | MovieDB",
  description: "Browse popular movies, trending titles, and search your favorite cinema.",
};

const allMovies = [
  {
    id: 1,
    title: "Dune: Part Two",
    rating: 8.8,
    image:
      "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=800&q=80",
    year: 2024,
    genre: ["Action", "Adventure", "Sci-Fi"],
  },
  {
    id: 2,
    title: "Poor Things",
    rating: 8.4,
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
    year: 2023,
    genre: ["Comedy", "Drama", "Romance"],
  },
  {
    id: 3,
    title: "Oppenheimer",
    rating: 8.9,
    image:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80",
    year: 2023,
    genre: ["Biography", "Drama", "History"],
  },
  {
    id: 4,
    title: "The Batman",
    rating: 8.5,
    image:
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=800&q=80",
    year: 2024,
    genre: ["Action", "Crime", "Drama"],
  },
  {
    id: 5,
    title: "Killers of the Flower Moon",
    rating: 8.7,
    image:
      "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=800&q=80",
    year: 2023,
    genre: ["Crime", "Drama", "History"],
  },
];

interface MoviesPageProps {
  searchParams?: {
    search?: string;
    sort?: string;
  };
}

export default function MoviesPage({ searchParams }: MoviesPageProps) {
  const search = searchParams?.search || "";
  const sort = searchParams?.sort;

  const filteredMovies = search
    ? allMovies.filter((m) =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.genre.some((g) => g.toLowerCase().includes(search.toLowerCase()))
      )
    : allMovies;

  const title = search
    ? `Search Results for "${search}"`
    : sort === "trending"
    ? "Trending Movies"
    : "Popular Movies";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-glow">{title}</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Showing {filteredMovies.length} {filteredMovies.length === 1 ? "movie" : "movies"}
          </p>
        </div>
        <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-xl transition-colors border border-zinc-700">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {filteredMovies.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800">
          <p className="text-zinc-400 text-lg mb-4">No movies found matching &ldquo;{search}&rdquo;</p>
          <Link
            href="/movies"
            className="inline-block bg-yellow-500 text-black px-6 py-2 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
          >
            Clear Search
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMovies.map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`} className="group">
              <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-lg">
                <div className="relative aspect-video">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 border border-zinc-700/50">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-yellow-500 font-medium">
                      {movie.rating}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-yellow-400 transition-colors">
                    {movie.title}
                  </h2>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-zinc-400">{movie.year}</span>
                    <div className="flex gap-2">
                      {movie.genre.slice(0, 2).map((g) => (
                        <span
                          key={g}
                          className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-300 border border-zinc-700/60"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
