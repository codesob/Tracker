
import React from 'react';
import { PlusIcon } from '../ui/Icons';

interface NavbarProps {
  onAddTask: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAddTask }) => (
  <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-lg sticky top-0 z-40">
    <div className="mx-auto max-w-2xl px-4 sm:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-lg font-black tracking-tight text-slate-900">Task Tracker</span>
      </div>
      <button
        onClick={onAddTask}
        className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-slate-900 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all active:scale-95 shadow-sm flex items-center gap-2"
      >
        <PlusIcon className="w-3.5 h-3.5" />
        <span className="hidden xs:inline">New Task</span>
        <span className="xs:hidden">New Task</span>
      </button>
    </div>
  </nav>
);
