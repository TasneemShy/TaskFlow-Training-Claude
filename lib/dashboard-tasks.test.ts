import { beforeEach, describe, expect, it } from 'vitest';
import { getDb, resetDbForTests } from './db';
import { getDashboardTasks } from './dashboard-tasks';

describe('getDashboardTasks', () => {
  beforeEach(() => {
    resetDbForTests();
  });

  it('sorts tasks by due date ascending', () => {
    const tasks = getDashboardTasks();
    const dueDates = tasks.filter((task) => task.due_date).map((task) => task.due_date);
    const sorted = [...dueDates].sort();
    expect(dueDates).toEqual(sorted);
  });

  it('places the earliest due date first', () => {
    const tasks = getDashboardTasks();
    expect(tasks[0].due_date).toBe('2026-09-22');
  });

  it('sorts tasks without a due date to the end', () => {
    const db = getDb();
    db.prepare(
      `INSERT INTO Task
         (project_id, owner_id, title, description, due_date, completed, feedback, created_at)
       VALUES (1, 1, 'No due date task', '', NULL, 0, NULL, '2026-09-15T09:00:00.000Z')`,
    ).run();

    const tasks = getDashboardTasks();
    expect(tasks[tasks.length - 1].due_date).toBeNull();
  });
});
