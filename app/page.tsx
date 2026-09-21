import Link from 'next/link';
import { getProjects } from '@/lib/queries';
import { getProjectStats } from '@/lib/project-stats';

export default function HomePage() {
  const projects = getProjects();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Projects</h1>
      <ul className="flex flex-col gap-3">
        {projects.map((project) => {
          const stats = getProjectStats(project.id);
          return (
            <li key={project.id} className="rounded border border-gray-200 bg-white p-4">
              <Link href={`/projects/${project.id}`} className="text-lg font-medium text-blue-700">
                {project.name}
              </Link>
              <p className="text-sm text-gray-600">{project.description}</p>
              <p className="mt-1 text-xs text-gray-500">
                {stats.completedCount} / {stats.taskCount} tasks complete
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
