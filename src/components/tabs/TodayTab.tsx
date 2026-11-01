import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Droplets,
  Footprints,
  Flame,
  CheckCircle2,
  Circle,
  Plus,
  Minus,
  Sparkles,
  Quote,
  TrendingUp,
  RefreshCw,
  Edit2,
  Check,
} from 'lucide-react';
import { DailySummary, Habit, Task, UserProfile } from '../../types';
import { sound, triggerHaptic } from '../../utils/audio';

interface TodayTabProps {
  summary: DailySummary;
  habits: Habit[];
  tasks: Task[];
  profile: UserProfile;
  todayDateStr: string;
  onUpdateSummary: (s: Partial<DailySummary>) => void;
  onToggleHabit: (habitId: string) => void;
  onToggleTask: (taskId: string) => void;
  onOpenQuickAdd: () => void;
}

const INSPIRATIONAL_QUOTES = [
  { text: 'Büyük başarılar, her gün tekrarlanan küçük disiplinlerin toplamıdır.', author: 'Robert Collier' },
  { text: 'Bugün başladığın şey, yarın olacağın kişinin temelidir.', author: ' Seneca' },
  { text: 'Harekete geçmek için mükemmel hissetmeyi bekleme, hareket hissi getirir.', author: 'James Clear' },
  { text: 'Zaman en adil dağıtılmış kaynaktır; herkesin günü 24 saattir.', author: 'Marcus Aurelius' },
  { text: 'En uzun yolculuklar bile tek bir adımla başlar.', author: 'Lao Tzu' },
];

