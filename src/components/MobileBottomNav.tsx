import React from 'react';
import { Home, Trophy, Sparkles } from 'lucide-react';

export type MobileTab = 'home' | 'top-10' | 'earn';

interface MobileBottomNavProps {
  currentTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  savedCount?: number;
  isDarkTheme?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  isDarkTheme = true,
}) => {
  return (
    <nav
      id="mobile-bottom-nav"
      className={`fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl px-4 pt-1.5 pb-safe select-none transition-colors duration-300 ${
        isDarkTheme
          ? 'bg-[#12151e]/95 border-t border-[#242b3d] shadow-[0_-4px_25px_rgba(0,0,0,0.7)]'
          : 'bg-white/95 border-t border-purple-200/80 shadow-[0_-4px_20px_rgba(147,51,234,0.08)]'
      }`}
    >
      <div className="flex items-center justify-around h-14 max-w-md mx-auto">
        {/* 1. Home */}
        <button
          id="bottom-nav-tab-home"
          type="button"
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all cursor-pointer relative py-1 ${
            currentTab === 'home'
              ? isDarkTheme
                ? 'text-purple-400 font-black'
                : 'text-purple-700 font-black'
              : isDarkTheme
              ? 'text-slate-400 hover:text-slate-200 font-medium'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
          aria-label="Home"
        >
          <Home size={20} strokeWidth={currentTab === 'home' ? 2.5 : 2} />
          <span className="text-[11px] tracking-tight whitespace-nowrap leading-none">Home</span>
          {currentTab === 'home' && (
            <span
              className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                isDarkTheme ? 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]' : 'bg-purple-700'
              }`}
            />
          )}
        </button>

        {/* 2. Top 10 */}
        <button
          id="bottom-nav-tab-top10"
          type="button"
          onClick={() => onSelectTab('top-10')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all cursor-pointer relative py-1 ${
            currentTab === 'top-10'
              ? isDarkTheme
                ? 'text-amber-400 font-black'
                : 'text-amber-600 font-black'
              : isDarkTheme
              ? 'text-slate-400 hover:text-slate-200 font-medium'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
          aria-label="Top 10"
        >
          <Trophy size={20} strokeWidth={currentTab === 'top-10' ? 2.5 : 2} />
          <span className="text-[11px] tracking-tight whitespace-nowrap leading-none">Top 10</span>
          {currentTab === 'top-10' && (
            <span
              className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                isDarkTheme ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-amber-600'
              }`}
            />
          )}
        </button>

        {/* 3. Earn */}
        <button
          id="bottom-nav-tab-earn"
          type="button"
          onClick={() => onSelectTab('earn')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all cursor-pointer relative py-1 ${
            currentTab === 'earn'
              ? isDarkTheme
                ? 'text-emerald-400 font-black'
                : 'text-teal-700 font-black'
              : isDarkTheme
              ? 'text-slate-400 hover:text-slate-200 font-medium'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
          aria-label="Earn"
        >
          <Sparkles size={20} strokeWidth={currentTab === 'earn' ? 2.5 : 2} />
          <span className="text-[11px] tracking-tight whitespace-nowrap leading-none">Earn</span>
          {currentTab === 'earn' && (
            <span
              className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                isDarkTheme ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-teal-700'
              }`}
            />
          )}
        </button>
      </div>
    </nav>
  );
};
