import { describe, expect, it } from 'vitest';
import { formatDueDate } from './due-date';

// Pinned so this suite behaves the same on every machine/CI runner regardless
// of local timezone.
process.env.TZ = 'America/Los_Angeles';

describe('formatDueDate', () => {
  it('formats a date-only string as month, day, year', () => {
    expect(formatDueDate('2026-09-25')).toBe('Sep 25, 2026');
  });

  it('formats a due date on the first of the month without shifting a day', () => {
    expect(formatDueDate('2026-01-01')).toBe('Jan 1, 2026');
  });

  it('formats a due date on the last day of the year without shifting a day', () => {
    expect(formatDueDate('2026-12-31')).toBe('Dec 31, 2026');
  });
});
