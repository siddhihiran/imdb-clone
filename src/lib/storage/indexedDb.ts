export interface ReviewDraft {
  movieId: string | number;
  title: string;
  content: string;
  rating: number;
  containsSpoilers: boolean;
  savedAt: number;
}

const DB_NAME = "imdb_clone_db";
const DB_VERSION = 1;

class IndexedDbClient {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDb(): Promise<IDBDatabase> {
    if (typeof window === "undefined") {
      return Promise.reject(new Error("IndexedDB is only available in browser environments"));
    }

    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains("review_drafts")) {
          db.createObjectStore("review_drafts", { keyPath: "movieId" });
        }

        if (!db.objectStoreNames.contains("reviews")) {
          db.createObjectStore("reviews", { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains("watchlist")) {
          db.createObjectStore("watchlist", { keyPath: "id" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  async saveReviewDraft(draft: ReviewDraft): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("review_drafts", "readwrite");
        const store = tx.objectStore("review_drafts");
        const request = store.put(draft);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.warn("Failed to save draft to IndexedDB:", e);
    }
  }

  async getReviewDraft(movieId: string | number): Promise<ReviewDraft | null> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("review_drafts", "readonly");
        const store = tx.objectStore("review_drafts");
        const request = store.get(movieId.toString());
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } catch {
      return null;
    }
  }

  async deleteReviewDraft(movieId: string | number): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("review_drafts", "readwrite");
        const store = tx.objectStore("review_drafts");
        const request = store.delete(movieId.toString());
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.warn("Failed to delete draft from IndexedDB:", e);
    }
  }

  // Watchlist methods for Feature 6
  async saveWatchlistItem(item: any): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("watchlist", "readwrite");
        const store = tx.objectStore("watchlist");
        const request = store.put(item);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.warn("Failed to save to IndexedDB watchlist:", e);
    }
  }

  async getWatchlist(): Promise<any[]> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("watchlist", "readonly");
        const store = tx.objectStore("watchlist");
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch {
      return [];
    }
  }

  async removeWatchlistItem(id: string | number): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("watchlist", "readwrite");
        const store = tx.objectStore("watchlist");
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.warn("Failed to remove from IndexedDB watchlist:", e);
    }
  }
}

export const idb = new IndexedDbClient();
