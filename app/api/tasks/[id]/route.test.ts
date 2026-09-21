import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { resetDbForTests } from '@/lib/db';
import { GET, PATCH, DELETE } from './route';

// No cookie set -> getCurrentUser() falls back to the default seeded user
// (id 1, Ada Lovelace), who owns task 1.
vi.mock('next/headers', () => ({
  cookies: () => ({ get: () => undefined }),
}));

const context = { params: { id: '1' } };

describe('task detail route', () => {
  beforeEach(() => {
    resetDbForTests();
  });

  it('returns an existing task', async () => {
    const res = await GET(new NextRequest('http://localhost/api/tasks/1'), context);
    const data = await res.json();
    expect(data.task.id).toBe(1);
  });

  it('returns 404 for a missing task', async () => {
    const res = await GET(new NextRequest('http://localhost/api/tasks/999'), {
      params: { id: '999' },
    });
    expect(res.status).toBe(404);
  });

  it('updates a task via PATCH', async () => {
    const req = new NextRequest('http://localhost/api/tasks/1', {
      method: 'PATCH',
      body: JSON.stringify({ completed: 1 }),
    });
    const res = await PATCH(req, context);
    const data = await res.json();
    expect(data.task.completed).toBe(1);
  });

  it('deletes a task owned by the current user', async () => {
    const req = new NextRequest('http://localhost/api/tasks/1', { method: 'DELETE' });
    const res = await DELETE(req, context);
    expect(res.status).toBe(200);
  });
});
