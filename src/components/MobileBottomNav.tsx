import React from 'react';
import { LayoutGrid, Sparkles } from 'lucide-react';
import { PixelSnakeLIcon } from './PixelSnakeLIcon';

export type MobileTab = 'top-10' | 'earn' | 'hero' | 'blank';

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
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        willChange: 'transform',
      }}
      className={`select-none transition-colors duration-300 ${
        isDarkTheme
          ? 'bg-black/95 border-t border-neutral-800/90 shadow-[0_-4px_25px_rgba(0,0,0,0.85)]'
          : 'bg-white/95 border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]'
      } backdrop-blur-xl px-3 pt-1.5 pb-safe`}
    >
      <div className="flex items-center justify-between h-14 max-w-md mx-auto">
        {/* 1. CATEGORIES (FAR LEFT) */}
        <button
          id="bottom-nav-tab-categories"
          type="button"
          onClick={() => onSelectTab('earn')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all cursor-pointer relative py-1 ${
            currentTab === 'earn'
              ? 'text-emerald-400 font-bold'
              : isDarkTheme
              ? 'text-slate-400 hover:text-emerald-300 font-medium'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
          aria-label="Categories"
        >
          <LayoutGrid
            size={20}
            className={`transition-all duration-150 ${
              currentTab === 'earn'
                ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] scale-105'
                : 'opacity-85'
            }`}
          />
          <span className="text-[11px] tracking-tight whitespace-nowrap leading-none font-bold">Categories</span>
          {currentTab === 'earn' && (
            <span
              className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
            />
          )}
        </button>

        {/* 2. START HERE (MIDDLE) - Prominent Rectangular Neon Box */}
        <div className="flex-[1.25] flex items-center justify-center px-1">
          <button
            id="bottom-nav-tab-start-here"
            type="button"
            onClick={() => onSelectTab('top-10')}
            className={`group relative flex items-center justify-center gap-2 w-full max-w-[155px] h-10 px-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer select-none active:scale-95 ${
              currentTab === 'top-10'
                ? 'border-[#00ff88] bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white shadow-[0_0_24px_rgba(0,255,136,0.7),inset_0_0_12px_rgba(0,255,136,0.35)] scale-105 ring-2 ring-[#00ff88]/50'
                : 'border-[#10b981] bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-emerald-950/90 text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.55),inset_0_0_10px_rgba(16,185,129,0.25)] hover:border-[#34d399] hover:shadow-[0_0_22px_rgba(52,211,153,0.75)]'
            }`}
            aria-label="Start Here"
          >
            {/* Pulsing ambient neon halo */}
            <span className="absolute -inset-0.5 rounded-xl bg-emerald-400/25 blur-sm pointer-events-none group-hover:bg-emerald-300/35 transition-all duration-300 animate-pulse" />

            {/* Sparkle icon */}
            <Sparkles
              size={15}
              className={`relative z-10 transition-transform duration-200 group-hover:rotate-12 ${
                currentTab === 'top-10'
                  ? 'text-[#00ff88] drop-shadow-[0_0_8px_rgba(0,255,136,1)]'
                  : 'text-[#34d399] drop-shadow-[0_0_6px_rgba(52,211,153,0.85)]'
              }`}
            />

            {/* Neon Text Label */}
            <span
              className={`relative z-10 font-black text-[12px] tracking-wider uppercase whitespace-nowrap leading-none transition-all duration-200 ${
                currentTab === 'top-10'
                  ? 'text-white drop-shadow-[0_0_10px_rgba(0,255,136,1)]'
                  : 'text-emerald-100 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]'
              }`}
            >
              Start Here
            </span>
          </button>
        </div>

        {/* 3. SKILL ISSUE (FAR RIGHT) */}
        <button
          id="bottom-nav-tab-skillissue"
          type="button"
          onClick={() => onSelectTab('blank')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all cursor-pointer relative py-1 ${
            currentTab === 'blank'
              ? 'text-emerald-400 font-bold'
              : isDarkTheme
              ? 'text-slate-400 hover:text-emerald-300 font-medium'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
          aria-label="Skill Issue"
        >
          <PixelSnakeLIcon size={21} isActive={currentTab === 'blank'} />
          <span className="text-[11px] tracking-tight whitespace-nowrap leading-none font-bold">skill issue</span>
          {currentTab === 'blank' && (
            <span
              className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
            />
          )}
        </button>
      </div>
    </nav>
  );
};
