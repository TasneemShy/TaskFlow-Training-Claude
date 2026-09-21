import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { resetDbForTests } from '@/lib/db';
import { resetSummaryCacheForTests } from '@/lib/summary-cache';
import { POST as createTask } from '@/app/api/tasks/route';
import { GET as getSummary } from './route';

vi.mock('next/headers', () => ({
  cookies: () => ({ get: () => undefined }),
}));

const context = { params: { id: '1' } };

describe('GET /api/projects/[id]/summary', () => {
  beforeEach(() => {
    resetDbForTests();
    resetSummaryCacheForTests();
  });

  it('returns the task count for a project', async () => {
    const res = await getSummary(
      new NextRequest('http://localhost/api/projects/1/summary'),
      context,
    );
    const data = await res.json();
    expect(data.taskCount).toBe(3);
  });

  it('reflects the count after adding a task', async () => {
    // Warm the cache with the pre-creation count.
    await getSummary(new NextRequest('http://localhost/api/projects/1/summary'), context);

    const createReq = new NextRequest('http://localhost/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ project_id: 1, title: 'New task' }),
    });
    await createTask(createReq);

    const res = await getSummary(
      new NextRequest('http://localhost/api/projects/1/summary'),
      context,
    );
    const data = await res.json();
    expect(data.taskCount).toBe(4);
  });
});
