/**
 * Request Coalescing (In-flight request deduplication)
 * Merges concurrent identical async calls into a single in-flight promise.
 */
class RequestCoalescer {
  private inFlightRequests = new Map<string, Promise<any>>();

  async coalesce<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const existing = this.inFlightRequests.get(key);
    if (existing) {
      return existing as Promise<T>;
    }

    const promise = fetcher()
      .finally(() => {
        this.inFlightRequests.delete(key);
      });

    this.inFlightRequests.set(key, promise);
    return promise;
  }

  getInFlightCount(): number {
    return this.inFlightRequests.size;
  }
}

export const requestCoalescer = new RequestCoalescer();
