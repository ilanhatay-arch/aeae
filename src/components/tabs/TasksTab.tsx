import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckSquare,
  Plus,
  Trash2,
  Check,
  Calendar,
  Clock,
  Filter,
  Search,
} from 'lucide-react';
import { Task, UserProfile } from '../../types';
import { sound, triggerHaptic } from '../../utils/audio';

interface TasksTabProps {
  tasks: Task[];
  profile: UserProfile;
  todayDateStr: string;
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenQuickAdd: () => void;
}

type TaskFilter = 'today' | 'important' | 'all' | 'completed';

export const TasksTab: React.FC<TasksTabProps> = ({
  tasks,
  profile,
  todayDateStr,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onOpenQuickAdd,
}) => {
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickInput, setQuickInput] = useState('');

  const filterTabs = [
    { id: 'today' as TaskFilter, label: 'Bugün' },
    { id: 'important' as TaskFilter, label: 'Önemli' },
    { id: 'all' as TaskFilter, label: 'Tümü' },
    { id: 'completed' as TaskFilter, label: 'Bitenler' },
  ];

  const handleToggle = (task: Task) => {
    onToggleTask(task.id);
    if (!task.completed) {
      sound.playSuccess(profile.soundEnabled);
      triggerHaptic(profile.hapticEnabled, 20);
      if (task.priority === 'high') {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
      }
    } else {
      sound.playTap(profile.soundEnabled);
      triggerHaptic(profile.hapticEnabled, 10);
    }
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onAddTask({
      title: quickInput.trim(),
      category: 'personal',
      priority: activeFilter === 'important' ? 'high' : 'medium',
      completed: false,
      dueDate: todayDateStr,
    });
    sound.playSuccess(profile.soundEnabled);
    triggerHaptic(profile.hapticEnabled, 20);
    setQuickInput('');
  };

  const filteredTasks = tasks.filter((t) => {
    // Search query
    if (searchQuery.trim() && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Filter
    if (activeFilter === 'today') return t.dueDate === todayDateStr && !t.completed;
    if (activeFilter === 'important') return t.priority === 'high' && !t.completed;
    if (activeFilter === 'completed') return t.completed;
    return true; // 'all'
  });

  const categoryLabels = {
    work: 'İş',
    personal: 'Kişisel',
    health: 'Sağlık',
    finance: 'Finans',
  };

  const priorityLabels = {
    high: 'Yüksek',
    medium: 'Orta',
    low: 'Normal',
  };

  const priorityColors = {
    high: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
    medium: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
    low: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
  };

  return (
    <div className="flex-1 p-4 pb-20 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Yapılacaklar & Notlar
          </span>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Görevlerim
          </h1>
        </div>
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-600/30 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Detaylı Ekle</span>
        </button>
      </div>

      {/* Quick Add Bar */}
      <form onSubmit={handleQuickAdd} className="relative flex items-center">
        <input
          type="text"
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
          placeholder="+ Hızlı görev ekle (Enter'a bas)"
          className="w-full pl-3.5 pr-10 py-2.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
        />
        {quickInput.trim() && (
          <button
            type="submit"
            className="absolute right-2 p-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Segmented Filter Control */}
      <div className="flex p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-xl">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playTap(profile.soundEnabled);
              setActiveFilter(tab.id);
            }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeFilter === tab.id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Görevlerde ara..."
          className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/50 text-xs text-slate-700 dark:text-slate-200 border-none focus:outline-none focus:ring-1 focus:ring-slate-300"
        />
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <CheckSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">
              {activeFilter === 'completed'
                ? 'Henüz tamamlanan görev yok.'
                : 'Tebrikler! Bu kategoride bekleyen görev yok.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                task.completed
                  ? 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 opacity-75'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-300'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <button
                  onClick={() => handleToggle(task)}
                  className={`w-5 h-5 mt-0.5 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                    task.completed
                      ? 'bg-indigo-600 text-white'
                      : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                  }`}
                >
                  {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </button>

                <div className="min-w-0 flex-1">
                  <h3
                    className={`text-xs font-medium leading-snug ${
                      task.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 flex-wrap">
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      {categoryLabels[task.category]}
                    </span>
                    <span>·</span>
                    <span className={`px-1.5 py-0.2 rounded border font-semibold ${priorityColors[task.priority]}`}>
                      {priorityLabels[task.priority]}
                    </span>
                    {task.dueTime && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-0.5 text-slate-400">
                          <Clock className="w-3 h-3" />
                          {task.dueTime}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onDeleteTask(task.id);
                  sound.playTap(profile.soundEnabled);
                }}
                className="p-1 text-slate-300 hover:text-rose-500 transition shrink-0"
                title="Sil"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
