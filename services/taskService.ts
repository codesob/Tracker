import { Task, TaskFormData, TaskStatus, TaskPriority } from '../types';

const STORAGE_KEY = 'task_tracker_data';
const DELAY_MS = 600;

const SAMPLE_TASKS: Task[] = [
  {
    id: '1',
    title: 'Complete Project Proposal',
    description: 'Draft the initial requirements and timeline for the Q4 marketing project.',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),

    status: TaskStatus.PENDING,
    priority: TaskPriority.HIGH,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Review PR #45',
    description: 'Code review for the new authentication flow implementation.',
    dueDate: new Date(Date.now() - 86400000).toISOString(),

    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Update Documentation',
    description: 'Reflect the latest API changes in the developer portal.',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    status: TaskStatus.DONE,
    priority: TaskPriority.LOW,
    createdAt: new Date().toISOString()
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredTasks = (): Task[] | null => {
  const json = localStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : null;
};

const setStoredTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const taskService = {
  async fetchAll(): Promise<Task[]> {
    await delay(DELAY_MS);
    let tasks = getStoredTasks();

    if (!tasks || tasks.length === 0) {
      tasks = SAMPLE_TASKS;
      setStoredTasks(tasks);
    }

    return tasks;
  },

  async create(data: TaskFormData): Promise<Task> {
    await delay(DELAY_MS);
    const tasks = getStoredTasks() || [];
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    setStoredTasks([newTask, ...tasks]);
    return newTask;
  },

  async update(id: string, data: Partial<Task>): Promise<Task> {
    await delay(DELAY_MS);
    const tasks = getStoredTasks() || [];
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');

    const updatedTask = { ...tasks[index], ...data };
    tasks[index] = updatedTask;
    setStoredTasks(tasks);
    return updatedTask;
  },

  async delete(id: string): Promise<void> {
    await delay(DELAY_MS);
    const tasks = getStoredTasks() || [];
    const filtered = tasks.filter(t => t.id !== id);
    setStoredTasks(filtered);
  }
};
