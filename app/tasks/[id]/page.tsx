import { notFound } from 'next/navigation';
import { getTask, getCommentsForTask, getUserById, getProject } from '@/lib/queries';
import { formatDueDate } from '@/lib/due-date';
import { formatRelativeTime } from '@/lib/relative-time';
import { sanitizeFeedback } from '@/lib/sanitize-feedback';
import { AddCommentForm } from '@/components/AddCommentForm';

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const task = getTask(Number(params.id));
  if (!task) {
    notFound();
  }

  const project = getProject(task.project_id);
  const owner = getUserById(task.owner_id);
  const comments = getCommentsForTask(task.id);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-gray-500">{project?.name}</p>
        <h1 className="text-2xl font-semibold">{task.title}</h1>
        <p className="text-gray-600">{task.description}</p>
        <p className="mt-1 text-sm text-gray-500">
          Owner: {owner?.name} · {task.completed ? 'Completed' : 'Open'}
        </p>
        {task.due_date && (
          <p className="text-sm text-gray-500">Due {formatDueDate(task.due_date)}</p>
        )}
        {task.feedback && (
          <p className="mt-2 rounded bg-yellow-50 p-2 text-sm text-yellow-900">
            Feedback: {sanitizeFeedback(task.feedback)}
          </p>
        )}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Comments</h2>
        <ul className="flex flex-col gap-2">
          {comments.map((comment) => {
            const author = getUserById(comment.author_id);
            return (
              <li key={comment.id} className="rounded border border-gray-200 bg-white p-3">
                <p className="text-sm">{comment.body}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {author?.name} · {formatRelativeTime(new Date(comment.created_at))}
                </p>
              </li>
            );
          })}
        </ul>
        <AddCommentForm taskId={task.id} />
      </section>
    </div>
  );
}
