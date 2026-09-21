import { beforeEach, describe, expect, it } from 'vitest';
import { checkRateLimit, resetRateLimiter } from './rate-limiter';

describe('checkRateLimit', () => {
  beforeEach(() => {
    resetRateLimiter();
  });

  it('allows requests under the limit', async () => {
    expect(await checkRateLimit('user:1', 3, 60_000)).toBe(true);
    expect(await checkRateLimit('user:1', 3, 60_000)).toBe(true);
  });

  it('rejects requests once the limit is reached', async () => {
    await checkRateLimit('user:2', 2, 60_000);
    await checkRateLimit('user:2', 2, 60_000);
    expect(await checkRateLimit('user:2', 2, 60_000)).toBe(false);
  });

  it('tracks separate keys independently', async () => {
    await checkRateLimit('user:3', 1, 60_000);
    expect(await checkRateLimit('user:4', 1, 60_000)).toBe(true);
  });

  it('never admits more than the limit under concurrent calls', async () => {
    const limit = 5;
    const results = await Promise.all(
      Array.from({ length: 20 }, () => checkRateLimit('user:5', limit, 60_000)),
    );

    const admitted = results.filter(Boolean).length;
    expect(admitted).toBe(limit);
  });
});
