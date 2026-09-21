import { beforeEach, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { resetDbForTests } from '@/lib/db';
import { GET, PATCH, DELETE } from './route';

const context = { params: { id: '1' } };

describe('GET /api/projects/[id]', () => {
  beforeEach(() => {
    resetDbForTests();
  });

  it('returns an existing project', async () => {
    const res = await GET(new NextRequest('http://localhost/api/projects/1'), context);
    const data = await res.json();
    expect(data.project.name).toBe('Website Relaunch');
  });

  it('returns 404 for a missing project', async () => {
    const res = await GET(new NextRequest('http://localhost/api/projects/999'), {
      params: { id: '999' },
    });
    expect(res.status).toBe(404);
  });
});

describe('PATCH /api/projects/[id]', () => {
  beforeEach(() => {
    resetDbForTests();
  });

  it('updates the project name', async () => {
    const req = new NextRequest('http://localhost/api/projects/1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'Renamed' }),
    });
    const res = await PATCH(req, context);
    const data = await res.json();
    expect(data.project.name).toBe('Renamed');
  });
});

describe('DELETE /api/projects/[id]', () => {
  beforeEach(() => {
    resetDbForTests();
  });

  it('deletes the project and its tasks', async () => {
    const res = await DELETE(
      new NextRequest('http://localhost/api/projects/1', { method: 'DELETE' }),
      context,
    );
    expect(res.status).toBe(200);

    const getRes = await GET(new NextRequest('http://localhost/api/projects/1'), context);
    expect(getRes.status).toBe(404);
  });
});
