import React from 'react';
import {
  CalendarDays,
  Flame,
  CheckSquare,
  Wallet,
  Timer,
  Plus,
} from 'lucide-react';
import { TabType } from '../types';
import { sound, triggerHaptic } from '../utils/audio';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenQuickAdd: () => void;
  pendingTasksCount: number;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenQuickAdd,
  pendingTasksCount,
  soundEnabled,
  hapticEnabled,
}) => {
  const tabs = [
    { id: 'today' as TabType, label: 'Bugün', icon: CalendarDays },
    { id: 'habits' as TabType, label: 'Alışkanlık', icon: Flame },
    { id: 'tasks' as TabType, label: 'Görevler', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'finance' as TabType, label: 'Cüzdan', icon: Wallet },
    { id: 'focus' as TabType, label: 'Odak', icon: Timer },
  ];

  const handleTabClick = (tabId: TabType) => {
    sound.playTap(soundEnabled);
    triggerHaptic(hapticEnabled, 12);
    onSelectTab(tabId);
  };

  const handleQuickAdd = () => {
    sound.playTap(soundEnabled);
    triggerHaptic(hapticEnabled, 20);
    onOpenQuickAdd();
  };

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shrink-0">
      <div className="grid grid-cols-5 items-center h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-all group active:scale-95"
              aria-label={tab.label}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 stroke-[2.4]'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 stroke-[1.8]'
                  }`}
                />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white tabular-nums">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                ) : null}
              </div>

              <span
                className={`text-[10px] tracking-tight mt-1 transition-colors duration-200 whitespace-nowrap ${
                  isActive
                    ? 'font-semibold text-indigo-600 dark:text-indigo-400'
                    : 'font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                }`}
              >
                {tab.label}
              </span>

              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
