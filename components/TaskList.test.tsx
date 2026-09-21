import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaskList } from './TaskList';
import type { Task } from '@/lib/types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: 1,
    project_id: 1,
    owner_id: 1,
    title: 'Task',
    description: '',
    due_date: null,
    completed: 0,
    feedback: null,
    created_at: '2026-09-15T09:00:00.000Z',
    ...overrides,
  };
}

describe('TaskList', () => {
  it('shows a loading state while loading', () => {
    render(<TaskList tasks={[]} isLoading={true} />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('shows an empty state, not a spinner, for zero tasks', () => {
    render(<TaskList tasks={[]} isLoading={false} />);
    expect(screen.getByText('No tasks yet.')).toBeInTheDocument();
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
  });

  it('renders each task', () => {
    const tasks = [makeTask({ id: 1, title: 'Task A' }), makeTask({ id: 2, title: 'Task B' })];
    render(<TaskList tasks={tasks} isLoading={false} />);
    expect(screen.getByText('Task A')).toBeInTheDocument();
    expect(screen.getByText('Task B')).toBeInTheDocument();
  });
});
