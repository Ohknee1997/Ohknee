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
        className="group relative flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600/90 via-teal-600/90 to-emerald-700/90 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-xs tracking-tight shadow-lg shadow-emerald-950/40 border border-emerald-400/40 hover:border-emerald-300 transition-all duration-200 active:scale-95 cursor-pointer"
        title="Click to view the scammer bait-and-switch cartoon"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-400/25 text-emerald-200 group-hover:scale-110 transition-transform">
          <DollarSign size={13} className="stroke-[3]" />
        </span>
        <span className="whitespace-nowrap font-black tracking-normal">
          Drop Your Cash App?
        </span>
        <span className="flex h-2 w-2 rounded-full bg-emerald-300 animate-ping ml-0.5" />
      </button>
    </div>
  );
};
