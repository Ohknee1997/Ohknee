import React from 'react';
import { Home, Trophy, Sparkles } from 'lucide-react';

export type MobileTab = 'home' | 'top-10' | 'earn';

interface MobileBottomNavProps {
  currentTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  savedCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
}) => {
  return (
    <nav
      id="mobile-bottom-nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 border-t border-purple-200/80 backdrop-blur-xl px-4 pt-1.5 pb-safe shadow-[0_-4px_20px_rgba(147,51,234,0.08)] select-none"
    >
      <div className="flex items-center justify-around h-14 max-w-md mx-auto">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all cursor-pointer ${
            currentTab === 'home'
              ? 'text-purple-700 font-black scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Home"
        >
          <Home size={20} strokeWidth={currentTab === 'home' ? 2.5 : 2} />
          <span className="text-[11px] font-bold tracking-tight">Home</span>
        </button>

        {/* 2. Top 10 */}
        <button
          type="button"
          onClick={() => onSelectTab('top-10')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all cursor-pointer ${
            currentTab === 'top-10'
              ? 'text-amber-600 font-black scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Top 10"
        >
          <Trophy size={20} strokeWidth={currentTab === 'top-10' ? 2.5 : 2} />
          <span className="text-[11px] font-bold tracking-tight">Top 10</span>
        </button>

        {/* 3. Earn */}
        <button
          type="button"
          onClick={() => onSelectTab('earn')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all cursor-pointer ${
            currentTab === 'earn'
              ? 'text-teal-700 font-black scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Earn"
        >
          <Sparkles size={20} strokeWidth={currentTab === 'earn' ? 2.5 : 2} />
          <span className="text-[11px] font-bold tracking-tight">Earn</span>
        </button>
      </div>
    </nav>
  );
};

