import React from 'react';
import { Home, LayoutGrid, Sparkles, Smartphone, Layers } from 'lucide-react';

export type MobileTab = 'top-10' | 'earn' | 'hero' | 'socials' | 'snake' | 'blank' | 'guestbook' | 'tab';

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
      } backdrop-blur-xl px-2 pt-1.5 pb-safe`}
    >
      <div className="flex items-center justify-between h-14 max-w-lg mx-auto w-full px-1">
        {/* LEFT WING: HOME & CATEGORIES (SPLITTING THE LEFT SIDE 50/50) */}
        <div className="flex-1 flex items-center justify-around h-full">
          {/* 1. HOME BUTTON (PICTURE OF HOME SCREEN) */}
          <button
            id="bottom-nav-tab-home"
            type="button"
            onClick={() => onSelectTab('hero')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all cursor-pointer relative py-1 ${
              currentTab === 'hero'
                ? 'text-emerald-400 font-bold'
                : isDarkTheme
                ? 'text-slate-400 hover:text-emerald-300 font-medium'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
            aria-label="Home"
          >
            <Home
              size={19}
              className={`transition-all duration-150 ${
                currentTab === 'hero'
                  ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] scale-105'
                  : 'opacity-85'
              }`}
            />
            <span className="text-[10px] sm:text-[11px] tracking-tight whitespace-nowrap leading-none font-bold">Home</span>
            {currentTab === 'hero' && (
              <span
                className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
              />
            )}
          </button>

          {/* 2. CATEGORIES BUTTON */}
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
              size={19}
              className={`transition-all duration-150 ${
                currentTab === 'earn'
                  ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] scale-105'
                  : 'opacity-85'
              }`}
            />
            <span className="text-[10px] sm:text-[11px] tracking-tight whitespace-nowrap leading-none font-bold">Categories</span>
            {currentTab === 'earn' && (
              <span
                className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
              />
            )}
          </button>
        </div>

        {/* 3. MIDDLE TAB: START HERE (KEPT EXACTLY IN THE MIDDLE) */}
        <div className="flex-shrink-0 flex items-center justify-center px-1 sm:px-2">
          <button
            id="bottom-nav-tab-start-here"
            type="button"
            onClick={() => onSelectTab('top-10')}
            className={`group relative flex items-center justify-center gap-1.5 sm:gap-2 w-[124px] sm:w-[150px] h-10 px-2 sm:px-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer select-none active:scale-95 ${
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
              size={14}
              className={`relative z-10 transition-transform duration-200 group-hover:rotate-12 ${
                currentTab === 'top-10'
                  ? 'text-[#00ff88] drop-shadow-[0_0_8px_rgba(0,255,136,1)]'
                  : 'text-[#34d399] drop-shadow-[0_0_6px_rgba(52,211,153,0.85)]'
              }`}
            />

            {/* Neon Text Label */}
            <span
              className={`relative z-10 font-black text-[11px] sm:text-[12px] tracking-wider uppercase whitespace-nowrap leading-none transition-all duration-200 ${
                currentTab === 'top-10'
                  ? 'text-white drop-shadow-[0_0_10px_rgba(0,255,136,1)]'
                  : 'text-emerald-100 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]'
              }`}
            >
              Start Here
            </span>
          </button>
        </div>

        {/* RIGHT WING: SOCIALS & TAB (SPLITTING THE RIGHT SIDE 50/50) */}
        <div className="flex-1 flex items-center justify-around h-full">
          {/* 4. SOCIALS BUTTON */}
          <button
            id="bottom-nav-tab-socials"
            type="button"
            onClick={() => onSelectTab('socials')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all cursor-pointer relative py-1 ${
              currentTab === 'socials'
                ? 'text-emerald-400 font-bold'
                : isDarkTheme
                ? 'text-slate-400 hover:text-emerald-300 font-medium'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
            aria-label="Socials"
          >
            <Smartphone
              size={19}
              className={`transition-all duration-150 ${
                currentTab === 'socials'
                  ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] scale-105'
                  : 'opacity-85'
              }`}
            />
            <span className="text-[10px] sm:text-[11px] tracking-tight whitespace-nowrap leading-none font-bold">Socials</span>
            {currentTab === 'socials' && (
              <span
                className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
              />
            )}
          </button>

          {/* 5. TAB (SPLIT THE DIFFERENCE ON THE RIGHT SIDE) */}
          <button
            id="bottom-nav-tab-custom"
            type="button"
            onClick={() => onSelectTab('tab')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all cursor-pointer relative py-1 ${
              currentTab === 'tab'
                ? 'text-emerald-400 font-bold'
                : isDarkTheme
                ? 'text-slate-400 hover:text-emerald-300 font-medium'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
            aria-label="Tab"
          >
            <Layers
              size={19}
              className={`transition-all duration-150 ${
                currentTab === 'tab'
                  ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] scale-105'
                  : 'opacity-85'
              }`}
            />
            <span className="text-[10px] sm:text-[11px] tracking-tight whitespace-nowrap leading-none font-bold">Tab</span>
            {currentTab === 'tab' && (
              <span
                className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
              />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
