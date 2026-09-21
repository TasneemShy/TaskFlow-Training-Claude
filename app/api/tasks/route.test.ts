import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { resetDbForTests } from '@/lib/db';
import { resetRateLimiter } from '@/lib/rate-limiter';
import { GET, POST } from './route';

vi.mock('next/headers', () => ({
  cookies: () => ({ get: () => undefined }),
}));

describe('GET /api/tasks', () => {
  beforeEach(() => {
    resetDbForTests();
  });

  it('returns tasks up to the default limit', async () => {
    const res = await GET(new NextRequest('http://localhost/api/tasks'));
    const data = await res.json();
    expect(data.tasks.length).toBeGreaterThan(0);
  });

  it('respects limit and offset', async () => {
    const res = await GET(new NextRequest('http://localhost/api/tasks?limit=3&offset=0'));
    const data = await res.json();
    expect(data.tasks).toHaveLength(3);
  });

  it('returns the next page when offset advances', async () => {
    const firstPage = await GET(new NextRequest('http://localhost/api/tasks?limit=3&offset=0'));
    const firstData = await firstPage.json();
    const secondPage = await GET(new NextRequest('http://localhost/api/tasks?limit=3&offset=3'));
    const secondData = await secondPage.json();

    const firstIds = firstData.tasks.map((task: { id: number }) => task.id);
    const secondIds = secondData.tasks.map((task: { id: number }) => task.id);
    expect(firstIds).not.toEqual(secondIds);
  });

  it('filters by project_id', async () => {
    const url = 'http://localhost/api/tasks?project_id=1&limit=20&offset=0';
    const res = await GET(new NextRequest(url));
    const data = await res.json();
    expect(data.tasks).toHaveLength(3);
    expect(data.tasks.every((task: { project_id: number }) => task.project_id === 1)).toBe(true);
  });
});

describe('POST /api/tasks', () => {
  beforeEach(() => {
    resetDbForTests();
    resetRateLimiter();
  });

  it('creates a task with a title', async () => {
    const req = new NextRequest('http://localhost/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ project_id: 1, title: 'New Task' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.task.title).toBe('New Task');
  });

  it('rejects a blank title', async () => {
    const req = new NextRequest('http://localhost/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ project_id: 1, title: '   ' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
