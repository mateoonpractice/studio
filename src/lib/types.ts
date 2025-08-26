export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  projectId: string;
  priority?: 'High' | 'Medium' | 'Low';
  reason?: string;
}

export interface Project {
  id: string;
  name: string;
}
