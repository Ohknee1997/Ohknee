import React from 'react';
import { OhkneeLogo } from './OhkneeLogo';
import { BarChart2 } from 'lucide-react';

interface NavbarProps {
  onGoHome?: () => void;
  isSticky?: boolean;
  onOpenAnalytics?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoHome,
  isSticky = true,
  onOpenAnalytics,
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
        </div>
      </div>
    </header>
  );
};
