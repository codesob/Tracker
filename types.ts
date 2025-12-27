
export enum TaskStatus {
  PENDING = 'PENDING',
  DONE = 'DONE'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum SortBy {
  DATE = 'DATE',
  TITLE = 'TITLE',
  PRIORITY = 'PRIORITY'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
}

export type FilterType = 'ALL' | TaskStatus;

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
}
