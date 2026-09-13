import React from "react";
import { Clock, Calendar, Star } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon Movies | MovieDB",
  description: "Anticipated upcoming movie releases, release dates, and early trailers.",
};

const comingSoonList = [
  {
    id: 6,
    title: "Deadpool & Wolverine",
    releaseDate: "July 26, 2024",
    rating: 9.1,
    genre: ["Action", "Comedy", "Sci-Fi"],
    image:
      "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=800&q=80",
    description:
      "Wolverine is recovering from his injuries when he crosses paths with the loudmouth, Deadpool. They team up to defeat a common enemy.",
  },
  {
    id: 8,
    title: "Kingdom of the Planet of the Apes",
    releaseDate: "May 10, 2024",
    rating: 8.3,
    genre: ["Action", "Adventure", "Sci-Fi"],
    image:
      "https://images.unsplash.com/photo-1533973860717-d49dfd14cf64?auto=format&fit=crop&w=800&q=80",
    description:
      "Many years after the reign of Caesar, a young ape goes on a journey that will lead him to question everything he's been taught about the past.",
  },
  {
    id: 9,
    title: "Furiosa: A Mad Max Saga",
    releaseDate: "May 24, 2024",
    rating: 8.6,
    genre: ["Action", "Adventure", "Sci-Fi"],
    image:
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=800&q=80",
    description:
      "The origin story of renegade warrior Furiosa before her encounter and teamup with Mad Max.",
  },
];

export default function ComingSoonPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Clock className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-bold text-glow">Coming Soon to Theaters</h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {comingSoonList.map((movie) => (
          <div
            key={movie.id}
            className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md flex items-center gap-1 border border-zinc-700">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-yellow-500 font-semibold text-sm">{movie.rating}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                  <Calendar className="w-4 h-4 text-yellow-500" />
                  <span>{movie.releaseDate}</span>
                </div>
                <h2 className="text-xl font-bold mb-2 text-white">{movie.title}</h2>
                <p className="text-zinc-400 text-sm line-clamp-3 mb-4">{movie.description}</p>
                <div className="flex flex-wrap gap-2">
                  {movie.genre.map((g) => (
                    <span
                      key={g}
                      className="text-xs px-2.5 py-1 bg-zinc-800 rounded-full text-zinc-300 border border-zinc-700/50"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 pt-0">
              <Link
                href={`/movie/${movie.id}`}
                className="block text-center w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2.5 rounded-xl transition-colors"
              >
                View Preview
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
