"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Star, Filter, ArrowUpDown, Calendar, Award } from "lucide-react";
import Link from "next/link";

export interface FilmographyRecord {
  id: number | string;
  title: string;
  role: string;
  roleCategory: "Lead" | "Supporting" | "Voice / Cameo" | "Director / Producer";
  year: number;
  rating: number;
  genre: string[];
  character: string;
  image?: string;
}

interface FilmographyVirtualExplorerProps {
  filmography: FilmographyRecord[];
}

export default function FilmographyVirtualExplorer({
  filmography,
}: FilmographyVirtualExplorerProps) {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"year-desc" | "year-asc" | "rating-desc" | "title">("year-desc");

  // Virtualizer scrolling state
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(550);

  const ITEM_HEIGHT = 104; // 104px per item row
  const OVERSCAN = 3;

  // Extract unique genres & roles for filters
  const allGenres = useMemo(() => {
    const set = new Set<string>();
    filmography.forEach((item) => item.genre.forEach((g) => set.add(g)));
    return Array.from(set).sort();
  }, [filmography]);

  const allRoles: FilmographyRecord["roleCategory"][] = [
    "Lead",
    "Supporting",
    "Voice / Cameo",
    "Director / Producer",
  ];

  // Filter & Sort
  const filteredItems = useMemo(() => {
    let result = [...filmography];

    if (selectedYear !== "all") {
      if (selectedYear === "2024") result = result.filter((m) => m.year === 2024);
      else if (selectedYear === "2023") result = result.filter((m) => m.year === 2023);
      else if (selectedYear === "2020-2022") result = result.filter((m) => m.year >= 2020 && m.year <= 2022);
      else if (selectedYear === "2015-2019") result = result.filter((m) => m.year >= 2015 && m.year <= 2019);
      else if (selectedYear === "pre-2015") result = result.filter((m) => m.year < 2015);
    }

    if (selectedGenre !== "all") {
      result = result.filter((m) => m.genre.includes(selectedGenre));
    }

    if (selectedRole !== "all") {
      result = result.filter((m) => m.roleCategory === selectedRole);
    }

    if (sortBy === "year-desc") {
      result.sort((a, b) => b.year - a.year);
    } else if (sortBy === "year-asc") {
      result.sort((a, b) => a.year - b.year);
    } else if (sortBy === "rating-desc") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [filmography, selectedYear, selectedGenre, selectedRole, sortBy]);

  // Window resize & container resize observer
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight || 550);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Virtualization Window Calculation
  const totalHeight = filteredItems.length * ITEM_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);
  const endIndex = Math.min(
    filteredItems.length,
    Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + OVERSCAN
  );
  const visibleItems = filteredItems.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between shadow-lg">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Filter className="w-4 h-4 text-yellow-500" />
            <span className="font-medium text-zinc-300">Filters:</span>
          </div>

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-yellow-500 cursor-pointer"
            aria-label="Filter by Year"
          >
            <option value="all">All Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2020-2022">2020 – 2022</option>
            <option value="2015-2019">2015 – 2019</option>
            <option value="pre-2015">Pre-2015</option>
          </select>

          {/* Genre Filter */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-yellow-500 cursor-pointer"
            aria-label="Filter by Genre"
          >
            <option value="all">All Genres</option>
            {allGenres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-yellow-500 cursor-pointer"
            aria-label="Filter by Role"
          >
            <option value="all">All Roles</option>
            {allRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Sort & Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-yellow-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-yellow-500 cursor-pointer"
              aria-label="Sort Filmography"
            >
              <option value="year-desc">Latest Release</option>
              <option value="year-asc">Oldest First</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
          <span className="text-xs bg-zinc-800 text-yellow-500 font-semibold px-2.5 py-1 rounded-full border border-zinc-700">
            {filteredItems.length} titles
          </span>
        </div>
      </div>

      {/* Virtualized Container */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-zinc-900/40 rounded-2xl border border-zinc-800">
          <p className="text-zinc-400 text-sm">No filmography entries match the selected filters.</p>
          <button
            onClick={() => {
              setSelectedYear("all");
              setSelectedGenre("all");
              setSelectedRole("all");
            }}
            className="mt-3 text-xs text-yellow-500 hover:underline"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="relative h-[550px] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950/40 p-2 scrollbar-thin scrollbar-thumb-zinc-700"
        >
          {/* Virtual scroll spacer */}
          <div style={{ height: `${totalHeight}px`, position: "relative", width: "100%" }}>
            {visibleItems.map((movie, index) => {
              const absoluteIndex = startIndex + index;
              const topPosition = absoluteIndex * ITEM_HEIGHT;

              return (
                <div
                  key={movie.id}
                  style={{
                    position: "absolute",
                    top: `${topPosition}px`,
                    left: 0,
                    right: 0,
                    height: `${ITEM_HEIGHT - 8}px`,
                  }}
                  className="px-1"
                >
                  <Link
                    href={`/movie/${movie.id}`}
                    className="flex items-center justify-between h-full bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/80 rounded-xl px-4 py-2.5 transition-all group hover:border-yellow-500/40"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-14 h-18 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0 relative">
                        {movie.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={movie.image}
                            alt={movie.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600">
                            <Award className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white text-base truncate group-hover:text-yellow-400 transition-colors">
                            {movie.title}
                          </h4>
                          <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md border border-zinc-700/50">
                            {movie.year}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs truncate">
                          as <span className="text-zinc-200">{movie.character || movie.role}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                              movie.roleCategory === "Lead"
                                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                                : "bg-zinc-800 text-zinc-400 border-zinc-700/50"
                            }`}
                          >
                            {movie.roleCategory}
                          </span>
                          {movie.genre.slice(0, 2).map((g) => (
                            <span key={g} className="text-[10px] text-zinc-500">
                              • {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-full border border-zinc-700/50">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                        <span className="text-xs font-bold text-yellow-500">{movie.rating}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
