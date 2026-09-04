import React from 'react';
import heroBannerImg from '../assets/images/sunset_quest_hero_1788384094071.jpg';
import { ArrowRight, Trophy } from 'lucide-react';

interface HomepageHeroProps {
  onExploreClick?: () => void;
  onEarnClick?: () => void;
}

export const HomepageHero: React.FC<HomepageHeroProps> = ({ onExploreClick, onEarnClick }) => {
  return (
    <section
      id="homepage-hero-section"
      className="relative w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 flex flex-col items-center justify-center select-none animate-in fade-in duration-300"
    >
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[700px] h-[300px] bg-gradient-to-tr from-purple-600/20 via-indigo-500/15 to-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Banner Visual Card */}
      <div
        onClick={onExploreClick}
        className={`relative w-full max-w-3xl sm:max-w-4xl rounded-2xl sm:rounded-3xl overflow-hidden border border-purple-500/30 bg-[#131622] shadow-2xl shadow-purple-950/50 group ${
          onExploreClick ? 'cursor-pointer active:scale-[0.99] transition-transform' : ''
        }`}
      >
        <div className="relative w-full aspect-[16/9] max-h-[260px] sm:max-h-[360px] md:max-h-[420px] overflow-hidden bg-slate-900">
          <img
            src={heroBannerImg}
            alt="OHKNEE Quest - Verified cash rewards"
            className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
          />

          {/* Live Activity Badges */}
          <div className="hidden sm:flex flex-col gap-2 absolute top-4 right-4 max-w-[220px]">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-purple-400/40 text-[11px] text-white shadow-lg">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-200">Sofi Plus</span>
              <span className="ml-auto font-black text-emerald-400">+$30</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-sky-400/40 text-[11px] text-white shadow-lg">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              <span className="font-semibold text-slate-200">Kalshi</span>
              <span className="ml-auto font-black text-sky-400">+$25</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Message at the bottom of the picture */}
      <div className="mt-5 sm:mt-7 text-center max-w-3xl flex flex-col items-center px-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
          Cashback, Giveaways, Commissions, Vouchers, Rewards, Bonuses, Referrals.
        </h1>
        <p className="mt-3 text-sm sm:text-base md:text-lg text-purple-200/90 italic font-medium">
          "We don't use the F word cuz ain't shit in life free."
        </p>

        {/* Quick action buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onExploreClick}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-950/50 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Trophy size={16} className="text-emerald-200" />
            <span>Explore Top 10</span>
            <ArrowRight size={15} className="text-emerald-200" />
          </button>
          {onEarnClick && (
            <button
              type="button"
              onClick={onEarnClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a2030] hover:bg-[#232b40] border border-[#2a344d] text-slate-200 hover:text-white font-bold text-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>View All Offers</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
