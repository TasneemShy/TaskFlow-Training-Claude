import { describe, expect, it } from 'vitest';
import { sanitizeFeedback } from './sanitize-feedback';

describe('sanitizeFeedback', () => {
  it('strips a single HTML tag', () => {
    expect(sanitizeFeedback('<b>great job</b>')).toBe('great job');
  });

  it('strips all HTML tags, not just the first', () => {
    const input = '<b>bold</b> and <i>italic</i>';
    expect(sanitizeFeedback(input)).toBe('bold and italic');
  });

  it('trims surrounding whitespace', () => {
    expect(sanitizeFeedback('  nice work  ')).toBe('nice work');
  });
});
