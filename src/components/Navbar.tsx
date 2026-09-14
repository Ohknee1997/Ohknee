import React from 'react';
import { OhkneeLogo } from './OhkneeLogo';
import { BarChart2 } from 'lucide-react';
import { PixelSnakeLIcon } from './PixelSnakeLIcon';

interface NavbarProps {
  onGoHome?: () => void;
  isSticky?: boolean;
  onOpenAnalytics?: () => void;
  onSelectSnake?: () => void;
  isSnakeActive?: boolean;
  onSelectGuestbook?: () => void;
  isGuestbookActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoHome,
  isSticky = true,
  onOpenAnalytics,
  onSelectSnake,
  isSnakeActive = false,
  onSelectGuestbook,
  isGuestbookActive = false,
}) => {
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onGoHome) {
      onGoHome();
    }
  };

  return (
    <header
      id="main-brand-header"
      className={`${
        isSticky ? 'sticky top-0' : 'relative md:sticky md:top-0'
      } z-20 w-full bg-black border-b border-neutral-800/80 shadow-lg select-none`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Logo on Top Left */}
          <div
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group flex-shrink-0"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleLogoClick();
              }
            }}
          >
            <div className="flex items-center justify-center transition-transform group-hover:scale-105">
              <OhkneeLogo className="h-11 sm:h-14 w-auto object-contain" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              OHKNEE.COM
            </span>
          </div>

          {/* Top Right Controls: Website Statistics + Transparent Cut-out Snake Tab */}
          <div className="flex items-center gap-3">
            {/* Website Statistics Button on Top Right (Visible ONLY on desktop) */}
            {onOpenAnalytics && (
              <div className="hidden md:flex items-center">
                <button
                  type="button"
                  id="desktop-website-statistics-btn"
                  onClick={onOpenAnalytics}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-emerald-500/60 text-zinc-200 hover:text-white transition-all shadow-md group cursor-pointer"
                  title="Website Statistics & Traffic Analytics"
                  aria-label="Website Statistics"
                >
                  <div className="relative flex items-center justify-center">
                    <BarChart2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  </div>
                  <span className="text-xs font-bold tracking-wide text-zinc-200 group-hover:text-emerald-300 font-mono uppercase">
                    Website Statistics
                  </span>
                </button>
              </div>
            )}

            {/* Tiny Notebook / Guestbook Button 📝 About an Inch to the Left of Snake */}
            {onSelectGuestbook && (
              <button
                type="button"
                id="top-right-notebook-guestbook-btn"
                onClick={onSelectGuestbook}
                className={`p-1 sm:p-1.5 mr-10 sm:mr-14 bg-transparent hover:bg-neutral-800/60 rounded-md border-0 outline-none cursor-pointer flex items-center justify-center hover:scale-125 active:scale-90 transition-all duration-150 focus:outline-none ${
                  isGuestbookActive
                    ? 'scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)] brightness-125'
                    : 'opacity-90 hover:opacity-100'
                }`}
                title="Founding Register Guestbook (First 1,000 Visitors)"
                aria-label="Founding Register Guestbook"
              >
                <span className="text-base sm:text-lg leading-none select-none">📝</span>
              </button>
            )}

            {/* Cut-out Transparent Snake Tab (Top Right Corner) */}
            {onSelectSnake && (
              <button
                type="button"
                id="top-right-snake-icon-tab"
                onClick={onSelectSnake}
                className="p-1 sm:p-1.5 bg-transparent border-0 outline-none cursor-pointer flex items-center justify-center hover:scale-125 active:scale-90 transition-transform duration-150 focus:outline-none"
                title="Snake Game"
                aria-label="Snake Game"
              >
                <PixelSnakeLIcon size={26} isActive={isSnakeActive} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
