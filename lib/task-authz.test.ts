import { describe, expect, it } from 'vitest';
import { canDeleteTask } from './task-authz';
import type { Task } from './types';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1,
    project_id: 1,
    owner_id: 1,
    title: 'Test task',
    description: '',
    due_date: null,
    completed: 0,
    feedback: null,
    created_at: '2026-09-15T09:00:00.000Z',
    ...overrides,
  };
}

describe('canDeleteTask', () => {
  it('allows the owner to delete their own task', () => {
    const task = makeTask({ owner_id: 1 });
    expect(canDeleteTask(1, task)).toBe(true);
  });

  it('blocks deleting a task owned by another user', () => {
    const task = makeTask({ owner_id: 1 });
    expect(canDeleteTask(2, task)).toBe(false);
  });
});
