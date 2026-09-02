import React from 'react';
import heroBannerImg from '../assets/images/sunset_quest_hero_1788384094071.jpg';

interface HomepageHeroProps {
  onExploreClick?: () => void;
  onHowItWorksClick?: () => void;
}

export const HomepageHero: React.FC<HomepageHeroProps> = ({ onExploreClick }) => {
  return (
    <section
      id="homepage-hero-section"
      className="relative w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4 flex flex-col items-center justify-center select-none"
    >
      {/* Subtle Warm Sunset Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[300px] bg-gradient-to-tr from-purple-300/30 via-sky-300/30 to-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Clean Centered Hero Visual - No TV bezel, no bottom strip */}
      <div
        onClick={onExploreClick}
        className={`relative w-full max-w-3xl sm:max-w-4xl rounded-2xl sm:rounded-3xl overflow-hidden border border-purple-200/80 bg-white/90 shadow-xl shadow-purple-900/5 group ${
          onExploreClick ? 'cursor-pointer active:scale-[0.99] transition-transform' : ''
        }`}
      >
        {/* Glow corner accents */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Hero Banner Visual without any TV box or bottom bar */}
        <div className="relative w-full aspect-[16/9] max-h-[220px] sm:max-h-[300px] md:max-h-[360px] lg:max-h-[400px] overflow-hidden bg-sky-50">
          <img
            src={heroBannerImg}
            alt="OHKNEE Fantasy Cash Quest - Knights in the center with suitors asking for Cash App on light blue background"
            className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
          />

          {/* Floating Live Activity Pills with Sunset Tint */}
          <div className="hidden sm:flex flex-col gap-2 absolute top-4 right-4 max-w-[220px]">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-purple-200/70 text-[11px] text-slate-800 shadow-md">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-700">Sofi Plus</span>
              <span className="ml-auto font-black text-emerald-700">+$30</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-sky-200/70 text-[11px] text-slate-800 shadow-md">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              <span className="font-semibold text-slate-700">Kalshi</span>
              <span className="ml-auto font-black text-sky-700">+$25</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Message */}
      <div className="mt-4 sm:mt-6 text-center max-w-3xl flex flex-col items-center px-4">
        <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
          Cashback, Giveaways, Commissions, Vouchers, Rewards, Bonuses, Referrals.
        </h1>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-700 italic font-medium">
          "We don't use the F word cuz ain't shit in life free."
        </p>
      </div>
    </section>
  );
};
