import { beforeEach, describe, expect, it } from 'vitest';
import { resetDbForTests } from './db';
import { getProjectStats } from './project-stats';

describe('getProjectStats', () => {
  beforeEach(() => {
    resetDbForTests();
  });

  it('counts total and completed tasks for a project', () => {
    // Project 1 ("Website Relaunch") seeds 3 tasks, 1 of them completed.
    const stats = getProjectStats(1);
    expect(stats.taskCount).toBe(3);
    expect(stats.completedCount).toBe(1);
  });

  it('counts tasks once regardless of how many comments they have', () => {
    // One of project 1's seeded tasks already has two comments attached.
    const stats = getProjectStats(1);
    expect(stats.taskCount).toBe(3);
  });

  it('returns zero counts for a project with no tasks', () => {
    const stats = getProjectStats(999);
    expect(stats.taskCount).toBe(0);
    expect(stats.completedCount).toBe(0);
  });
});
