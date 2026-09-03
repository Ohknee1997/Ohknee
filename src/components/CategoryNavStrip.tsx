import React from 'react';
import { Flame, Zap, Coins, Star } from 'lucide-react';

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
    id: 'fast-offers',
    rowId: 'row-fast-offers',
    title: 'Fast Offers',
    subtitle: '$100 - $150 Easy',
    icon: <Zap size={20} className="stroke-[2.2]" />,
  },
  {
    id: 'finance',
    rowId: 'row-finance',
    title: 'Finance',
    subtitle: 'Banking & Crypto',
    icon: <Coins size={20} className="stroke-[2.2]" />,
  },
  {
    id: 'sweepstakes',
    rowId: 'row-sweepstakes',
    title: 'Sweepstake',
    subtitle: 'Daily Free SC',
    icon: <Star size={20} className="stroke-[2.2]" />,
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
                  ? 'bg-[#1a2030] border-purple-500 shadow-md shadow-purple-900/30 ring-2 ring-purple-500/30'
                  : 'bg-[#131722] hover:bg-[#181d2b] border-[#242b3d] hover:border-purple-500/50 shadow-sm'
              }`}
            >
              {/* Category Icon */}
              <div
                className={`flex h-10 w-10 sm:h-11 sm:w-11 min-w-[40px] items-center justify-center rounded-xl transition-transform group-hover:scale-105 flex-shrink-0 ${
                  isActive
                    ? 'bg-purple-600/30 border border-purple-400 text-purple-300'
                    : 'bg-[#1c2233] border border-slate-800 text-purple-400 group-hover:bg-purple-950/50'
                }`}
              >
                {tab.icon}
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <span
                  className={`text-xs sm:text-[13px] font-black uppercase tracking-tight truncate transition-colors ${
                    isActive ? 'text-purple-300' : 'text-white group-hover:text-purple-300'
                  }`}
                >
                  {tab.title}
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 truncate mt-0.5">
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
