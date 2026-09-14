import React from 'react';
import heroBannerImg from '../assets/images/sunset_quest_hero_1788384094071.jpg';

interface HomepageHeroProps {
  onExploreClick?: () => void;
  onEarnClick?: () => void;
}

export const HomepageHero: React.FC<HomepageHeroProps> = ({ onExploreClick }) => {
  return (
    <section
      id="homepage-hero-section"
      className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex flex-col items-center justify-center select-none animate-in fade-in duration-300"
    >
      {/* Subtle Warm Sunset Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[650px] h-[280px] bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Hero Banner Visual Card */}
      <div
        onClick={onExploreClick}
        className={`relative w-full max-w-3xl sm:max-w-4xl rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-500/30 bg-black shadow-2xl shadow-amber-950/20 group ${
          onExploreClick ? 'cursor-pointer active:scale-[0.99] transition-transform' : ''
        }`}
      >
        <div className="relative w-full aspect-[16/9] max-h-[260px] sm:max-h-[360px] md:max-h-[420px] overflow-hidden bg-black">
          <img
            src={heroBannerImg}
            alt="OHKNEE Quest - Verified cash rewards"
            className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
          />

          {/* Live Activity Badges */}
          <div className="hidden sm:flex flex-col gap-2 absolute top-4 right-4 max-w-[220px]">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-amber-400/40 text-[11px] text-white shadow-lg">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-200">Sofi Plus</span>
              <span className="ml-auto font-black text-emerald-400">+$30</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-amber-400/40 text-[11px] text-white shadow-lg">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="font-semibold text-slate-200">Kalshi</span>
              <span className="ml-auto font-black text-amber-400">+$25</span>
            </div>
          </div>
        </div>
      </div>

      {/* Underneath the photo description */}
      <div className="mt-8 sm:mt-10 text-center max-w-2xl sm:max-w-3xl flex flex-col items-center px-3 sm:px-6">
        {/* Main Quote with increased font size */}
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xl sm:text-3xl md:text-4xl lg:text-[38px] font-bold tracking-tight text-amber-100/95 leading-snug sm:leading-tight drop-shadow-sm">
          "I got scammed a dozen times on{' '}
          <span className="font-['Reddit_Sans',sans-serif] font-black text-[#FF4500] tracking-normal drop-shadow-[0_0_12px_rgba(255,69,0,0.35)]">
            Reddit
          </span>{' '}
          and{' '}
          <span className="font-extrabold text-[#25D366] tracking-tight drop-shadow-[0_0_12px_rgba(37,211,102,0.35)]">
            WhatsApp
          </span>{' '}
          so that you dont have to."
        </p>

        {/* Double-spaced drop down break */}
        <div className="h-6 sm:h-9 md:h-10" aria-hidden="true" />

        {/* Description with original clean Outfit font and ice-silver/slate color */}
        <p className="font-['Outfit',sans-serif] text-base sm:text-xl md:text-2xl text-slate-200/95 font-medium leading-relaxed max-w-2xl sm:max-w-3xl tracking-wide">
          So when I'm lucky enough to make a few bucks for taking a selfie or completing a free trial I add it to my list. These are my referrals with a brief description of how much I made and what's involved.
        </p>

        {/* Double-spaced drop down break */}
        <div className="h-6 sm:h-8 md:h-9" aria-hidden="true" />

        {/* Third Quote with alternating red-white-blue 'American' and solid red 'blood' */}
        <p className="font-['Outfit',sans-serif] text-base sm:text-xl md:text-2xl text-slate-200 font-bold leading-relaxed max-w-2xl sm:max-w-3xl tracking-wide">
          "You will need photo ID, phone number, and{' '}
          <span className="inline-flex tracking-wider font-black drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]">
            <span className="text-[#ef4444]">A</span>
            <span className="text-[#ffffff]">m</span>
            <span className="text-[#3b82f6]">e</span>
            <span className="text-[#ef4444]">r</span>
            <span className="text-[#ffffff]">i</span>
            <span className="text-[#3b82f6]">c</span>
            <span className="text-[#ef4444]">a</span>
            <span className="text-[#ffffff]">n</span>
          </span>{' '}
          <span className="text-red-500 font-black tracking-wide drop-shadow-[0_0_12px_rgba(239,68,68,0.75)]">
            blood
          </span>{' '}
          🇺🇸"
        </p>
      </div>
    </section>
  );
};
