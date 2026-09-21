const cache = new Map<number, number>();

export function getCachedTaskCount(projectId: number, compute: () => number): number {
  if (cache.has(projectId)) {
    return cache.get(projectId)!;
  }
  const count = compute();
  cache.set(projectId, count);
  return count;
}

export function invalidateTaskCount(projectId: number): void {
  cache.delete(projectId);
}

/** Test-only: clears the whole cache. */
export function resetSummaryCacheForTests(): void {
  cache.clear();
}
