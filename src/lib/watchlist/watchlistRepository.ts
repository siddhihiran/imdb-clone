import { z } from "zod";
import { MovieItem } from "../data/mockData";
import { idb } from "../storage/indexedDb";

/**
 * Zod validation schema for watchlist item
 */
export const watchlistItemSchema = z.object({
  id: z.union([z.number(), z.string()]),
  title: z.string().min(1, "Title required"),
  rating: z.number().optional(),
  year: z.number().optional(),
  image: z.string().optional(),
  duration: z.string().optional(),
  genre: z.array(z.string()).optional(),
  addedAt: z.number().default(() => Date.now()),
  version: z.number().default(1),
  updatedAt: z.number().default(() => Date.now()),
  vectorClock: z.record(z.string(), z.number()).default({}),
});

export type WatchlistRecord = z.infer<typeof watchlistItemSchema>;

/**
 * Typed repository for watchlist management with conflict resolution
 */
export class WatchlistRepository {
  private clientId: string;

  constructor(clientId = "client-main") {
    this.clientId = clientId;
  }

  /**
   * Last-Write-Wins (LWW) Conflict Resolution using timestamp and vector clocks
   */
  resolveConflict(local: WatchlistRecord, remote: WatchlistRecord): WatchlistRecord {
    // 1. If vector clock dominates
    const localClock = (local.vectorClock || {}) as Record<string, number>;
    const remoteClock = (remote.vectorClock || {}) as Record<string, number>;
    const localVersion = localClock[this.clientId] || local.version || 0;
    const remoteVersion = remoteClock["remote"] || remote.version || 0;

    if (remoteVersion > localVersion) {
      return remote;
    }
    if (localVersion > remoteVersion) {
      return local;
    }

    // 2. Fall back to Last-Write-Wins (timestamp)
    return (remote.updatedAt || 0) > (local.updatedAt || 0) ? remote : local;
  }

  /**
   * Validate and format a movie item into a WatchlistRecord
   */
  createRecord(movie: MovieItem): WatchlistRecord {
    return watchlistItemSchema.parse({
      id: movie.id,
      title: movie.title,
      rating: movie.rating,
      year: movie.year,
      image: movie.image,
      duration: movie.duration,
      genre: movie.genre,
      addedAt: Date.now(),
      version: 1,
      updatedAt: Date.now(),
      vectorClock: { [this.clientId]: 1 },
    });
  }

  /**
   * Register background sync with Service Worker if available
   */
  async registerBackgroundSync(): Promise<boolean> {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && "SyncManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        // @ts-expect-error SyncManager is experimental in some browsers
        await registration.sync.register("sync-watchlist");
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

export const watchlistRepo = new WatchlistRepository();
