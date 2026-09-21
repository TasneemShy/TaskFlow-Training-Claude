import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AddTaskForm } from './AddTaskForm';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

describe('AddTaskForm', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
  });

  it('submits a new task with a non-empty title', async () => {
    render(<AddTaskForm projectId={1} />);

    fireEvent.change(screen.getByLabelText('Task title'), {
      target: { value: 'Write docs' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add Task' }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.title).toBe('Write docs');
  });

  it('rejects an empty or whitespace-only title', () => {
    render(<AddTaskForm projectId={1} />);

    fireEvent.change(screen.getByLabelText('Task title'), {
      target: { value: '   ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add Task' }));

    expect(global.fetch).not.toHaveBeenCalled();
    expect(screen.getByText('Title is required.')).toBeInTheDocument();
  });
});
