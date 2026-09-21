import { getDb } from './db';
import type { Project, Task, Comment, User } from './types';

export function getProjects(): Project[] {
  const db = getDb();
  return db.prepare('SELECT * FROM Project ORDER BY created_at ASC').all() as Project[];
}

export function getProject(id: number): Project | null {
  const db = getDb();
  return (db.prepare('SELECT * FROM Project WHERE id = ?').get(id) as Project | undefined) ?? null;
}

export function getTasksForProject(projectId: number): Task[] {
  const db = getDb();
  return db
    .prepare('SELECT * FROM Task WHERE project_id = ? ORDER BY created_at DESC')
    .all(projectId) as Task[];
}

export function getTask(id: number): Task | null {
  const db = getDb();
  return (db.prepare('SELECT * FROM Task WHERE id = ?').get(id) as Task | undefined) ?? null;
}

export function getCommentsForTask(taskId: number): Comment[] {
  const db = getDb();
  return db
    .prepare('SELECT * FROM Comment WHERE task_id = ? ORDER BY created_at ASC')
    .all(taskId) as Comment[];
}

export function getUserById(id: number): User | null {
  const db = getDb();
  return (db.prepare('SELECT * FROM User WHERE id = ?').get(id) as User | undefined) ?? null;
}
