import { Habit, Task, Transaction, DailySummary, UserProfile } from '../types';

export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getPastDays = (count: number): string[] => {
  const dates: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
};

const pastDays = getPastDays(7);
const todayStr = getTodayDateString();

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    title: 'Günde 2.5 Litre Su İç',
    category: 'health',
    targetDaysPerWeek: 7,
    streak: 6,
    completedDates: [pastDays[0], pastDays[1], pastDays[2], pastDays[3], pastDays[4], pastDays[5]],
    icon: 'droplets',
    color: '#0284c7', // Sky Blue
  },
  {
    id: 'habit-2',
    title: '30 Dakika Kitap Oku',
    category: 'growth',
    targetDaysPerWeek: 5,
    streak: 12,
    completedDates: [pastDays[1], pastDays[2], pastDays[3], pastDays[4], pastDays[5], todayStr],
    icon: 'book-open',
    color: '#7c3aed', // Violet
  },
  {
    id: 'habit-3',
    title: '10.000 Adım & Yürüyüş',
    category: 'health',
    targetDaysPerWeek: 6,
    streak: 4,
    completedDates: [pastDays[2], pastDays[3], pastDays[4], pastDays[5]],
    icon: 'footprints',
    color: '#059669', // Emerald
  },
  {
    id: 'habit-4',
    title: 'Geliştirme & Kod Yazma',
    category: 'productivity',
    targetDaysPerWeek: 5,
    streak: 9,
    completedDates: [pastDays[0], pastDays[2], pastDays[3], pastDays[4], pastDays[5], todayStr],
    icon: 'code',
    color: '#ea580c', // Orange
  },
  {
    id: 'habit-5',
    title: 'Nefes & Meditasyon',
    category: 'mind',
    targetDaysPerWeek: 7,
    streak: 5,
    completedDates: [pastDays[1], pastDays[2], pastDays[3], pastDays[4], pastDays[5]],
    icon: 'sparkles',
    color: '#db2777', // Pink
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Haftalık bütçe ve harcama dökümünü kontrol et',
    category: 'finance',
    priority: 'high',
    completed: false,
    dueDate: todayStr,
    dueTime: '17:00',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Mobil arayüz bileşenlerini doğrula ve test et',
    category: 'work',
    priority: 'high',
    completed: true,
    dueDate: todayStr,
    dueTime: '14:30',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Taze sebze, meyve ve kahve çekirdeği al',
    category: 'personal',
    priority: 'medium',
    completed: false,
    dueDate: todayStr,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Diş hekimi kontrol randevusunu oluştur',
    category: 'health',
    priority: 'low',
    completed: false,
    dueDate: pastDays[6] || todayStr,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'income',
    amount: 28500,
    category: 'Maaş / Gelir',
    description: 'Aylık hakediş & proje avansı',
    date: pastDays[1] || todayStr,
  },
  {
    id: 'tx-2',
    type: 'expense',
    amount: 540,
    category: 'Market & Gıda',
    description: 'Haftalık taze market alışverişi',
    date: todayStr,
  },
  {
    id: 'tx-3',
    type: 'expense',
    amount: 120,
    category: 'Kahve & Kafe',
    description: 'Filtre kahve & kruvasan',
    date: todayStr,
  },
  {
    id: 'tx-4',
    type: 'expense',
    amount: 750,
    category: 'Sağlık & Spor',
    description: 'Aylık spor salonu aboneliği',
    date: pastDays[3] || todayStr,
  },
  {
    id: 'tx-5',
    type: 'expense',
    amount: 220,
    category: 'Ulaşım',
    description: 'Toplu taşıma kartı bakiye dolumu',
    date: pastDays[4] || todayStr,
  },
];

export const INITIAL_DAILY_SUMMARY: DailySummary = {
  waterMl: 1750,
  waterGoalMl: 2500,
  steps: 7420,
  stepsGoal: 10000,
  focusMinutesToday: 50,
  dayFocusGoal: 100,
  dailyFocusThought: 'Küçük adımların istikrarı, olağanüstü sonuçlar doğurur.',
  date: todayStr,
};

export const INITIAL_PROFILE: UserProfile = {
  name: 'İlan Hatay',
  avatarSeed: 'ilan',
  theme: 'dark',
  soundEnabled: true,
  hapticEnabled: true,
  phoneFrameMode: true,
  deviceFrameStyle: 'iphone',
};

const STORAGE_KEYS = {
  HABITS: 'mobilyasam_habits_v1',
  TASKS: 'mobilyasam_tasks_v1',
  TRANSACTIONS: 'mobilyasam_transactions_v1',
  SUMMARY: 'mobilyasam_summary_v1',
  PROFILE: 'mobilyasam_profile_v1',
};

export const storage = {
  getHabits(): Habit[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HABITS);
      return data ? JSON.parse(data) : INITIAL_HABITS;
    } catch {
      return INITIAL_HABITS;
    }
  },
  saveHabits(habits: Habit[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    } catch {
      // ignore
    }
  },

  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  },
  saveTasks(tasks: Task[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  },

  getTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  },
  saveTransactions(txs: Transaction[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
    } catch {
      // ignore
    }
  },

  getSummary(): DailySummary {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUMMARY);
      if (data) {
        const parsed: DailySummary = JSON.parse(data);
        // If from another day, carry over goals with reset values
        if (parsed.date !== todayStr) {
          return {
            ...INITIAL_DAILY_SUMMARY,
            waterGoalMl: parsed.waterGoalMl,
            stepsGoal: parsed.stepsGoal,
            dayFocusGoal: parsed.dayFocusGoal,
            date: todayStr,
          };
        }
        return parsed;
      }
      return INITIAL_DAILY_SUMMARY;
    } catch {
      return INITIAL_DAILY_SUMMARY;
    }
  },
  saveSummary(summary: DailySummary) {
    try {
      localStorage.setItem(STORAGE_KEYS.SUMMARY, JSON.stringify(summary));
    } catch {
      // ignore
    }
  },

  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? { ...INITIAL_PROFILE, ...JSON.parse(data) } : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  },
  saveProfile(profile: UserProfile) {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
  },

  resetAll() {
    try {
      localStorage.removeItem(STORAGE_KEYS.HABITS);
      localStorage.removeItem(STORAGE_KEYS.TASKS);
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      localStorage.removeItem(STORAGE_KEYS.SUMMARY);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
    } catch {
      // ignore
    }
  },
};
