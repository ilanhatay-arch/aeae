import React, { useState } from 'react';
import { X, CheckSquare, Flame, Wallet, Droplets, Sparkles } from 'lucide-react';
import { Habit, Task, Transaction } from '../types';
import { sound, triggerHaptic } from '../utils/audio';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'streak'>) => void;
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onAddWater: (amountMl: number) => void;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

type ActionType = 'select' | 'task' | 'habit' | 'tx';

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  onAddHabit,
  onAddTransaction,
  onAddWater,
  soundEnabled,
  hapticEnabled,
}) => {
  const [activeAction, setActiveAction] = useState<ActionType>('select');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [taskCategory, setTaskCategory] = useState<'work' | 'personal' | 'health' | 'finance'>('personal');

  // Habit form state
  const [habitTitle, setHabitTitle] = useState('');
  const [habitCategory, setHabitCategory] = useState<'health' | 'growth' | 'mind' | 'productivity'>('health');
  const [habitTargetDays, setHabitTargetDays] = useState(7);

  // Transaction form state
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('Market & Gıda');
  const [txDescription, setTxDescription] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setActiveAction('select');
    onClose();
  };

  const handleSelect = (action: ActionType) => {
    sound.playTap(soundEnabled);
    triggerHaptic(hapticEnabled, 15);
    setActiveAction(action);
  };

  const submitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    onAddTask({
      title: taskTitle.trim(),
      category: taskCategory,
      priority: taskPriority,
      completed: false,
      dueDate: today,
    });
    sound.playSuccess(soundEnabled);
    triggerHaptic(hapticEnabled, 25);
    setTaskTitle('');
    handleClose();
  };

  const submitHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitTitle.trim()) return;
    const colors = {
      health: '#0284c7',
      growth: '#7c3aed',
      mind: '#db2777',
      productivity: '#ea580c',
    };
    onAddHabit({
      title: habitTitle.trim(),
      category: habitCategory,
      targetDaysPerWeek: habitTargetDays,
      icon: 'sparkles',
      color: colors[habitCategory],
    });
    sound.playSuccess(soundEnabled);
    triggerHaptic(hapticEnabled, 25);
    setHabitTitle('');
    handleClose();
  };

  const submitTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(txAmount);
    if (isNaN(num) || num <= 0) return;
    const today = new Date().toISOString().split('T')[0];
    onAddTransaction({
      type: txType,
      amount: num,
      category: txCategory,
      description: txDescription.trim() || (txType === 'expense' ? 'Gider' : 'Gelir'),
      date: today,
    });
    sound.playSuccess(soundEnabled);
    triggerHaptic(hapticEnabled, 25);
    setTxAmount('');
    setTxDescription('');
    handleClose();
  };

  const handleQuickWater = () => {
    sound.playWaterDrop(soundEnabled);
    triggerHaptic(hapticEnabled, 20);
    onAddWater(250);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 shadow-2xl p-5 pb-safe animate-in slide-in-from-bottom duration-200"
        role="dialog"
      >
        {/* Grab handle */}
        <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {activeAction === 'select' && 'Hızlı Eylem'}
            {activeAction === 'task' && 'Yeni Görev Ekle'}
            {activeAction === 'habit' && 'Yeni Alışkanlık Başlat'}
            {activeAction === 'tx' && 'İşlem Kaydet (Cüzdan)'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {activeAction === 'select' && (
          <div className="grid grid-cols-2 gap-3 pb-3">
            <button
              onClick={() => handleSelect('task')}
              className="flex flex-col items-start p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-100/70 transition text-left active:scale-[0.98]"
            >
              <div className="p-2 rounded-xl bg-indigo-600 text-white mb-2">
                <CheckSquare className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Görev Ekle</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Günün yapılacaklar listesi</span>
            </button>

            <button
              onClick={() => handleSelect('habit')}
              className="flex flex-col items-start p-4 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/50 hover:bg-violet-100/70 transition text-left active:scale-[0.98]"
            >
              <div className="p-2 rounded-xl bg-violet-600 text-white mb-2">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Alışkanlık</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Yeni bir seri başlat</span>
            </button>

            <button
              onClick={() => handleSelect('tx')}
              className="flex flex-col items-start p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-100/70 transition text-left active:scale-[0.98]"
            >
              <div className="p-2 rounded-xl bg-emerald-600 text-white mb-2">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Harcama / Gelir</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Bütçeni anında kaydet</span>
            </button>

            <button
              onClick={handleQuickWater}
              className="flex flex-col items-start p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 hover:bg-sky-100/70 transition text-left active:scale-[0.98]"
            >
              <div className="p-2 rounded-xl bg-sky-500 text-white mb-2">
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Su İçtim (+250 ml)</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">1 tıkla hidrasyon kaydı</span>
            </button>
          </div>
        )}

        {/* Task Form */}
        {activeAction === 'task' && (
          <form onSubmit={submitTask} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Görev Başlığı
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Örn: Raporu bitir veya yürüyüşe çık"
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Öncelik
                </label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as 'high' | 'medium' | 'low')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none"
                >
                  <option value="high">🔴 Yüksek Öncelik</option>
                  <option value="medium">🟡 Orta Öncelik</option>
                  <option value="low">🟢 Normal / Düşük</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Kategori
                </label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value as 'work' | 'personal' | 'health' | 'finance')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none"
                >
                  <option value="work">İş / Proje</option>
                  <option value="personal">Kişisel</option>
                  <option value="health">Sağlık</option>
                  <option value="finance">Finans</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveAction('select')}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Geri
              </button>
              <button
                type="submit"
                disabled={!taskTitle.trim()}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 active:scale-[0.98] transition"
              >
                Görevi Kaydet
              </button>
            </div>
          </form>
        )}

        {/* Habit Form */}
        {activeAction === 'habit' && (
          <form onSubmit={submitHabit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Alışkanlık Adı
              </label>
              <input
                type="text"
                value={habitTitle}
                onChange={(e) => setHabitTitle(e.target.value)}
                placeholder="Örn: 20 Sayfa Kitap Oku, Şekersiz Gün"
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Kategori
                </label>
                <select
                  value={habitCategory}
                  onChange={(e) => setHabitCategory(e.target.value as 'health' | 'growth' | 'mind' | 'productivity')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none"
                >
                  <option value="health">Sağlık & Beden</option>
                  <option value="growth">Kişisel Gelişim</option>
                  <option value="mind">Zihin & Huzur</option>
                  <option value="productivity">Üretkenlik</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Haftalık Hedef
                </label>
                <select
                  value={habitTargetDays}
                  onChange={(e) => setHabitTargetDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none"
                >
                  <option value={7}>Her gün (7 gün)</option>
                  <option value={5}>Hafta içi (5 gün)</option>
                  <option value={4}>Haftada 4 gün</option>
                  <option value={3}>Haftada 3 gün</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveAction('select')}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Geri
              </button>
              <button
                type="submit"
                disabled={!habitTitle.trim()}
                className="flex-1 py-2.5 rounded-xl bg-violet-600 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-violet-600/20 active:scale-[0.98] transition"
              >
                Alışkanlığı Başlat
              </button>
            </div>
          </form>
        )}

        {/* Transaction Form */}
        {activeAction === 'tx' && (
          <form onSubmit={submitTransaction} className="space-y-4">
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setTxType('expense')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  txType === 'expense'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Gider (-)
              </button>
              <button
                type="button"
                onClick={() => setTxType('income')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  txType === 'income'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Gelir (+)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tutar (₺)
                </label>
                <input
                  type="number"
                  step="any"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  placeholder="0.00"
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Kategori
                </label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none"
                >
                  <option value="Market & Gıda">Market & Gıda</option>
                  <option value="Yemek & Kafe">Yemek & Kafe</option>
                  <option value="Ulaşım">Ulaşım</option>
                  <option value="Faturalar">Faturalar</option>
                  <option value="Sağlık & Spor">Sağlık & Spor</option>
                  <option value="Maaş / Kazanç">Maaş / Kazanç</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Açıklama (İsteğe bağlı)
              </label>
              <input
                type="text"
                value={txDescription}
                onChange={(e) => setTxDescription(e.target.value)}
                placeholder="Örn: Market alışverişi"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveAction('select')}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Geri
              </button>
              <button
                type="submit"
                disabled={!txAmount}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 active:scale-[0.98] transition"
              >
                Kaydı Tamamla
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
