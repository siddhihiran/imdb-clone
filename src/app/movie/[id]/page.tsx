import React, { Suspense } from "react";
import Link from "next/link";
import {
  Award,
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  Globe,
  Heart,
  Share2,
  Star,
  Film,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Metadata } from "next";
import { movieApi } from "@/lib/api/client";
import { requestCoalescer } from "@/lib/api/requestCoalescer";
import MediaCarouselModal from "@/components/movie/MediaCarouselModal";
import MovieCastSection, { CastSectionSkeleton } from "@/components/movie/MovieCastSection";
import ReviewSystem from "@/components/reviews/ReviewSystem";
import WatchlistButton from "@/components/watchlist/WatchlistButton";
import { MovieItem } from "@/lib/data/mockData";

// Fallback static placeholder if an unknown ID or API failure occurs
const staticPlaceholderMovie: MovieItem = {
  id: 0,
  title: "Featured Cinema Title",
  rating: 8.0,
  year: 2024,
  duration: "120 min",
  genre: ["Action", "Drama"],
  director: "Acclaimed Filmmaker",
  description:
    "Explore the gripping narrative, breathtaking visuals, and unforgettable character arcs in this cinematic journey.",
  image:
    "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=2000&q=80",
  backdrop:
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=2000&q=80",
  awards: ["Academy Award Nominee", "Film Festival Selection"],
  boxOffice: "$150.0M",
  language: "English",
  productionCompany: "Major Studio Production",
  releaseDate: "2024-01-01",
  metacriticScore: 80,
  rottenTomatoesScore: 88,
  trailer: "https://www.youtube.com/watch?v=Way9Dexny3w",
};

interface MoviePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const movie =
    (await requestCoalescer.coalesce(`meta-movie-${params.id}`, () =>
      movieApi.getMovieById(params.id)
    )) || staticPlaceholderMovie;

  return {
    title: `${movie.title} (${movie.year}) | MovieDB`,
    description: movie.description,
  };
}

