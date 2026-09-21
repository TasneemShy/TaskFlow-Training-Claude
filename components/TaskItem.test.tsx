import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TaskItem } from './TaskItem';
import type { Task } from '@/lib/types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

const task: Task = {
  id: 1,
  project_id: 1,
  owner_id: 1,
  title: 'Write homepage copy',
  description: '',
  due_date: null,
  completed: 0,
  feedback: null,
  created_at: '2026-09-15T09:00:00.000Z',
};

describe('TaskItem', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
  });

  it('does not call the server on the initial render', () => {
    render(<TaskItem task={task} />);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('sends the correct state after repeated toggles', async () => {
    render(<TaskItem task={task} />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    const firstCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(JSON.parse(firstCall[1].body)).toEqual({ completed: 1 });

    fireEvent.click(checkbox);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    const secondCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[1];
    expect(JSON.parse(secondCall[1].body)).toEqual({ completed: 0 });
  });
});
