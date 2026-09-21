import { describe, expect, it } from 'vitest';
import { sortTasksByCreatedDate } from './sort-tasks';

describe('sortTasksByCreatedDate', () => {
  it('orders tasks newest first', () => {
    const tasks = [
      { id: 1, created_at: '2026-09-15T09:00:00.000Z' },
      { id: 2, created_at: '2026-09-17T09:00:00.000Z' },
      { id: 3, created_at: '2026-09-16T09:00:00.000Z' },
    ];

    const sorted = sortTasksByCreatedDate(tasks);

    expect(sorted.map((task) => task.id)).toEqual([2, 3, 1]);
  });

  it('does not mutate the original array', () => {
    const tasks = [
      { id: 1, created_at: '2026-09-15T09:00:00.000Z' },
      { id: 2, created_at: '2026-09-16T09:00:00.000Z' },
    ];

    sortTasksByCreatedDate(tasks);

    expect(tasks.map((task) => task.id)).toEqual([1, 2]);
  });
});