export default async function MovieDetailsPage({ params }: MoviePageProps) {
  // RSC Parallel Fetch with Request Coalescing
  let movie: MovieItem;
  try {
    const fetched = await requestCoalescer.coalesce(`movie-core-${params.id}`, () =>
      movieApi.getMovieById(params.id)
    );
    movie = fetched || staticPlaceholderMovie;
  } catch (error) {
    console.error("[MovieDetailsPage] Failed to fetch movie core data, using graceful fallback:", error);
    movie = staticPlaceholderMovie;
  }

  // Gallery images including backdrop and poster
  const galleryImages = [
    movie.backdrop || movie.image,
    movie.image,
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
  ].filter(Boolean) as string[];

  // Calculate adjacent movie IDs for keyed preloading
  const currentNum = parseInt(params.id, 10) || 1;
  const prevId = currentNum > 1 ? currentNum - 1 : null;
  const nextId = currentNum + 1;

  // JSON-LD Structured Data for Movie
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: movie.description,
    image: movie.image,
    dateCreated: movie.releaseDate,
    director: movie.director
      ? {
          "@type": "Person",
          name: movie.director,
        }
      : undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: movie.rating,
      bestRating: 10,
      worstRating: 1,
      ratingCount: 150000,
    },
  };

  return (
    <div>
      {/* Structured Data (JSON-LD) for Movie */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Keyed Adjacent Movie Preloading Navigation */}
      <div className="bg-zinc-950/80 border-b border-zinc-800/80 backdrop-blur-md sticky top-16 z-30 py-2 px-4">
        <div className="container mx-auto flex items-center justify-between text-sm">
          {prevId ? (
            <Link
              href={`/movie/${prevId}`}
              prefetch={true}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors py-1 px-3 rounded-lg hover:bg-zinc-800/60"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Movie</span>
            </Link>
          ) : (
            <div />
          )}
          <span className="text-xs text-zinc-500 hidden sm:inline font-mono">
            Movie #{movie.id}
          </span>
          <Link
            href={`/movie/${nextId}`}
            prefetch={true}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors py-1 px-3 rounded-lg hover:bg-zinc-800/60"
          >
            <span>Next Movie</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="relative h-[90vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.backdrop || movie.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
          <div className="grid md:grid-cols-3 gap-8 items-end w-full">
            <div className="hidden md:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={movie.image}
                alt={movie.title}
                className="rounded-xl shadow-2xl aspect-[2/3] object-cover border border-zinc-700/50 hover-glow"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-yellow-500 font-semibold">
                    {movie.rating} Rating
                  </span>
                </div>
                {movie.duration && (
                  <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800">
                    <Clock className="w-5 h-5 text-zinc-400" />
                    <span className="text-zinc-300">{movie.duration}</span>
                  </div>
                )}
                {movie.releaseDate && (
                  <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800">
                    <Calendar className="w-5 h-5 text-zinc-400" />
                    <span className="text-zinc-300">{movie.releaseDate}</span>
                  </div>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-glow">
                {movie.title}
              </h1>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre?.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 bg-zinc-800/80 backdrop-blur-sm rounded-full text-sm border border-zinc-700/60"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Interactive Client Trailer & Gallery Modal with A11y */}
              <div className="flex flex-wrap items-center gap-4">
                <MediaCarouselModal
                  trailerUrl={movie.trailer}
                  images={galleryImages}
                  movieTitle={movie.title}
                />
                <WatchlistButton movie={movie} />
                <button
                  aria-label="Share movie"
                  className="bg-zinc-800/80 backdrop-blur-sm text-white px-4 py-3 rounded-xl hover:bg-zinc-700 transition-all border border-zinc-700 active:scale-95"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Progressive Hydration */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-12">
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-glow flex items-center gap-2">
                <Film className="w-6 h-6 text-yellow-500" />
                Overview
              </h2>
              <p className="text-zinc-300 text-lg leading-relaxed bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/60">
                {movie.description}
              </p>
            </section>

            {/* Awards & Critical Recognition */}
            {movie.awards && movie.awards.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 text-glow">Awards & Recognition</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {movie.awards.map((award, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-zinc-900/60 backdrop-blur-sm p-4 rounded-xl border border-zinc-800"
                    >
                      <Award className="w-5 h-5 text-yellow-500" />
                      <span className="text-zinc-200">{award}</span>
                    </div>
                  ))}
                  {movie.metacriticScore !== undefined && (
                    <div className="flex items-center gap-3 bg-zinc-900/60 backdrop-blur-sm p-4 rounded-xl border border-zinc-800">
                      <BarChart3 className="w-5 h-5 text-green-500" />
                      <span className="text-zinc-200">Metacritic: {movie.metacriticScore}/100</span>
                    </div>
                  )}
                  {movie.rottenTomatoesScore !== undefined && (
                    <div className="flex items-center gap-3 bg-zinc-900/60 backdrop-blur-sm p-4 rounded-xl border border-zinc-800">
                      <BarChart3 className="w-5 h-5 text-red-500" />
                      <span className="text-zinc-200">Rotten Tomatoes: {movie.rottenTomatoesScore}%</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Progressive Hydration: Top Cast Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6 text-glow">Top Cast & Credits</h2>
              <Suspense fallback={<CastSectionSkeleton />}>
                <MovieCastSection movieId={params.id} />
              </Suspense>
            </section>

            {/* Interactive Review System with CRUD, Zod, IndexedDB, Wilson Score & Undo */}
            <section>
              <ReviewSystem movieId={params.id} movieTitle={movie.title} />
            </section>
          </div>

          {/* Sticky Sidebar Info */}
          <div>
            <div className="sticky top-24 space-y-6">
              <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800 shadow-xl">
                <h3 className="font-semibold text-lg mb-4 text-glow">Movie Info</h3>
                <dl className="space-y-4 text-sm">
                  {movie.director && (
                    <div>
                      <dt className="text-zinc-400">Director</dt>
                      <dd className="font-medium text-white">{movie.director}</dd>
                    </div>
                  )}
                  {movie.productionCompany && (
                    <div>
                      <dt className="text-zinc-400">Production Company</dt>
                      <dd className="font-medium text-white">{movie.productionCompany}</dd>
                    </div>
                  )}
                  {movie.boxOffice && (
                    <div className="flex items-center gap-2">
                      <dt className="text-zinc-400">Box Office</dt>
                      <dd className="flex items-center gap-1 font-medium text-white">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        {movie.boxOffice}
                      </dd>
                    </div>
                  )}
                  {movie.language && (
                    <div className="flex items-center gap-2">
                      <dt className="text-zinc-400">Language</dt>
                      <dd className="flex items-center gap-1 font-medium text-white">
                        <Globe className="w-4 h-4 text-blue-500" />
                        {movie.language}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
