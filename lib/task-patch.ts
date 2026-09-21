import type { Task } from './types';

export type TaskPatch = Partial<
  Pick<Task, 'title' | 'description' | 'due_date' | 'completed' | 'feedback'>
>;

export function buildTaskUpdate(existing: Task, patch: TaskPatch): Task {
  return { ...existing, ...patch };
}
