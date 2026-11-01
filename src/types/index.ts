export type TabType = 'today' | 'habits' | 'tasks' | 'finance' | 'focus';

export interface Habit {
  id: string;
  title: string;
  category: 'health' | 'growth' | 'mind' | 'productivity';
  targetDaysPerWeek: number;
  streak: number;
  completedDates: string[]; // YYYY-MM-DD
  icon: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  category: 'work' | 'personal' | 'health' | 'finance';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
}

export interface DailySummary {
  waterMl: number;
  waterGoalMl: number;
  steps: number;
  stepsGoal: number;
  focusMinutesToday: number;
  dayFocusGoal: number;
  dailyFocusThought: string;
  date: string; // YYYY-MM-DD
}

export interface UserProfile {
  name: string;
  avatarSeed: string;
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  hapticEnabled: boolean;
  phoneFrameMode: boolean; // on desktop: show phone frame or full width
  deviceFrameStyle: 'iphone' | 'android' | 'minimal';
}
