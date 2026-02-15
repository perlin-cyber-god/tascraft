export enum TaskCategory {
  HOMEWORK = 'Homework',
  EXAM = 'Exam',
  PROJECT = 'Project',
  PERSONAL = 'Personal'
}

export interface Task {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  due_date: string; // ISO date string
  category: TaskCategory;
  is_complete: boolean;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
}

export interface DashboardStats {
  total: number;
  completed: number;
  dueToday: number;
  pending: number;
}
