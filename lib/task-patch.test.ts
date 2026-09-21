import { describe, expect, it } from 'vitest';
import { buildTaskUpdate } from './task-patch';
import type { Task } from './types';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1,
    project_id: 1,
    owner_id: 1,
    title: 'Original title',
    description: 'Original description',
    due_date: '2026-09-25',
    completed: 0,
    feedback: null,
    created_at: '2026-09-15T09:00:00.000Z',
    ...overrides,
  };
}

describe('buildTaskUpdate', () => {
  it('applies a partial patch', () => {
    const existing = makeTask();
    const updated = buildTaskUpdate(existing, { completed: 1 });

    expect(updated.completed).toBe(1);
  });

  it('merges a partial update without dropping other fields', () => {
    const existing = makeTask();
    const updated = buildTaskUpdate(existing, { completed: 1 });

    expect(updated.title).toBe('Original title');
    expect(updated.description).toBe('Original description');
    expect(updated.due_date).toBe('2026-09-25');
  });
});
