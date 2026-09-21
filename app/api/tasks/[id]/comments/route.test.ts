import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { resetDbForTests } from '@/lib/db';
import { GET, POST } from './route';

vi.mock('next/headers', () => ({
  cookies: () => ({ get: () => undefined }),
}));

const context = { params: { id: '1' } };

describe('GET /api/tasks/[id]/comments', () => {
  beforeEach(() => {
    resetDbForTests();
  });

  it('lists comments for a task', async () => {
    // Task 1 has 2 seeded comments.
    const res = await GET(new NextRequest('http://localhost/api/tasks/1/comments'), context);
    const data = await res.json();
    expect(data.comments).toHaveLength(2);
  });

  it('respects limit and offset', async () => {
    const url = 'http://localhost/api/tasks/1/comments?limit=1&offset=0';
    const res = await GET(new NextRequest(url), context);
    const data = await res.json();
    expect(data.comments).toHaveLength(1);
  });
});

describe('POST /api/tasks/[id]/comments', () => {
  beforeEach(() => {
    resetDbForTests();
  });

  it('adds a comment to a task', async () => {
    const req = new NextRequest('http://localhost/api/tasks/1/comments', {
      method: 'POST',
      body: JSON.stringify({ body: 'Nice work' }),
    });
    const res = await POST(req, context);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.comment.body).toBe('Nice work');
  });

  it('rejects a blank comment', async () => {
    const req = new NextRequest('http://localhost/api/tasks/1/comments', {
      method: 'POST',
      body: JSON.stringify({ body: '   ' }),
    });
    const res = await POST(req, context);
    expect(res.status).toBe(400);
  });
});
