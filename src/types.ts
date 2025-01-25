export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  completed: boolean;
  due_date: string;
  created_at: string;
}

export type TaskFilter = 'all' | 'active' | 'completed';