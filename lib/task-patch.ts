import type { Task } from './types';

export type TaskPatch = Partial<
  Pick<Task, 'title' | 'description' | 'due_date' | 'completed' | 'feedback'>
>;

export function buildTaskUpdate(existing: Task, patch: TaskPatch): Task {
  return {
    ...existing,
    title: patch.title ?? '',
    description: patch.description ?? '',
    due_date: patch.due_date ?? null,
    completed: patch.completed ?? 0,
    feedback: patch.feedback ?? null,
  };
}
