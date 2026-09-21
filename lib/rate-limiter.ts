interface Bucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const LIMIT = 5;

async function recordUsage(key: string, count: number): Promise<void> {
  // Simulates an async side effect, e.g. shipping a metrics/log event.
  await Promise.resolve();
  void key;
  void count;
}

export async function checkRateLimit(
  key: string,
  limit = LIMIT,
  windowMs = WINDOW_MS,
): Promise<boolean> {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { count: 0, windowStart: now };

  if (now - bucket.windowStart > windowMs) {
    bucket.count = 0;
    bucket.windowStart = now;
  }

  if (bucket.count >= limit) {
    return false;
  }

  await recordUsage(key, bucket.count);

  bucket.count += 1;
  buckets.set(key, bucket);
  return true;
}

export function resetRateLimiter(): void {
  buckets.clear();
}
