import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { invalidateTaskCount } from '@/lib/summary-cache';
import type { Project } from '@/lib/types';

function getProjectOr404(id: number): Project | null {
  const db = getDb();
  return (db.prepare('SELECT * FROM Project WHERE id = ?').get(id) as Project | undefined) ?? null;
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const project = getProjectOr404(Number(params.id));
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  return NextResponse.json({ project });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const project = getProjectOr404(Number(params.id));
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const body = await request.json();
  const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : project.name;
  const description = typeof body.description === 'string' ? body.description : project.description;

  const db = getDb();
  db.prepare('UPDATE Project SET name = ?, description = ? WHERE id = ?').run(
    name,
    description,
    project.id,
  );

  const fresh = getProjectOr404(project.id);
  return NextResponse.json({ project: fresh });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const project = getProjectOr404(Number(params.id));
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const db = getDb();
  const taskIds = (
    db.prepare('SELECT id FROM Task WHERE project_id = ?').all(project.id) as { id: number }[]
  ).map((row) => row.id);

  const deleteComments = db.prepare('DELETE FROM Comment WHERE task_id = ?');
  for (const taskId of taskIds) {
    deleteComments.run(taskId);
  }
  db.prepare('DELETE FROM Task WHERE project_id = ?').run(project.id);
  db.prepare('DELETE FROM Project WHERE id = ?').run(project.id);

  invalidateTaskCount(project.id);

  return NextResponse.json({ ok: true });
}
