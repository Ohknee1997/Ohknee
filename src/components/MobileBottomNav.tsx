import React from 'react';
import { Home, Trophy, Sparkles, Wallet, User } from 'lucide-react';

export type MobileTab = 'home' | 'top-10' | 'earn' | 'cash-out' | 'profile';

interface MobileBottomNavProps {
  currentTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
}) => {
  return (
    <nav
      id="mobile-bottom-nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#080c16]/95 border-t border-slate-800/90 backdrop-blur-xl px-2 pt-1 pb-safe shadow-2xl select-none"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-full transition-all cursor-pointer ${
            currentTab === 'home'
              ? 'text-purple-400 font-black scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Home"
        >
          <Home size={20} strokeWidth={currentTab === 'home' ? 2.5 : 2} />
          <span className="text-[10px] font-bold tracking-tight">Home</span>
        </button>

        {/* 2. Top 10 */}
        <button
          type="button"
          onClick={() => onSelectTab('top-10')}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-full transition-all cursor-pointer ${
            currentTab === 'top-10'
              ? 'text-purple-400 font-black scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Top 10"
        >
          <Trophy size={20} strokeWidth={currentTab === 'top-10' ? 2.5 : 2} />
          <span className="text-[10px] font-bold tracking-tight">Top 10</span>
        </button>

        {/* 3. Earn (Visually prominent main action in the center) */}
        <div className="relative -top-3 flex flex-col items-center">
          <button
            type="button"
            onClick={() => onSelectTab('earn')}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 text-white shadow-lg shadow-purple-600/40 border-2 border-purple-300/40 active:scale-95 transition-all cursor-pointer ${
              currentTab === 'earn'
                ? 'ring-4 ring-purple-500/30 scale-105'
                : 'hover:brightness-110'
            }`}
            aria-label="Earn"
          >
            <Sparkles size={24} className="animate-pulse" />
          </button>
          <span
            className={`text-[10px] font-black tracking-tight mt-1 ${
              currentTab === 'earn' ? 'text-purple-300' : 'text-slate-300'
            }`}
          >
            Earn
          </span>
        </div>

        {/* 4. Cash Out */}
        <button
          type="button"
          onClick={() => onSelectTab('cash-out')}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-full transition-all cursor-pointer ${
            currentTab === 'cash-out'
              ? 'text-purple-400 font-black scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Cash Out"
        >
          <Wallet size={20} strokeWidth={currentTab === 'cash-out' ? 2.5 : 2} />
          <span className="text-[10px] font-bold tracking-tight">Cash Out</span>
        </button>

        {/* 5. Profile */}
        <button
          type="button"
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-full transition-all cursor-pointer ${
            currentTab === 'profile'
              ? 'text-purple-400 font-black scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Profile"
        >
          <User size={20} strokeWidth={currentTab === 'profile' ? 2.5 : 2} />
          <span className="text-[10px] font-bold tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
};
