import React from 'react';
import { OhkneeLogo } from './OhkneeLogo';
import { ScammerMemeTab } from './ScammerMemeTab';
import { Flame, Zap, Coins, Gift, Gamepad2, Sparkles } from 'lucide-react';

export interface NavCategoryItem {
  id: string;
  title: string;
  badge?: string;
  icon: React.ReactNode;
}

export const TOP_NAV_CATEGORIES: NavCategoryItem[] = [
  {
    id: 'fast-easy',
    title: 'Fast Cash',
    badge: '$150',
    icon: <Zap size={15} className="text-amber-600" />,
  },
  {
    id: 'finance',
    title: 'Finance & Crypto',
    icon: <Coins size={15} className="text-teal-600" />,
  },
  {
    id: 'signup-trial',
    title: 'Sign Up Trials',
    icon: <Gift size={15} className="text-sky-600" />,
  },
  {
    id: 'sweepstakes',
    title: 'Sweepstakes',
    badge: 'Daily SC',
    icon: <Flame size={15} className="text-purple-600" />,
  },
  {
    id: 'puzzles',
    title: 'Puzzles & Spins',
    icon: <Gamepad2 size={15} className="text-indigo-600" />,
  },
  {
    id: 'play-to-earn',
    title: 'Play to Earn',
    icon: <Sparkles size={15} className="text-emerald-600" />,
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
      className="sticky top-0 z-40 w-full bg-white border-b border-purple-200/80 shadow-xs select-none"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top Tier: Logo (Left), Category Tabs (Center/Expanded), Scammer Meme Tab (Top-Right, Homepage only) */}
        <div className="h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* 1. Logo on Top Left (Clicking takes user Home) */}
          <div
            onClick={handleLogoClick}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group flex-shrink-0"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleLogoClick();
              }
            }}
          >
            <div className="flex items-center justify-center transition-transform group-hover:scale-105">
              <OhkneeLogo className="h-12 sm:h-16 w-auto object-contain" />
            </div>
            <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-purple-700 transition-colors">
              OHKNEE.COM
            </span>
          </div>

          {/* 2. Category Tabs Across Desktop Header (Desktop preserved) */}
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
                      ? 'bg-purple-100 text-purple-900 border border-purple-300 shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-purple-50/80 border border-transparent'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.title}</span>
                  {cat.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 font-extrabold">
                      {cat.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* 3. Top-Right Stationary Tab: The Scammer Meme/Animation (Away from edges) */}
          <div className="flex items-center gap-2 flex-shrink-0 mr-1 sm:mr-2">
            {isHomepage && (
              <div className="animate-in fade-in duration-200">
                <ScammerMemeTab onClick={onOpenScammerMeme} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

