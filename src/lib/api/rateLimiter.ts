export interface RateLimiterOptions {
  capacity: number;
  refillRate: number; // tokens per second
}

export class TokenBucketRateLimiter {
  private capacity: number;
  private refillRate: number;
  private tokens: number;
  private lastRefillTimestamp: number;
  private queue: Array<() => void> = [];

  constructor(options: RateLimiterOptions = { capacity: 30, refillRate: 10 }) {
    this.capacity = options.capacity;
    this.refillRate = options.refillRate;
    this.tokens = options.capacity;
    this.lastRefillTimestamp = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefillTimestamp) / 1000;
    const tokensToAdd = elapsedSeconds * this.refillRate;
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefillTimestamp = now;
  }

  async acquire(cost = 1): Promise<void> {
    this.refill();

    if (this.tokens >= cost) {
      this.tokens -= cost;
      return Promise.resolve();
    }

    // If bucket doesn't have enough tokens, calculate wait duration or queue
    const needed = cost - this.tokens;
    const waitMs = Math.ceil((needed / this.refillRate) * 1000);

    return new Promise((resolve) => {
      setTimeout(() => {
        this.refill();
        this.tokens = Math.max(0, this.tokens - cost);
        resolve();
      }, waitMs);
    });
  }

  getAvailableTokens(): number {
    this.refill();
    return Math.floor(this.tokens);
  }
}

export const globalRateLimiter = new TokenBucketRateLimiter({
  capacity: 40,
  refillRate: 15,
});
