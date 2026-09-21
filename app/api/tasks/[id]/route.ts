import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { canDeleteTask } from '@/lib/task-authz';
import { buildTaskUpdate } from '@/lib/task-patch';
import { invalidateTaskCount } from '@/lib/summary-cache';
import type { Task } from '@/lib/types';

function getTaskOr404(id: number): Task | null {
  const db = getDb();
  return (db.prepare('SELECT * FROM Task WHERE id = ?').get(id) as Task | undefined) ?? null;
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const task = getTaskOr404(Number(params.id));
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  return NextResponse.json({ task });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const task = getTaskOr404(Number(params.id));
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const patch = await request.json();
  const updated = buildTaskUpdate(task, patch);

  const db = getDb();
  db.prepare(
    `UPDATE Task
     SET title = ?, description = ?, due_date = ?, completed = ?, feedback = ?
     WHERE id = ?`,
  ).run(
    updated.title,
    updated.description,
    updated.due_date,
    updated.completed,
    updated.feedback,
    task.id,
  );

  const fresh = getTaskOr404(task.id);
  return NextResponse.json({ task: fresh });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const task = getTaskOr404(Number(params.id));
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const user = getCurrentUser();
  if (!canDeleteTask(user.id, task)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const db = getDb();
  db.prepare('DELETE FROM Comment WHERE task_id = ?').run(task.id);
  db.prepare('DELETE FROM Task WHERE id = ?').run(task.id);

  invalidateTaskCount(task.project_id);

  return NextResponse.json({ ok: true });
}
