
import React, { useState, useEffect, useMemo } from 'react';
import { Task, TaskStatus, TaskPriority, TaskFormData } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  initialData?: Task;
  title: string;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, initialData, title }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM
  });

  const [errors, setErrors] = useState<{ dueDate?: string }>({});

  const referenceDate = useMemo(() => {
    if (initialData?.createdAt) {
      return new Date(initialData.createdAt).toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  }, [initialData, isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        dueDate: initialData.dueDate,
        status: initialData.status,
        priority: initialData.priority
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  useEffect(() => {
    const newErrors: { dueDate?: string } = {};
    if (formData.dueDate < referenceDate) {
      newErrors.dueDate = initialData
        ? `Date cannot be earlier than creation (${new Date(referenceDate).toLocaleDateString()})`
        : "Due date cannot be in the past";
    }
    setErrors(newErrors);
  }, [formData.dueDate, referenceDate, initialData]);

  if (!isOpen) return null;

  const isInvalid = Object.keys(errors).length > 0 || !formData.title.trim();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <header className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>

        <form onSubmit={(e) => { e.preventDefault(); if (!isInvalid) onSubmit(formData); }} className="p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 ml-1">Title</label>
            <input
              required
              autoFocus
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              placeholder="e.g. Design homepage layout"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 ml-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none placeholder:text-slate-400"
              placeholder="What needs to be done?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">Due Date</label>
              <input
                required
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className={`w-full px-5 py-3 bg-slate-50 border rounded-2xl text-sm font-semibold transition-all focus:outline-none ${errors.dueDate
                  ? 'border-rose-300 text-rose-600 focus:ring-rose-500/10 focus:border-rose-500'
                  : 'border-slate-200 text-slate-800 focus:ring-indigo-500/10 focus:border-indigo-500'
                  }`}
              />
              {errors.dueDate && (
                <p className="text-[10px] font-bold text-rose-500 mt-1 ml-1 animate-in slide-in-from-top-1">
                  {errors.dueDate}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
              >
                <option value={TaskPriority.LOW}>Low</option>
                <option value={TaskPriority.MEDIUM}>Medium</option>
                <option value={TaskPriority.HIGH}>High</option>
              </select>
            </div>
          </div>

          <footer className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isInvalid}
              className={`flex-1 py-3.5 text-sm font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] ${isInvalid
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'
                }`}
            >
              Save Task
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
