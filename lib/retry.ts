function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface RetryOptions {
  retries: number;
  baseDelayMs: number;
  shouldRetry?: (error: unknown) => boolean;
}

export async function withRetry<T>(operation: (attempt: number) => Promise<T>, options: RetryOptions): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= options.retries; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      const canRetry = attempt < options.retries && (options.shouldRetry ? options.shouldRetry(error) : true);
      if (!canRetry) {
        break;
      }

      const delay = options.baseDelayMs * 2 ** (attempt - 1);
      await sleep(delay);
    }
  }

  throw lastError;
}
