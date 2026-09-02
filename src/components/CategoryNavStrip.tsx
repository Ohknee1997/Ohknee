import React from 'react';
import {
  Flame,
  Zap,
  Coins,
  Gift,
  Gamepad2,
  Sparkles,
  Layers,
} from 'lucide-react';

export interface CategoryTabItem {
  id: string;
  rowId: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

export const CATEGORY_NAV_TABS: CategoryTabItem[] = [
  {
    id: 'featured',
    rowId: 'row-featured',
    title: 'Featured',
    subtitle: 'Top Rewards',
    icon: <Flame size={22} className="stroke-[2.2]" />,
  },
  {
    id: 'fast-easy',
    rowId: 'row-fast-offers',
    title: 'Fast Cash',
    subtitle: '$100 - $150 Easy',
    icon: <Zap size={22} className="stroke-[2.2]" />,
  },
  {
    id: 'finance',
    rowId: 'row-finance',
    title: 'Finance & Crypto',
    subtitle: 'High Value Bonus',
    icon: <Coins size={22} className="stroke-[2.2]" />,
  },
  {
    id: 'signup-trial',
    rowId: 'row-signup',
    title: 'Sign Up Trials',
    subtitle: 'Instant Cashback',
    icon: <Gift size={22} className="stroke-[2.2]" />,
  },
  {
    id: 'puzzles',
    rowId: 'row-puzzles',
    title: 'Puzzles & Spins',
    subtitle: 'Free Daily SC',
    icon: <Gamepad2 size={22} className="stroke-[2.2]" />,
  },
  {
    id: 'sweepstakes',
    rowId: 'row-sweepstakes',
    title: 'Sweepstakes',
    subtitle: 'Free SC Daily',
    icon: <Coins size={22} className="stroke-[2.2]" />,
  },
  {
    id: 'play-to-earn',
    rowId: 'row-play-to-earn',
    title: 'Play to Earn',
    subtitle: 'Games & Tasks',
    icon: <Sparkles size={22} className="stroke-[2.2]" />,
  },
];

interface CategoryNavStripProps {
  activeCategory?: string;
  onSelectCategory: (tab: CategoryTabItem) => void;
}

export const CategoryNavStrip: React.FC<CategoryNavStripProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full mb-5">
      {/* Category Navigation Strip: Perfectly straight, organized row with identical tab dimensions */}
      <nav
        aria-label="Category Navigation"
        className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 px-0.5"
      >
        {CATEGORY_NAV_TABS.map((tab) => {
          const isActive = activeCategory === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectCategory(tab)}
              /* Every category tab has:
                 - The exact same overall height: h-[64px]
                 - The exact same width: w-[185px]
                 - The exact same padding: p-2.5
                 - The exact same internal spacing: gap-3
                 - The exact same alignment: flex items-center
              */
              className={`group relative flex items-center gap-3 w-[175px] sm:w-[190px] h-[64px] min-h-[64px] max-h-[64px] flex-shrink-0 rounded-2xl p-2.5 transition-all text-left cursor-pointer border select-none ${
                isActive
                  ? 'bg-slate-900/95 border-teal-400 shadow-md shadow-teal-500/10'
                  : 'bg-[#0a101d]/90 border-slate-800/90 hover:border-teal-500/40 hover:bg-slate-900/80 shadow-sm'
              }`}
            >
              {/* FIXED-SIZE ICON CONTAINER:
                  - Exact same icon container size: h-11 w-11
                  - Pinned at the exact same horizontal position relative to the tab (left)
                  - Significantly larger icons that are clearly visible and visually important
              */}
              <div
                className={`flex h-11 w-11 min-w-[44px] items-center justify-center rounded-xl transition-transform group-hover:scale-105 flex-shrink-0 ${
                  isActive
                    ? 'bg-teal-500/20 border border-teal-400/60 text-teal-300'
                    : 'bg-teal-500/10 border border-teal-500/25 text-teal-400'
                }`}
              >
                {tab.icon}
              </div>

              {/* ADAPTING TEXT AREA:
                  - Category names of different lengths adapt with truncate inside their area
                  - Length never alters the position of the icon container
              */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <span
                  className={`text-xs font-black uppercase tracking-tight truncate transition-colors ${
                    isActive ? 'text-teal-300' : 'text-slate-200 group-hover:text-white'
                  }`}
                >
                  {tab.title}
                </span>
                <span className="text-[10.5px] font-semibold text-slate-400 truncate mt-0.5">
                  {tab.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
