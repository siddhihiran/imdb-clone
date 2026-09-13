"use client";

import { idb } from "../storage/indexedDb";
import { MovieItem } from "../data/mockData";

export interface WatchlistMessage {
  type: "WATCHLIST_ADD" | "WATCHLIST_REMOVE" | "WATCHLIST_SYNC";
  movieId: number | string;
  movie?: MovieItem;
  timestamp: number;
}

const LOCAL_STORAGE_KEY = "imdb_clone_watchlist";
const BROADCAST_CHANNEL_NAME = "imdb_watchlist_sync";

class WatchlistManager {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(items: MovieItem[]) => void> = new Set();
  private cachedItems: MovieItem[] = [];
  private initialized = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.initChannel();
      this.loadFromStorage();
    }
  }

  private initChannel() {
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        this.channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        this.channel.onmessage = (event: MessageEvent<WatchlistMessage>) => {
          const { type, movie, movieId } = event.data;

          if (type === "WATCHLIST_ADD" && movie) {
            if (!this.cachedItems.some((m) => m.id.toString() === movie.id.toString())) {
              this.cachedItems = [movie, ...this.cachedItems];
              this.saveToStorage(this.cachedItems, false);
              this.notify();
            }
          } else if (type === "WATCHLIST_REMOVE") {
            this.cachedItems = this.cachedItems.filter((m) => m.id.toString() !== movieId.toString());
            this.saveToStorage(this.cachedItems, false);
            this.notify();
          } else if (type === "WATCHLIST_SYNC") {
            this.syncFromBackend();
          }
        };
      }
    } catch (e) {
      console.warn("BroadcastChannel not supported:", e);
    }
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return;

    // 1. First hydrate from LocalStorage (synchronous)
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        this.cachedItems = JSON.parse(stored);
        this.notify();
      }
    } catch {
      // ignore
    }

    // 2. Hydrate & reconcile with IndexedDB offline store
    idb.getWatchlist().then((items) => {
      if (items && items.length > 0) {
        // Merge without duplicates
        const map = new Map<string, MovieItem>();
        this.cachedItems.forEach((m) => map.set(m.id.toString(), m));
        items.forEach((m) => map.set(m.id.toString(), m));
        this.cachedItems = Array.from(map.values());
        this.saveToStorage(this.cachedItems, false);
        this.notify();
      }
      this.initialized = true;
    });
  }

  private saveToStorage(items: MovieItem[], broadcast = true) {
    if (typeof window === "undefined") return;

    // Save to LocalStorage
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("LocalStorage save error:", e);
    }
  }

  subscribe(callback: (items: MovieItem[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.cachedItems);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.cachedItems));
  }

  getItems(): MovieItem[] {
    return this.cachedItems;
  }

  isInWatchlist(movieId: string | number): boolean {
    return this.cachedItems.some((m) => m.id.toString() === movieId.toString());
  }

  /**
   * Optimistically add with mock backend sync and rollback support
   */
  async add(movie: MovieItem, simulateFailure = false): Promise<boolean> {
    if (this.isInWatchlist(movie.id)) return true;

    const previousItems = [...this.cachedItems];
    const newItems = [movie, ...this.cachedItems];
    this.cachedItems = newItems;
    this.saveToStorage(newItems);
    this.notify();

    // Persist to IndexedDB offline cache
    await idb.saveWatchlistItem(movie);

    // Cross-tab broadcast
    this.channel?.postMessage({
      type: "WATCHLIST_ADD",
      movieId: movie.id,
      movie,
      timestamp: Date.now(),
    });

    // Mock Backend Sync with Optimistic Rollback
    try {
      const res = await fetch(`/api/watchlist${simulateFailure ? "?fail=true" : ""}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie }),
      });

      if (!res.ok) {
        throw new Error("Backend sync failed");
      }
      return true;
    } catch (error) {
      console.warn("[Watchlist] Sync failed, rolling back optimistic update:", error);
      // Rollback
      this.cachedItems = previousItems;
      this.saveToStorage(previousItems);
      await idb.removeWatchlistItem(movie.id);
      this.notify();

      // Broadcast rollback
      this.channel?.postMessage({
        type: "WATCHLIST_REMOVE",
        movieId: movie.id,
        timestamp: Date.now(),
      });
      return false;
    }
  }

  /**
   * Optimistically remove with mock backend sync and rollback support
   */
  async remove(movieId: string | number, simulateFailure = false): Promise<boolean> {
    const movie = this.cachedItems.find((m) => m.id.toString() === movieId.toString());
    if (!movie) return true;

    const previousItems = [...this.cachedItems];
    const newItems = this.cachedItems.filter((m) => m.id.toString() !== movieId.toString());
    this.cachedItems = newItems;
    this.saveToStorage(newItems);
    this.notify();

    // Remove from IndexedDB offline cache
    await idb.removeWatchlistItem(movieId);

    // Cross-tab broadcast
    this.channel?.postMessage({
      type: "WATCHLIST_REMOVE",
      movieId,
      timestamp: Date.now(),
    });

    // Mock Backend Sync
    try {
      const res = await fetch(`/api/watchlist?id=${movieId}${simulateFailure ? "&fail=true" : ""}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Backend remove failed");
      }
      return true;
    } catch (error) {
      console.warn("[Watchlist] Sync failed, rolling back removal:", error);
      this.cachedItems = previousItems;
      this.saveToStorage(previousItems);
      await idb.saveWatchlistItem(movie);
      this.notify();

      this.channel?.postMessage({
        type: "WATCHLIST_ADD",
        movieId: movie.id,
        movie,
        timestamp: Date.now(),
      });
      return false;
    }
  }

  async syncFromBackend() {
    try {
      const res = await fetch("/api/watchlist");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) {
          this.cachedItems = data.items;
          this.saveToStorage(this.cachedItems, false);
          this.notify();
        }
      }
    } catch {
      // offline fallback
    }
  }
}

export const watchlistStore = new WatchlistManager();
