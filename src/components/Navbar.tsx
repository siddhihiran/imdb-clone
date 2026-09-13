"use client";

import React, { useState, useEffect } from 'react';
import { Film, Search, Menu, X, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggle from './theme/ThemeToggle';
import { watchlistStore } from '@/lib/watchlist/watchlistStore';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlistCount, setWatchlistCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const updateCount = () => {
      setWatchlistCount(watchlistStore.getItems().length);
    };
    updateCount();

    const unsubscribe = watchlistStore.subscribe((items) => {
      setWatchlistCount(items.length);
    });

    return unsubscribe;
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'Movies', path: '/movies' },
    { label: 'Top Rated', path: '/top-rated' },
    { label: 'Coming Soon', path: '/coming-soon' },
  ];

  return (
    <nav className="bg-black/70 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 hover-glow">
            <Film className="w-8 h-8 text-yellow-500" />
            <span className="text-xl font-bold text-glow">MovieDB</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="bg-zinc-900/80 backdrop-blur-md text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 w-52 transition-all border border-zinc-800 text-sm"
              />
            </form>
            <div className="flex items-center gap-5">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.path}
                  className="text-zinc-300 hover:text-white transition-colors hover-glow text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/watchlist"
                className="flex items-center gap-1.5 text-zinc-300 hover:text-yellow-400 transition-colors text-sm font-medium hover-glow"
              >
                <Bookmark className="w-4 h-4 text-yellow-500" />
                <span>Watchlist</span>
                {watchlistCount > 0 && (
                  <span className="bg-yellow-500 text-black font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                    {watchlistCount}
                  </span>
                )}
              </Link>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <Link
              href="/watchlist"
              className="relative text-zinc-300 hover:text-yellow-400 p-1"
              aria-label="View Watchlist"
            >
              <Bookmark className="w-5 h-5 text-yellow-500" />
              {watchlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {watchlistCount}
                </span>
              )}
            </Link>
            <ThemeToggle />
            <button
              aria-label="Toggle mobile navigation menu"
              className="text-zinc-300 hover:text-white p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-800/80">
            <div className="flex flex-col gap-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="bg-white absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-600 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="bg-zinc-900/80 backdrop-blur-md text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 w-full text-sm"
                />
              </form>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.path}
                  className="text-zinc-300 hover:text-white transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/watchlist"
                className="flex items-center gap-2 text-zinc-300 hover:text-yellow-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Bookmark className="w-4 h-4 text-yellow-500" />
                <span>Watchlist ({watchlistCount})</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;