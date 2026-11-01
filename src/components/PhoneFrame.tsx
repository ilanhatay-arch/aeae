import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Battery, Wifi, Moon, Sun, Settings } from 'lucide-react';
import { UserProfile } from '../types';

interface PhoneFrameProps {
  children: React.ReactNode;
  profile: UserProfile;
  onUpdateProfile: (p: Partial<UserProfile>) => void;
  onOpenSettings: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  profile,
  onUpdateProfile,
  onOpenSettings,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [islandNotification, setIslandNotification] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFrameMode = () => {
    onUpdateProfile({ phoneFrameMode: !profile.phoneFrameMode });
  };

  const toggleTheme = () => {
    const nextTheme = profile.theme === 'dark' ? 'light' : 'dark';
    onUpdateProfile({ theme: nextTheme });
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Desktop Header / Control Bar (hidden on mobile devices) */}
      <header className="hidden md:flex items-center justify-between px-6 py-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-xs z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
            <span className="text-sm font-bold tracking-tight">Mobil Yaşam</span>
          </div>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500 dark:text-slate-400">PWA & Mobil Uygulama Deneyimi</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Switch layout on desktop */}
          <button
            onClick={toggleFrameMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition font-medium"
            title={profile.phoneFrameMode ? 'Genişletilmiş ekrana geç' : 'Telefon çerçevesine geç'}
          >
            {profile.phoneFrameMode ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Geniş Ekran Modu</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Telefon Çerçevesi Modu</span>
              </>
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Temayı Değiştir"
          >
            {profile.theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-700" />
            )}
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition font-medium"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Ayarlar</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-0 md:p-6 overflow-hidden">
        {profile.phoneFrameMode ? (
          /* Phone Frame Container on Desktop / Direct viewport on Mobile */
          <div className="w-full h-full md:h-auto md:max-h-[92vh] md:w-[420px] md:aspect-[9/19.5] relative md:rounded-[50px] md:p-3 md:bg-slate-900 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] md:ring-1 md:ring-slate-800 flex flex-col">
            {/* Phone Hardware Side Buttons (decorative on desktop) */}
            <div className="hidden md:block absolute -left-[14px] top-28 w-[3px] h-10 bg-slate-700 rounded-l"></div>
            <div className="hidden md:block absolute -left-[14px] top-42 w-[3px] h-12 bg-slate-700 rounded-l"></div>
            <div className="hidden md:block absolute -right-[14px] top-32 w-[3px] h-16 bg-slate-700 rounded-r"></div>

            {/* Phone Screen Area */}
            <div className="relative flex-1 w-full h-full bg-white dark:bg-slate-900 md:rounded-[42px] overflow-hidden flex flex-col shadow-inner">
              {/* Status Bar */}
              <div className="pt-safe shrink-0 h-11 px-6 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 z-30 select-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                <span className="tabular-nums tracking-tight">{currentTime || '12:00'}</span>

                {/* Dynamic Island Pill */}
                <div
                  onClick={() => {
                    setIslandNotification(
                      islandNotification ? null : 'Mobil Yaşam aktif'
                    );
                    setTimeout(() => setIslandNotification(null), 3000);
                  }}
                  className="cursor-pointer group flex items-center justify-center px-3 h-5 bg-slate-950 text-white rounded-full transition-all duration-300 hover:scale-105"
                  title="Dynamic Island"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-1.5 animate-pulse" />
                  <span className="text-[10px] font-medium text-slate-200 truncate max-w-[100px]">
                    {islandNotification || 'Mobil Yaşam'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-4 h-4" />
                </div>
              </div>

              {/* Scrollable Screen Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
                {children}
              </div>

              {/* iOS Home Indicator Bar */}
              <div className="pb-safe shrink-0 h-4 flex items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
                <div className="w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
              </div>
            </div>
          </div>
        ) : (
          /* Full Wide Responsive Desktop Layout */
          <div className="w-full max-w-6xl mx-auto h-full flex flex-col bg-white dark:bg-slate-900 md:rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              {children}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
