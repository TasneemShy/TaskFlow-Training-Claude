import { describe, expect, it } from 'vitest';
import { formatRelativeTime } from './relative-time';

describe('formatRelativeTime', () => {
  const now = new Date('2026-09-15T12:00:00.000Z');

  it('labels a timestamp from 30 seconds ago as just now', () => {
    const created = new Date(now.getTime() - 30_000);
    expect(formatRelativeTime(created, now)).toBe('just now');
  });

  it('labels a timestamp from 5 minutes ago in minutes', () => {
    const created = new Date(now.getTime() - 5 * 60_000);
    expect(formatRelativeTime(created, now)).toBe('5 minutes ago');
  });

  it('labels a timestamp from 3 hours ago in hours', () => {
    const created = new Date(now.getTime() - 3 * 60 * 60_000);
    expect(formatRelativeTime(created, now)).toBe('3 hours ago');
  });

  it('labels a timestamp from 2 days ago in days', () => {
    const created = new Date(now.getTime() - 2 * 24 * 60 * 60_000);
    expect(formatRelativeTime(created, now)).toBe('2 days ago');
  });
});

describe('a freshly posted comment', () => {
  it('shows just now for a timestamp created 59.5 seconds ago', () => {
    const created = new Date(Date.now() - 59_500);
    expect(formatRelativeTime(created)).toBe('just now');
  });
});
