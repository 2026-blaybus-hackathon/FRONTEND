export interface TaskData {
  title: string;
  subject: string;
  date: string;
}

export interface Task extends TaskData {
  id: number;
  status?: 'pending' | 'completed';
  dueTime?: string;
  studyHours?: number;
  studyMinutes?: number;
  description?: string;
  imageUrl?: string;
}

export interface TaskDetail {
  id: number;
  studyHours: number;
  studyMinutes: number;
  description: string;
  imageUrl?: string;
}
