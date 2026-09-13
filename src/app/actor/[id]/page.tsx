import React from "react";
import { Award, Instagram, Star, Twitter, Film } from "lucide-react";
import { Metadata } from "next";
import { movieApi } from "@/lib/api/client";
import { requestCoalescer } from "@/lib/api/requestCoalescer";
import FilmographyVirtualExplorer, { FilmographyRecord } from "@/components/actor/FilmographyVirtualExplorer";
import { ActorItem } from "@/lib/data/mockData";

// Incremental Static Regeneration (ISR) configuration
export const revalidate = 3600; // revalidate at most once every hour

// Pre-render top actors at build time
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }];
}

interface ActorPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ActorPageProps): Promise<Metadata> {
  const actor =
    (await requestCoalescer.coalesce(`actor-meta-${params.id}`, () =>
      movieApi.getActorById(params.id)
    )) || ({} as ActorItem);

  return {
    title: `${actor.name || "Actor Profile"} | MovieDB`,
    description: actor.biography || "Actor filmography, awards, and biography on MovieDB.",
  };
}

export default async function ActorDetailsPage({ params }: ActorPageProps) {
  const actor = await requestCoalescer.coalesce(`actor-data-${params.id}`, () =>
    movieApi.getActorById(params.id)
  );

  if (!actor) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Actor Not Found</h1>
        <p className="text-zinc-400">The requested actor profile could not be located.</p>
      </div>
    );
  }

  // Combine knownFor and extensive filmography
  const filmographyData: FilmographyRecord[] = (actor.filmography || actor.knownFor.map((m) => ({
    id: m.id,
    title: m.title,
    role: m.role,
    roleCategory: "Lead" as const,
    year: m.year,
    rating: m.rating,
    genre: ["Drama", "Action"],
    character: m.role,
    image: m.image,
  }))) as FilmographyRecord[];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Header */}
      <div className="relative h-[400px] mb-8 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${actor.coverImage || actor.knownFor[0]?.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>
        <div className="relative h-full container mx-auto px-6 flex items-end pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={actor.image}
              alt={actor.name}
              className="w-36 h-36 sm:w-48 sm:h-48 rounded-2xl object-cover border-4 border-zinc-900 shadow-2xl hover-glow"
            />
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold mb-3 text-glow">{actor.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-800">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold text-yellow-500">{actor.stats.avgRating} Avg Rating</span>
                </div>
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-800">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span className="text-zinc-200">{actor.stats.totalAwards} Awards</span>
                </div>
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-800">
                  <Film className="w-4 h-4 text-yellow-500" />
                  <span className="text-zinc-200">{filmographyData.length} Filmography Titles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div>
          <div className="sticky top-24 space-y-6">
            <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800 shadow-xl">
              <h2 className="font-semibold text-lg mb-4 text-glow">Personal Info</h2>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-zinc-400">Born</dt>
                  <dd className="text-zinc-200 font-medium">{actor.birthDate}</dd>
                </div>
                <div>
                  <dt className="text-zinc-400">Place of Birth</dt>
                  <dd className="text-zinc-200 font-medium">{actor.birthPlace}</dd>
                </div>
                <div>
                  <dt className="text-zinc-400">Nationality</dt>
                  <dd className="text-zinc-200 font-medium">{actor.nationality}</dd>
                </div>
                <div>
                  <dt className="text-zinc-400">Height</dt>
                  <dd className="text-zinc-200 font-medium">{actor.height}</dd>
                </div>
                <div>
                  <dt className="text-zinc-400">Years Active</dt>
                  <dd className="text-zinc-200 font-medium">{actor.stats.yearsActive}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800 shadow-xl">
              <h2 className="font-semibold text-lg mb-4 text-glow">Social Media</h2>
              <div className="flex gap-4">
                <a
                  href={actor.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white p-2.5 bg-zinc-800/80 rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-700/50"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={actor.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white p-2.5 bg-zinc-800/80 rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-700/50"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-12">
          {/* Biography */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-glow">Biography</h2>
            <p className="text-zinc-300 text-lg leading-relaxed bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/60">
              {actor.biography}
            </p>
          </section>

          {/* Awards & Nominations */}
          {actor.awards && actor.awards.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-glow">Awards & Nominations</h2>
              <div className="grid gap-3">
                {actor.awards.map((award, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-zinc-900/60 backdrop-blur-sm p-4 rounded-xl border border-zinc-800"
                  >
                    <Award className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-white">{award.name}</span>
                      <span className="mx-2 text-zinc-500">|</span>
                      <span className="text-zinc-400">{award.year}</span>
                      <p className="text-sm text-zinc-400">
                        {award.category} — <span className="text-zinc-200">{award.film}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Client-Side Virtualized Filmography Explorer */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-glow">Filmography Explorer</h2>
                <p className="text-zinc-400 text-sm">
                  Virtualized catalog with interactive multi-attribute filtering
                </p>
              </div>
            </div>

            <FilmographyVirtualExplorer filmography={filmographyData} />
          </section>
        </div>
      </div>
    </div>
  );
}
