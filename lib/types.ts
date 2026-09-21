export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface Task {
  id: number;
  project_id: number;
  owner_id: number;
  title: string;
  description: string;
  due_date: string | null;
  completed: number;
  feedback: string | null;
  created_at: string;
}

export interface Comment {
  id: number;
  task_id: number;
  author_id: number;
  body: string;
  created_at: string;
}
