import Link from 'next/link';
import { getDashboardTasks } from '@/lib/dashboard-tasks';
import { getProject } from '@/lib/queries';
import { formatDueDate } from '@/lib/due-date';

export default function DashboardPage() {
  const tasks = getDashboardTasks();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm text-gray-500">All open and completed tasks, sorted by due date.</p>
      <ul className="flex flex-col gap-2">
        {tasks.map((task) => {
          const project = getProject(task.project_id);
          return (
            <li
              key={task.id}
              className="flex items-center justify-between rounded border bg-white p-3"
            >
              <div>
                <Link href={`/tasks/${task.id}`} className="font-medium text-blue-700">
                  {task.title}
                </Link>
                <p className="text-xs text-gray-500">{project?.name}</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                {task.due_date ? formatDueDate(task.due_date) : 'No due date'}
                {task.completed === 1 && <p className="text-xs text-green-600">Completed</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
