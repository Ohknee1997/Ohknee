import React from 'react';
import { Flame, Zap, Coins, Gamepad2 } from 'lucide-react';

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
    icon: <Flame size={20} className="stroke-[2.2]" />,
  },
  {
    id: 'fast-easy',
    rowId: 'row-fast-offers',
    title: 'Fast Cash',
    subtitle: '$100 - $150 Easy',
    icon: <Zap size={20} className="stroke-[2.2]" />,
  },
  {
    id: 'finance',
    rowId: 'row-finance',
    title: 'Finance & Crypto',
    subtitle: 'High Value Bonus',
    icon: <Coins size={20} className="stroke-[2.2]" />,
  },
  {
    id: 'games',
    rowId: 'row-play-to-earn',
    title: 'Games & Free SC',
    subtitle: 'Play & Sweepstakes',
    icon: <Gamepad2 size={20} className="stroke-[2.2]" />,
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
    <div className="w-full mb-4 sm:mb-5">
      {/* 4 Categorized Tabs at Top - Responsive 2x2 grid on mobile, 4 in a row on tablet/desktop */}
      <nav
        aria-label="Category Navigation"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 py-1 px-0.5"
      >
        {CATEGORY_NAV_TABS.map((tab) => {
          const isActive = activeCategory === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectCategory(tab)}
              className={`group relative flex items-center gap-2.5 sm:gap-3 w-full h-[62px] sm:h-[68px] rounded-2xl p-2 sm:p-2.5 transition-all text-left cursor-pointer border select-none ${
                isActive
                  ? 'bg-white border-purple-500 shadow-md shadow-purple-500/10 ring-2 ring-purple-400/30'
                  : 'bg-white/85 hover:bg-white border-purple-100/90 hover:border-purple-300 shadow-xs'
              }`}
            >
              {/* Category Icon */}
              <div
                className={`flex h-10 w-10 sm:h-11 sm:w-11 min-w-[40px] items-center justify-center rounded-xl transition-transform group-hover:scale-105 flex-shrink-0 ${
                  isActive
                    ? 'bg-purple-100 border border-purple-300 text-purple-800'
                    : 'bg-purple-50/80 border border-purple-100 text-purple-600 group-hover:bg-purple-100/70'
                }`}
              >
                {tab.icon}
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <span
                  className={`text-xs sm:text-[13px] font-black uppercase tracking-tight truncate transition-colors ${
                    isActive ? 'text-purple-900' : 'text-slate-800 group-hover:text-purple-900'
                  }`}
                >
                  {tab.title}
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 truncate mt-0.5">
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

