import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCachedTaskCount } from '@/lib/summary-cache';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const projectId = Number(params.id);
  const db = getDb();

  const taskCount = getCachedTaskCount(projectId, () => {
    const row = db
      .prepare('SELECT COUNT(*) as count FROM Task WHERE project_id = ?')
      .get(projectId) as { count: number };
    return row.count;
  });

  return NextResponse.json({ taskCount });
}
