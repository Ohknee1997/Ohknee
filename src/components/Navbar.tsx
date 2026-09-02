import React from 'react';
import { OhkneeLogo } from './OhkneeLogo';
import { ScammerMemeTab } from './ScammerMemeTab';
import { Flame, Zap, Coins, Gift, Gamepad2, Sparkles, Home, Trophy, Landmark, TrendingUp } from 'lucide-react';

export interface NavCategoryItem {
  id: string;
  title: string;
  badge?: string;
  icon: React.ReactNode;
}

export const TOP_NAV_CATEGORIES: NavCategoryItem[] = [
  {
    id: 'all',
    title: 'Home',
    icon: <Home size={15} />,
  },
  {
    id: 'fast-easy',
    title: 'Fast Cash',
    badge: '$150',
    icon: <Zap size={15} className="text-amber-400" />,
  },
  {
    id: 'finance',
    title: 'Finance & Crypto',
    icon: <Coins size={15} className="text-teal-400" />,
  },
  {
    id: 'signup-trial',
    title: 'Sign Up Trials',
    icon: <Gift size={15} className="text-sky-400" />,
  },
  {
    id: 'sweepstakes',
    title: 'Sweepstakes',
    badge: 'Daily SC',
    icon: <Flame size={15} className="text-orange-400" />,
  },
  {
    id: 'puzzles',
    title: 'Puzzles & Spins',
    icon: <Gamepad2 size={15} className="text-indigo-400" />,
  },
  {
    id: 'play-to-earn',
    title: 'Play to Earn',
    icon: <Sparkles size={15} className="text-emerald-400" />,
  },
];

export const MOBILE_TOP_CATEGORIES: NavCategoryItem[] = [
  {
    id: 'featured',
    title: 'Featured Offers',
    icon: <Sparkles size={14} className="text-purple-400" />,
  },
  {
    id: 'bonuses-promos',
    title: 'Bonuses & Promos',
    icon: <Flame size={14} className="text-orange-400" />,
  },
  {
    id: 'sports-betting',
    title: 'Sports Betting',
    icon: <Trophy size={14} className="text-sky-400" />,
  },
  {
    id: 'banking',
    title: 'Banking',
    icon: <Landmark size={14} className="text-teal-400" />,
  },
  {
    id: 'crypto',
    title: 'Crypto',
    icon: <Coins size={14} className="text-yellow-400" />,
  },
  {
    id: 'finance',
    title: 'Finance',
    icon: <TrendingUp size={14} className="text-emerald-400" />,
  },
];

interface NavbarProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  isHomepage: boolean;
  onOpenScammerMeme: () => void;
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCategory,
  onSelectCategory,
  isHomepage,
  onOpenScammerMeme,
  onGoHome,
}) => {
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onGoHome) {
      onGoHome();
    } else {
      onSelectCategory('all');
    }
  };

  return (
    <header
      id="main-brand-header"
      className="sticky top-0 z-40 w-full bg-[#080c15]/95 backdrop-blur-xl border-b border-slate-800/80 shadow-md select-none"
      style={{ borderTop: 'none' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tier: Logo (Left), Category Tabs (Center/Expanded), Scammer Meme Tab (Top-Right, Homepage only) */}
        <div className="h-16 flex items-center justify-between gap-4">
          {/* 1. OHKNEE.COM Logo on Top Left (Clicking takes user Home) */}
          <div
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleLogoClick();
              }
            }}
          >
            {/* Loot logo icon (styled white on mobile, crisp on desktop) */}
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-slate-900/90 border border-slate-700/80 p-1 flex items-center justify-center group-hover:border-purple-400/60 shadow-md transition-colors">
              <OhkneeLogo className="h-full w-full object-contain brightness-0 invert" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-purple-300 transition-colors">
              OHKNEE.COM
            </span>
          </div>

          {/* 2. Category Tabs Across Desktop Header (Desktop preserved exactly) */}
          <nav
            aria-label="Category Navigation"
            className="hidden lg:flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1"
          >
            {TOP_NAV_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border border-transparent'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.title}</span>
                  {cat.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-extrabold">
                      {cat.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* 3. Top-Right Stationary Tab: The Scammer Meme/Animation (ONLY on Homepage) */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {isHomepage && (
              <div className="animate-in fade-in duration-200">
                <ScammerMemeTab onClick={onOpenScammerMeme} />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Category Tabs Strip (No Home button, exactly the 6 requested categories) */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/60">
          {MOBILE_TOP_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  isActive
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-slate-800/80'
                }`}
              >
                {cat.icon}
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
