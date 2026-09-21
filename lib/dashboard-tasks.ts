import { getDb } from './db';
import type { Task } from './types';

export function getDashboardTasks(): Task[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT * FROM Task
       ORDER BY CASE WHEN due_date IS NULL THEN 1 ELSE 0 END, due_date ASC`,
    )
    .all() as Task[];
}
