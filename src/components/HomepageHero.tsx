import React from 'react';
import heroBannerImg from '../assets/images/ohknee_hero_visual_1788379283460.jpg';
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, Sparkles, Clock, Coins } from 'lucide-react';

interface HomepageHeroProps {
  onExploreClick: () => void;
  onHowItWorksClick: () => void;
}

export const HomepageHero: React.FC<HomepageHeroProps> = ({
  onExploreClick,
  onHowItWorksClick,
}) => {
  return (
    <section
      id="homepage-hero-section"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-10 flex flex-col items-center select-none"
    >
      {/* Subtle Background Glow behind the Hero */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] bg-gradient-to-tr from-purple-900/20 via-teal-800/20 to-sky-800/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. LARGE CENTERED HERO VISUAL */}
      <div className="relative w-full max-w-4xl rounded-3xl overflow-hidden border border-slate-700/60 bg-[#090d18] shadow-2xl shadow-teal-500/5 group">
        {/* Glow corner accents */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Hero Banner Visual */}
        <div className="relative w-full aspect-[16/9] max-h-[460px] overflow-hidden bg-[#070b14]">
          <img
            src={heroBannerImg}
            alt="OHKNEE verified reward partners, games, and cash offers"
            className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
          />

          {/* Vignette Gradients for Seamless Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c15] via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080c15]/60 via-transparent to-[#080c15]/60 opacity-60" />

          {/* Floating Live Activity Pills */}
          <div className="hidden sm:flex flex-col gap-2 absolute top-4 right-4 max-w-[220px]">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-teal-500/30 text-[11px] text-slate-200 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-300">Sofi Plus</span>
              <span className="ml-auto font-black text-emerald-300">+$30</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/60 text-[11px] text-slate-200 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-teal-400" />
              <span className="font-semibold text-slate-300">Kalshi</span>
              <span className="ml-auto font-black text-teal-300">+$25</span>
            </div>
          </div>
        </div>

        {/* Verified Brand Network Strip directly framed below the visual */}
        <div className="w-full bg-[#0a101d]/95 border-t border-slate-800/80 px-4 py-3 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-slate-400 text-xs font-bold tracking-wider">
          <span className="text-[11px] uppercase tracking-widest text-slate-500 font-extrabold mr-1">
            VERIFIED VIA
          </span>
          <span className="hover:text-white transition-colors flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" /> PLAYSTATION
          </span>
          <span className="hover:text-white transition-colors flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" /> ROBLOX
          </span>
          <span className="hover:text-white transition-colors flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" /> STEAM
          </span>
          <span className="hover:text-white transition-colors flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" /> XBOX
          </span>
          <span className="hover:text-white transition-colors flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" /> AMAZON
          </span>
          <span className="hover:text-white transition-colors flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" /> BITCOIN
          </span>
        </div>
      </div>

      {/* 2. SHORT CATCHY EARNING / REWARDS MESSAGE */}
      <div className="mt-8 text-center max-w-3xl flex flex-col items-center">
        {/* Main Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
          Get rewarded for playing games, exploring apps, and completing quick surveys.
        </h1>

        {/* Supporting Trust Bullet Points */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-300">
          <span className="flex items-center gap-1.5 text-teal-300">
            <CheckCircle2 size={16} className="text-teal-400" />
            No Upfront Deposit
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-teal-300">
            <Zap size={16} className="text-amber-400" />
            Instant Bonus Activation
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-teal-300">
            <ShieldCheck size={16} className="text-emerald-400" />
            100% Free & Verified
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onExploreClick}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm tracking-tight shadow-xl shadow-teal-500/20 hover:shadow-teal-500/30 transition-all duration-200 cursor-pointer active:scale-95"
          >
            <span>Explore All Offers</span>
            <ArrowRight size={16} className="stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={onHowItWorksClick}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-sm border border-slate-700/80 hover:border-slate-600 transition-all duration-200 cursor-pointer"
          >
            <Sparkles size={16} className="text-teal-400" />
            <span>How It Works</span>
          </button>
        </div>

        {/* Quick Highlights Trio (like the reference layout) */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-3xl">
          <div className="p-4 rounded-2xl bg-[#0a101d]/90 border border-slate-800/90 text-center flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-black text-teal-300 flex items-center gap-1">
              <Coins size={20} className="text-teal-400" /> $150+
            </span>
            <span className="text-xs font-semibold text-slate-400 mt-1">
              Top single-day user cashout
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0a101d]/90 border border-slate-800/90 text-center flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-black text-white flex items-center gap-1">
              <Clock size={20} className="text-amber-400" /> &lt; 5 Mins
            </span>
            <span className="text-xs font-semibold text-slate-400 mt-1">
              Average time to first bonus
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0a101d]/90 border border-slate-800/90 text-center flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-black text-emerald-300 flex items-center gap-1">
              <ShieldCheck size={20} className="text-emerald-400" /> 100%
            </span>
            <span className="text-xs font-semibold text-slate-400 mt-1">
              Manually tested offer links
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
