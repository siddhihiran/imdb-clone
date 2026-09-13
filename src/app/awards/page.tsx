import React from "react";
import { Award, Trophy, Star } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academy Awards & Critical Acclaim | MovieDB",
  description: "Explore Academy Award winners, Golden Globe nominees, and critically acclaimed films.",
};

const awardWinners = [
  {
    id: 3,
    title: "Oppenheimer",
    year: 2023,
    awards: ["Best Picture", "Best Director", "Best Actor", "Best Supporting Actor"],
    rating: 8.9,
    image:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80",
    description: "Winner of 7 Academy Awards including Best Picture and Best Director.",
  },
  {
    id: 2,
    title: "Poor Things",
    year: 2023,
    awards: ["Best Actress", "Best Production Design", "Best Makeup & Hairstyling"],
    rating: 8.4,
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
    description: "Winner of 4 Academy Awards, including Best Actress for Emma Stone.",
  },
  {
    id: 4,
    title: "The Zone of Interest",
    year: 2023,
    awards: ["Best International Feature Film", "Best Sound"],
    rating: 7.9,
    image:
      "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=800&q=80",
    description: "Groundbreaking historical masterpiece honored with 2 Academy Awards.",
  },
];

export default function AwardsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-bold text-glow">Awards & Critical Acclaim</h1>
      </div>

      <div className="space-y-6">
        {awardWinners.map((film) => (
          <div
            key={film.id}
            className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden p-6 flex flex-col md:flex-row gap-6 items-center shadow-lg hover:border-yellow-500/50 transition-all"
          >
            <div className="w-full md:w-48 aspect-[2/3] relative rounded-lg overflow-hidden flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={film.image}
                alt={film.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-white">{film.title} ({film.year})</h2>
                <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-full border border-zinc-700">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-yellow-500 font-semibold text-sm">{film.rating}</span>
                </div>
              </div>
              <p className="text-zinc-300 text-sm mb-4">{film.description}</p>
              <div className="space-y-2 mb-6">
                <p className="text-xs uppercase tracking-wider text-yellow-500 font-semibold">Key Accolades</p>
                <div className="flex flex-wrap gap-2">
                  {film.awards.map((award, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 text-xs px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded-full"
                    >
                      <Award className="w-3.5 h-3.5" />
                      {award}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                href={`/movie/${film.id}`}
                className="inline-block bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors border border-zinc-700"
              >
                View Full Accolades & Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