export const TodayTab: React.FC<TodayTabProps> = ({
  summary,
  habits,
  tasks,
  profile,
  todayDateStr,
  onUpdateSummary,
  onToggleHabit,
  onToggleTask,
  onOpenQuickAdd,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isEditingThought, setIsEditingThought] = useState(false);
  const [thoughtInput, setThoughtInput] = useState(summary.dailyFocusThought);

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Calculate stats
  const completedHabitsCount = habits.filter((h) =>
    h.completedDates.includes(todayDateStr)
  ).length;
  const habitsRate = habits.length > 0 ? Math.round((completedHabitsCount / habits.length) * 100) : 0;

  const todayTasks = tasks.filter((t) => t.dueDate === todayDateStr);
  const completedTasksCount = todayTasks.filter((t) => t.completed).length;
  const tasksRate = todayTasks.length > 0 ? Math.round((completedTasksCount / todayTasks.length) * 100) : 0;

  const waterPercent = Math.min(100, Math.round((summary.waterMl / summary.waterGoalMl) * 100));
  const stepsPercent = Math.min(100, Math.round((summary.steps / summary.stepsGoal) * 100));

  const addWater = (amount: number) => {
    const next = Math.max(0, summary.waterMl + amount);
    onUpdateSummary({ waterMl: next });
    sound.playWaterDrop(profile.soundEnabled);
    triggerHaptic(profile.hapticEnabled, 15);
    if (next >= summary.waterGoalMl && summary.waterMl < summary.waterGoalMl) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      sound.playSuccess(profile.soundEnabled);
    }
  };

  const addSteps = (amount: number) => {
    const next = Math.max(0, summary.steps + amount);
    onUpdateSummary({ steps: next });
    sound.playTap(profile.soundEnabled);
    triggerHaptic(profile.hapticEnabled, 15);
  };

  const handleNextQuote = () => {
    sound.playTap(profile.soundEnabled);
    setQuoteIndex((prev) => (prev + 1) % INSPIRATIONAL_QUOTES.length);
  };

  const saveThought = () => {
    onUpdateSummary({ dailyFocusThought: thoughtInput });
    setIsEditingThought(false);
    sound.playTap(profile.soundEnabled);
  };

  return (
    <div className="flex-1 p-4 pb-20 space-y-4">
      {/* Top Greeting & Date Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 capitalize">
            {dateFormatted}
          </span>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Merhaba, {profile.name.split(' ')[0]}
          </h1>
        </div>
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-600/30 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Ekle</span>
        </button>
      </div>

      {/* Daily Focus Thought Banner */}
      <div className="relative p-3.5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/50 dark:border-indigo-900/50">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Günün Ana Odağı</span>
          </div>
          <button
            onClick={() => {
              if (isEditingThought) saveThought();
              else setIsEditingThought(true);
            }}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            {isEditingThought ? <Check className="w-3.5 h-3.5 text-indigo-600" /> : <Edit2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {isEditingThought ? (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={thoughtInput}
              onChange={(e) => setThoughtInput(e.target.value)}
              className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && saveThought()}
            />
            <button
              onClick={saveThought}
              className="px-2.5 py-1 text-xs bg-indigo-600 text-white font-medium rounded-lg"
            >
              Kaydet
            </button>
          </div>
        ) : (
          <p className="mt-1 text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed italic">
            "{summary.dailyFocusThought}"
          </p>
        )}
      </div>

      {/* 4-Item Quick Metric Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Water Ring Card */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                <Droplets className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Su</span>
            </div>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400 tabular-nums">
              %{waterPercent}
            </span>
          </div>

          <div className="my-2.5">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                {(summary.waterMl / 1000).toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">/ {(summary.waterGoalMl / 1000).toFixed(1)} L</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 mt-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-300"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100 dark:border-slate-700/60">
            <button
              onClick={() => addWater(-250)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              title="-250 ml"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => addWater(250)}
              className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-300 text-[11px] font-semibold hover:bg-sky-100"
            >
              +250 ml
            </button>
            <button
              onClick={() => addWater(500)}
              className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-300 text-[11px] font-semibold hover:bg-sky-100"
            >
              +500 ml
            </button>
          </div>
        </div>

        {/* Steps Card */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Footprints className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Adım</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              %{stepsPercent}
            </span>
          </div>

          <div className="my-2.5">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                {summary.steps.toLocaleString('tr-TR')}
              </span>
              <span className="text-xs text-slate-400">/ {summary.stepsGoal.toLocaleString('tr-TR')}</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 mt-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${stepsPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-700/60">
            <button
              onClick={() => addSteps(500)}
              className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 text-[11px] font-semibold hover:bg-emerald-100"
            >
              +500
            </button>
            <button
              onClick={() => addSteps(1000)}
              className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 text-[11px] font-semibold hover:bg-emerald-100"
            >
              +1000
            </button>
          </div>
        </div>
      </div>

      {/* Habit Mini Strip for Today */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500" />
            <h2 className="text-xs font-bold text-slate-900 dark:text-white">Bugünün Alışkanlıkları</h2>
          </div>
          <span className="text-xs text-slate-400 tabular-nums font-semibold">
            {completedHabitsCount} / {habits.length} tamamlandı
          </span>
        </div>

        <div className="space-y-1.5">
          {habits.slice(0, 4).map((habit) => {
            const isDone = habit.completedDates.includes(todayDateStr);
            return (
              <button
                key={habit.id}
                onClick={() => onToggleHabit(habit.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
                  isDone
                    ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : 'border-2 border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isDone
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {habit.title}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-orange-500 tabular-nums">
                  <Flame className="w-3 h-3 fill-orange-500" />
                  <span>{habit.streak}g</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Priority Tasks for Today */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
            <h2 className="text-xs font-bold text-slate-900 dark:text-white">Öncelikli Görevler</h2>
          </div>
          <span className="text-xs text-slate-400 tabular-nums font-semibold">
            {completedTasksCount} / {todayTasks.length}
          </span>
        </div>

        {todayTasks.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-3">Bugün için görev bulunmuyor.</p>
        ) : (
          <div className="space-y-1.5">
            {todayTasks.slice(0, 3).map((task) => (
              <button
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
                  task.completed
                    ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                      task.completed
                        ? 'bg-indigo-600 text-white'
                        : 'border-2 border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span
                    className={`text-xs font-medium truncate ${
                      task.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                {task.priority === 'high' && (
                  <span className="text-[10px] text-rose-500 font-semibold shrink-0 ml-2">
                    Yüksek
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Inspirational Quote Card */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80">
        <div className="flex items-start justify-between">
          <Quote className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <button
            onClick={handleNextQuote}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            title="Yeni Söz"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-serif italic">
          "{INSPIRATIONAL_QUOTES[quoteIndex].text}"
        </p>
        <span className="block mt-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-right">
          — {INSPIRATIONAL_QUOTES[quoteIndex].author}
        </span>
      </div>
    </div>
  );
};
