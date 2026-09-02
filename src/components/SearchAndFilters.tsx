import React from 'react';
import {
  Search,
  X,
  Smartphone,
  Monitor,
  Apple,
  SlidersHorizontal,
  ArrowUpDown,
  Zap,
  Flame,
  Coins,
  Gift,
  Gamepad2,
  Sparkles,
} from 'lucide-react';

export type PlatformFilter = 'all' | 'apple' | 'android' | 'desktop';
export type CategoryFilter =
  | 'all'
  | 'fast-easy'
  | 'featured'
  | 'finance'
  | 'signup-trial'
  | 'puzzles'
  | 'sweepstakes'
  | 'play-to-earn';

export type SortOption = 'recommended' | 'payout-desc' | 'payout-asc' | 'alpha';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedPlatform: PlatformFilter;
  onPlatformChange: (plat: PlatformFilter) => void;
  selectedCategory: CategoryFilter;
  onCategoryChange: (cat: CategoryFilter) => void;
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalFilteredCount: number;
  totalCount: number;
  onResetFilters: () => void;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedPlatform,
  onPlatformChange,
  selectedCategory,
  onCategoryChange,
  selectedSort,
  onSortChange,
  totalFilteredCount,
  totalCount,
  onResetFilters,
}) => {
  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedPlatform !== 'all' ||
    selectedCategory !== 'all' ||
    selectedSort !== 'recommended';

  const categories: Array<{ id: CategoryFilter; label: string; icon: React.ReactNode }> = [
    { id: 'all', label: 'All Offers', icon: <Sparkles size={13} /> },
    { id: 'fast-easy', label: 'Fast Cash ($150+)', icon: <Zap size={13} /> },
    { id: 'featured', label: 'Featured', icon: <Flame size={13} /> },
    { id: 'sweepstakes', label: 'Sweepstakes', icon: <Coins size={13} /> },
    { id: 'finance', label: 'Finance & Crypto', icon: <Coins size={13} /> },
    { id: 'signup-trial', label: 'Sign Up Trials', icon: <Gift size={13} /> },
    { id: 'puzzles', label: 'Puzzles & Casual', icon: <Gamepad2 size={13} /> },
    { id: 'play-to-earn', label: 'Play to Earn', icon: <Gamepad2 size={13} /> },
  ];

  return (
    <div className="w-full mb-6 space-y-3">
      {/* Primary Search Bar & Platform Selector Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            id="offer-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search 60+ casinos, offers, games, promo codes, instant bonuses..."
            className="w-full rounded-xl bg-[#0f172a] border border-slate-700/80 pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 focus:outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-md transition-colors"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Platform Selector Chips */}
        <div className="flex items-center gap-1.5 rounded-xl bg-[#0f172a] border border-slate-700/80 p-1">
          <button
            type="button"
            onClick={() => onPlatformChange('all')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedPlatform === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All Platforms
          </button>
          <button
            type="button"
            onClick={() => onPlatformChange('apple')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedPlatform === 'apple'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Apple / iOS"
          >
            <Apple size={13} />
            <span className="hidden sm:inline">Apple</span>
          </button>
          <button
            type="button"
            onClick={() => onPlatformChange('android')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedPlatform === 'android'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Android"
          >
            <Smartphone size={13} />
            <span className="hidden sm:inline">Android</span>
          </button>
          <button
            type="button"
            onClick={() => onPlatformChange('desktop')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedPlatform === 'desktop'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Desktop / Web"
          >
            <Monitor size={13} />
            <span className="hidden sm:inline">Desktop</span>
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1.5 rounded-xl bg-[#0f172a] border border-slate-700/80 px-2.5 py-1 text-xs">
          <ArrowUpDown size={13} className="text-slate-400" />
          <select
            id="sort-select"
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer py-1.5 pr-2"
          >
            <option value="recommended" className="bg-slate-900 text-slate-200">
              Featured Order
            </option>
            <option value="payout-desc" className="bg-slate-900 text-slate-200">
              Highest Reward
            </option>
            <option value="alpha" className="bg-slate-900 text-slate-200">
              Name (A to Z)
            </option>
          </select>
        </div>
      </div>

      {/* Category Horizontal Tabs with exact same height, width, icon container, and alignment */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center gap-2.5 w-[160px] h-10 flex-shrink-0 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isActive
                  ? 'bg-slate-800 text-teal-300 border-teal-400 shadow-sm'
                  : 'bg-[#0f172a]/90 text-slate-300 border-slate-800/90 hover:bg-slate-800/80 hover:border-teal-500/40 hover:text-white'
              }`}
            >
              <div
                className={`flex h-6 w-6 min-w-[24px] items-center justify-center rounded-lg flex-shrink-0 ${
                  isActive
                    ? 'bg-teal-500/20 text-teal-300'
                    : 'bg-teal-500/10 text-teal-400'
                }`}
              >
                {cat.icon}
              </div>
              <span className="truncate flex-1 text-left">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Search & Filter Status (shown when filtering) */}
      {isFiltered && (
        <div className="flex items-center justify-between rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong>{totalFilteredCount}</strong> of <strong>{totalCount}</strong> offers
            </span>
            {searchQuery && (
              <span className="text-slate-300 font-mono text-[11px]">
                matching "{searchQuery}"
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-bold underline hover:text-white transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
