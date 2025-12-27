
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Task, TaskStatus, TaskPriority, FilterType, SortBy, TaskFormData } from './types';
import { taskService } from './services/taskService';
import { useDebounce } from './hooks/useDebounce';

import { Navbar } from './components/layout/Navbar';
import { TaskItem } from './components/tasks/TaskItem';
import TaskModal from './components/tasks/TaskModal';
import { SearchIcon } from './components/ui/Icons';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.DATE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const data = await taskService.fetchAll();
      setTasks(data);
      setLoading(false);
    };
    init();
  }, []);

  const onAddTask = useCallback(async (data: TaskFormData) => {
    try {
      const newTask = await taskService.create(data);
      setTasks(prev => [newTask, ...prev]);
      setIsModalOpen(false);
    } catch (error) {
      alert('Failed to add task. Please check your API.');
    }
  }, []);

  const onUpdateTask = useCallback(async (data: TaskFormData) => {
    if (!editingTask) return;
    try {
      const updated = await taskService.update(editingTask.id, data);
      setTasks(prev => prev.map(t => t.id === editingTask.id ? updated : t));
      setEditingTask(undefined);
      setIsModalOpen(false);
    } catch (error) {
      alert('Failed to update task.');
    }
  }, [editingTask]);

  const onDeleteTask = useCallback(async (id: string) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      alert('Failed to delete task.');
    }
  }, []);

  const onToggleTask = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = task.status === TaskStatus.DONE ? TaskStatus.PENDING : TaskStatus.DONE;
    try {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
      await taskService.update(id, { status: newStatus });
    } catch (error) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: task.status } : t));
      alert('Failed to update status.');
    }
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(t => {
        const matchesQuery = t.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          (t.description || '').toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesFilter = filter === 'ALL' || t.status === filter;
        return matchesQuery && matchesFilter;
      })
      .sort((a, b) => {
        if (a.status !== b.status) return a.status === TaskStatus.PENDING ? -1 : 1;
        if (sortBy === SortBy.TITLE) return a.title.localeCompare(b.title);
        if (sortBy === SortBy.PRIORITY) {
          const weights = { [TaskPriority.HIGH]: 3, [TaskPriority.MEDIUM]: 2, [TaskPriority.LOW]: 1 };
          return weights[b.priority] - weights[a.priority];
        }
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  }, [tasks, debouncedSearch, filter, sortBy]);

  const progress = tasks.length ? Math.round((tasks.filter(t => t.status === TaskStatus.DONE).length / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased overflow-x-hidden selection:bg-indigo-100 pb-12">
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-slate-200">
        <div
          className="h-full bg-indigo-600 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(79,70,229,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Navbar onAddTask={() => { setEditingTask(undefined); setIsModalOpen(true); }} />

      <main className="mx-auto w-full max-w-2xl px-4 py-8">
        <header className="mb-8 flex flex-wrap justify-between items-center gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Task Tracker</h1>
            <p className="text-slate-500 text-sm font-medium">Synced with remote API.</p>
          </div>
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm text-center">
            <span className="block text-xl font-black text-indigo-600 leading-none">{progress}%</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Progress</span>
          </div>
        </header>

        <section className="space-y-4 mb-8">
          <div className="relative group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Find a task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm font-medium"
            />
          </div>

          <div className="flex flex-row gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:border-indigo-500 shadow-sm appearance-none truncate"
              >
                <option value="ALL">All Status</option>
                <option value={TaskStatus.PENDING}>Pending</option>
                <option value={TaskStatus.DONE}>Finished</option>
              </select>
            </div>
            <div className="flex-1 min-w-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:border-indigo-500 shadow-sm appearance-none truncate"
              >
                <option value={SortBy.DATE}>By Date</option>
                <option value={SortBy.TITLE}>By Name</option>
                <option value={SortBy.PRIORITY}>By Priority</option>
              </select>
            </div>
          </div>
        </section>

        <div className="space-y-3 min-h-[40vh]">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Syncing API</p>
            </div>
          ) : filteredTasks.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggleTask}
                  onEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white/50 border border-dashed border-slate-200 rounded-[2rem]">
              <p className="font-bold text-slate-400 text-sm">No tasks found.</p>
            </div>
          )}
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTask(undefined); }}
        onSubmit={editingTask ? onUpdateTask : onAddTask}
        initialData={editingTask}
        title={editingTask ? 'Update Task' : 'New Task'}
      />
    </div>
  );
};

export default App;
