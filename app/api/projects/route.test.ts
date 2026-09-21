import { beforeEach, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { resetDbForTests } from '@/lib/db';
import { GET, POST } from './route';

describe('GET /api/projects', () => {
  beforeEach(() => {
    resetDbForTests();
  });

  it('lists seeded projects', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.projects).toHaveLength(3);
    expect(data.projects[0].name).toBe('Website Relaunch');
  });
});

describe('POST /api/projects', () => {
  beforeEach(() => {
    resetDbForTests();
  });

  it('creates a project with a valid name', async () => {
    const req = new NextRequest('http://localhost/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name: 'New Project', description: 'desc' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.project.name).toBe('New Project');
  });

  it('rejects a blank project name', async () => {
    const req = new NextRequest('http://localhost/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name: '   ' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
