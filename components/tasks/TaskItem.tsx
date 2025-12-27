
import React from 'react';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { CheckIcon, EditIcon, TrashIcon, CalendarIcon } from '../ui/Icons';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const getPriorityStyles = (priority: TaskPriority, isDone: boolean) => {
  if (isDone) return 'bg-slate-100 text-slate-400 border-slate-200';
  switch (priority) {
    case TaskPriority.HIGH: return 'bg-red-50 text-red-600 border-red-100';
    case TaskPriority.MEDIUM: return 'bg-orange-50 text-orange-600 border-orange-100';
    case TaskPriority.LOW: return 'bg-blue-50 text-blue-600 border-blue-100';
    default: return 'bg-slate-50 text-slate-500 border-slate-100';
  }
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const isDone = task.status === TaskStatus.DONE;
  const isOverdue = !isDone && new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div
      className={`group relative flex items-start gap-3 sm:gap-4 p-4 rounded-2xl transition-all duration-300 border w-full max-w-full ${isDone
        ? 'bg-slate-50/70 border-slate-100'
        : 'bg-white border-transparent shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.08)] hover:border-slate-200'
        }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={`mt-1 w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all active:scale-90 ${isDone
          ? 'bg-indigo-600 border-indigo-600 text-white'
          : 'border-slate-200 hover:border-indigo-400 bg-white'
          }`}
      >
        {isDone && <CheckIcon className="w-3 h-3" />}
      </button>

      <div className="flex-grow min-w-0 flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <h3 className={`text-sm sm:text-base font-bold truncate ${isDone ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
            {task.title}
          </h3>
          <span className={`flex-shrink-0 text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${getPriorityStyles(task.priority, isDone)}`}>
            {task.priority}
          </span>
        </div>

        {task.description && !isDone && (
          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-snug mb-1">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`}>
            <CalendarIcon className="w-3 h-3" />
            <span>
              {isOverdue ? 'Overdue ' : 'Due '}
              {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
          {isDone && <span className="text-indigo-500/80 font-black px-1.5 bg-indigo-50 rounded">Done</span>}
        </div>
      </div>

      <div className="flex items-center gap-0.5 ml-1">
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
          aria-label="Edit"
        >
          <EditIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90"
          aria-label="Delete"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
