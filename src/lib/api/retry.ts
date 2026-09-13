export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
  jitter?: boolean;
  shouldRetry?: (error: any) => boolean;
}

const defaultShouldRetry = (error: any): boolean => {
  if (!error) return false;
  // Network failures or timeout
  if (error.name === "AbortError" || error.code === "ECONNRESET" || error.message?.includes("fetch failed")) {
    return true;
  }
  // HTTP status checks
  const status = error.status || error.response?.status;
  if (status) {
    // 429 Too Many Requests, or 500, 502, 503, 504
    return status === 429 || (status >= 500 && status <= 504);
  }
  return true;
};

export async function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  options: RetryOptions = {}
): Promise<{ result: T; retries: number }> {
  const {
    maxRetries = 3,
    initialDelayMs = 300,
    maxDelayMs = 3000,
    backoffFactor = 2,
    jitter = true,
    shouldRetry = defaultShouldRetry,
  } = options;

  let attempt = 0;

  while (true) {
    try {
      const result = await fn(attempt);
      return { result, retries: attempt };
    } catch (error) {
      if (attempt >= maxRetries || !shouldRetry(error)) {
        throw error;
      }

      attempt++;

      // Exponential backoff
      let delay = initialDelayMs * Math.pow(backoffFactor, attempt - 1);
      if (jitter) {
        // Full jitter: random between 0 and calculated delay
        delay = Math.random() * delay;
      }
      delay = Math.min(delay, maxDelayMs);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export const executeWithRetry = withRetry;

