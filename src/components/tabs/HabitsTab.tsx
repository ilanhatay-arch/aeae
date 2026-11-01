import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Flame,
  Plus,
  Trash2,
  Check,
  TrendingUp,
  Sparkles,
  Award,
} from 'lucide-react';
import { Habit, UserProfile } from '../../types';
import { getPastDays } from '../../utils/storage';
import { sound, triggerHaptic } from '../../utils/audio';

interface HabitsTabProps {
  habits: Habit[];
  profile: UserProfile;
  todayDateStr: string;
  onToggleHabitDate: (habitId: string, dateStr: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'streak'>) => void;
  onDeleteHabit: (habitId: string) => void;
  onOpenQuickAdd: () => void;
}

export const HabitsTab: React.FC<HabitsTabProps> = ({
  habits,
  profile,
  todayDateStr,
  onToggleHabitDate,
  onDeleteHabit,
  onOpenQuickAdd,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tümü' },
    { id: 'health', label: 'Sağlık' },
    { id: 'growth', label: 'Gelişim' },
    { id: 'mind', label: 'Zihin' },
    { id: 'productivity', label: 'Üretkenlik' },
  ];

  const past7Days = getPastDays(7);

  const getDayLetter = (dateStr: string) => {
    const d = new Date(dateStr);
    const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    return days[d.getDay()];
  };

  const getDayNumber = (dateStr: string) => {
    return dateStr.split('-')[2];
  };

  const filteredHabits = habits.filter((h) =>
    selectedCategory === 'all' ? true : h.category === selectedCategory
  );

  const totalCompletions = habits.reduce(
    (sum, h) => sum + h.completedDates.length,
    0
  );

  const bestStreak = habits.reduce(
    (max, h) => Math.max(max, h.streak),
    0
  );

  const handleToggle = (habit: Habit, dateStr: string) => {
    const isCompleted = habit.completedDates.includes(dateStr);
    onToggleHabitDate(habit.id, dateStr);

    if (!isCompleted) {
      sound.playSuccess(profile.soundEnabled);
      triggerHaptic(profile.hapticEnabled, 25);
      if (dateStr === todayDateStr) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } else {
      sound.playTap(profile.soundEnabled);
      triggerHaptic(profile.hapticEnabled, 10);
    }
  };

  return (
    <div className="flex-1 p-4 pb-20 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            İstikrar & Disiplin
          </span>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Alışkanlıklarım
          </h1>
        </div>
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-sm shadow-violet-600/30 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Alışkanlık</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Aktif Seri
          </span>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
              {bestStreak} Gün
            </span>
          </div>
        </div>

        <div className="border-x border-slate-100 dark:border-slate-700">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Alışkanlık
          </span>
          <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums block mt-0.5">
            {habits.length}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Tamamlama
          </span>
          <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 tabular-nums block mt-0.5">
            {totalCompletions}
          </span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              sound.playTap(profile.soundEnabled);
              setSelectedCategory(cat.id);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {filteredHabits.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Bu kategoride henüz alışkanlık bulunmuyor.</p>
          </div>
        ) : (
          filteredHabits.map((habit) => {
            const isTodayDone = habit.completedDates.includes(todayDateStr);
            return (
              <div
                key={habit.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: habit.color }}
                    >
                      <Flame className="w-4 h-4 fill-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {habit.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>Hedef: haftada {habit.targetDaysPerWeek} gün</span>
                        <span>·</span>
                        <span className="text-orange-500 font-semibold flex items-center gap-0.5">
                          <Flame className="w-3 h-3 fill-orange-500" />
                          {habit.streak} gün seri
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`"${habit.title}" alışkanlığını silmek istiyor musunuz?`)) {
                        onDeleteHabit(habit.id);
                        sound.playTap(profile.soundEnabled);
                      }
                    }}
                    className="p-1 text-slate-300 hover:text-rose-500 transition"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 7-Day Matrix */}
                <div className="pt-1 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="grid grid-cols-7 gap-1">
                    {past7Days.map((dStr) => {
                      const isDone = habit.completedDates.includes(dStr);
                      const isToday = dStr === todayDateStr;
                      return (
                        <button
                          key={dStr}
                          onClick={() => handleToggle(habit, dStr)}
                          className={`flex flex-col items-center py-1.5 rounded-xl transition-all active:scale-95 ${
                            isDone
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : isToday
                              ? 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 border border-dashed border-indigo-400'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-[9px] font-semibold uppercase">
                            {getDayLetter(dStr)}
                          </span>
                          <span className="text-[11px] font-bold tabular-nums mt-0.5">
                            {getDayNumber(dStr)}
                          </span>
                          <div className="mt-1">
                            {isDone ? (
                              <Check className="w-3 h-3 stroke-[3]" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 block" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
