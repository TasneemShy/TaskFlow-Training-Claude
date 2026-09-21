import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject, getTasksForProject } from '@/lib/queries';
import { getProjectStats } from '@/lib/project-stats';
import { sortTasksByCreatedDate } from '@/lib/sort-tasks';
import { formatDueDate } from '@/lib/due-date';
import { AddTaskForm } from '@/components/AddTaskForm';
import { TaskList } from '@/components/TaskList';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = getProject(Number(params.id));
  if (!project) {
    notFound();
  }

  const tasks = sortTasksByCreatedDate(getTasksForProject(project.id));
  const stats = getProjectStats(project.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <p className="text-gray-600">{project.description}</p>
        <p className="mt-1 text-sm text-gray-500">
          {stats.completedCount} / {stats.taskCount} tasks complete
        </p>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Tasks</h2>
        <TaskList tasks={tasks} isLoading={false} />
      </section>

      {tasks.some((task) => task.due_date) && (
        <p className="text-xs text-gray-400">
          Next due: {formatDueDate(tasks.find((task) => task.due_date)!.due_date!)}
        </p>
      )}

      <section className="flex flex-col gap-2 rounded border border-gray-200 bg-white p-4">
        <h2 className="text-lg font-medium">Add Task</h2>
        <AddTaskForm projectId={project.id} />
      </section>

      <div className="flex flex-wrap gap-3 text-sm">
        {tasks.map((task) => (
          <Link key={task.id} href={`/tasks/${task.id}`} className="text-blue-700 underline">
            {task.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
