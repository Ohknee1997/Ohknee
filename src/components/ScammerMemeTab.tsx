import React from 'react';
import { DollarSign, Flame } from 'lucide-react';

interface ScammerMemeTabProps {
  onClick: () => void;
}

export const ScammerMemeTab: React.FC<ScammerMemeTabProps> = ({ onClick }) => {
  return (
    <div
      id="scammer-meme-homepage-tab"
      className="inline-flex items-center"
    >
      <button
        type="button"
        onClick={onClick}
        className="group relative flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-600/90 via-teal-600/90 to-emerald-700/90 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-[10.5px] sm:text-xs tracking-tight shadow-md shadow-emerald-950/40 border border-emerald-400/40 hover:border-emerald-300 transition-all duration-200 active:scale-95 cursor-pointer"
        title="Click to view the scammer bait-and-switch cartoon"
      >
        <span className="flex h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 items-center justify-center rounded-md bg-emerald-400/25 text-emerald-200 group-hover:scale-110 transition-transform">
          <DollarSign size={10} className="sm:w-3 sm:h-3 stroke-[3]" />
        </span>
        <span className="whitespace-nowrap font-black tracking-normal">
          <span className="hidden sm:inline">Drop Your </span>
          <span className="sm:hidden">Drop </span>
          Cash App
          <span className="hidden sm:inline">?</span>
        </span>
        <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-300 animate-ping ml-0.5" />
      </button>
    </div>
  );
};
