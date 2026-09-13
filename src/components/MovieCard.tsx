import React from "react";
import { Star } from "lucide-react";

export interface MovieCardProps {
  id?: number | string;
  title: string;
  rating: number | string;
  image: string;
  year?: number | string;
  genre?: string[];
}

const MovieCard: React.FC<MovieCardProps> = ({ title, rating, image, year, genre }) => {
  return (
    <div className="bg-zinc-900/50 rounded-xl overflow-hidden movie-card-hover backdrop-blur-sm group h-full flex flex-col">
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover-glow transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <button className="w-full bg-yellow-500 text-black py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors shadow-lg">
            View Details
          </button>
        </div>
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-yellow-500 font-medium">{rating}</span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2 gap-2">
            <h3 className="font-semibold text-lg truncate text-glow flex-1">{title}</h3>
            {year && <span className="text-zinc-400 text-sm whitespace-nowrap">{year}</span>}
          </div>
          {genre && genre.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genre.slice(0, 2).map((g) => (
                <span key={g} className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-300">
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
