import React, { useState } from 'react';
import heroBannerImg from '../assets/images/sunset_quest_hero_1788384094071.jpg';

interface HomepageHeroProps {
  onExploreClick?: () => void;
  onEarnClick?: () => void;
}

export const HomepageHero: React.FC<HomepageHeroProps> = ({ onExploreClick }) => {
  const [persona, setPersona] = useState<'boomer' | 'genz'>('boomer');

  return (
    <section
      id="homepage-hero-section"
      className="relative w-full min-h-full max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-5 flex flex-col items-center justify-between select-none animate-in fade-in duration-300"
    >
      {/* Subtle Warm Sunset Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] md:w-[600px] h-[200px] sm:h-[260px] bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Persona Toggle: Boomer / Gen Z - High Z-index & Touch-friendly */}
      <div className="relative z-30 flex flex-col items-center justify-center pt-1 pb-2">
        <div
          id="persona-toggle-container"
          role="tablist"
          aria-label="Audience Persona Switch"
          className="relative inline-flex items-center p-1 rounded-full bg-neutral-900/95 border border-amber-500/40 backdrop-blur-md shadow-xl shadow-black/60 select-none"
        >
          <button
            type="button"
            id="persona-toggle-boomer"
            role="tab"
            aria-selected={persona === 'boomer'}
            onClick={(e) => {
              e.stopPropagation();
              setPersona('boomer');
            }}
            className={`relative z-10 px-4 py-1.5 text-xs sm:text-sm font-black rounded-full transition-all duration-200 cursor-pointer touch-manipulation ${
              persona === 'boomer'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/40 scale-105'
                : 'text-slate-400 hover:text-slate-200 active:scale-95'
            }`}
          >
            Boomer
          </button>
          <button
            type="button"
            id="persona-toggle-genz"
            role="tab"
            aria-selected={persona === 'genz'}
            onClick={(e) => {
              e.stopPropagation();
              setPersona('genz');
            }}
            className={`relative z-10 px-4 py-1.5 text-xs sm:text-sm font-black rounded-full transition-all duration-200 cursor-pointer touch-manipulation ${
              persona === 'genz'
                ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/40 scale-105'
                : 'text-slate-400 hover:text-slate-200 active:scale-95'
            }`}
          >
            Gen Z
          </button>
        </div>
      </div>

      {/* TOP QUOTE SECTION - ABOVE PHOTO */}
      <div className="text-center max-w-2xl sm:max-w-3xl flex flex-col items-center px-2 sm:px-6 my-1 sm:my-2 min-h-[56px] sm:min-h-[70px] justify-center">
        {persona === 'boomer' ? (
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-amber-100/95 leading-snug drop-shadow-sm animate-in fade-in duration-200">
            "I got scammed a dozen times on{' '}
            <span className="font-['Reddit_Sans',sans-serif] font-black text-[#FF4500] tracking-normal drop-shadow-[0_0_12px_rgba(255,69,0,0.35)]">
              Reddit
            </span>{' '}
            and{' '}
            <span className="font-extrabold text-[#25D366] tracking-tight drop-shadow-[0_0_12px_rgba(37,211,102,0.35)]">
              WhatsApp
            </span>{' '}
            so that you don't have to."
          </p>
        ) : (
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-base sm:text-xl md:text-2xl font-medium tracking-tight text-amber-100/90 leading-snug drop-shadow-sm animate-in fade-in duration-200">
            "<strong className="font-black text-yellow-300">Gyatt damn chat</strong>,{' '}
            <strong className="font-black text-yellow-300">opp cooked me</strong> on{' '}
            <strong className="font-['Reddit_Sans',sans-serif] font-black text-[#FF4500] tracking-normal drop-shadow-[0_0_12px_rgba(255,69,0,0.35)]">
              Reddit
            </strong>{' '}
            doing <strong className="font-black text-yellow-300">side quests</strong> <strong className="font-black text-yellow-300">in Ohio</strong>,{' '}
            <strong className="font-black text-yellow-300">speed running</strong> for 6-7 hours <strong className="font-black text-yellow-300">down bad</strong> for a $5{' '}
            <strong className="font-black text-[#CC0000] tracking-tight drop-shadow-[0_0_10px_rgba(204,0,0,0.35)]">
              Target
            </strong>{' '}
            gift card.{' '}
            <strong className="font-black text-yellow-300">The math is not mathing</strong>."
          </p>
        )}
      </div>

      {/* HERO BANNER CARD - In the middle */}
      <div
        onClick={onExploreClick}
        className={`relative w-full max-w-2xl sm:max-w-3xl rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-500/30 bg-black shadow-2xl shadow-amber-950/20 group my-1.5 sm:my-2.5 flex-shrink-0 ${
          onExploreClick ? 'cursor-pointer active:scale-[0.99] transition-transform' : ''
        }`}
      >
        <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] max-h-[180px] sm:max-h-[230px] md:max-h-[260px] overflow-hidden bg-black flex items-center justify-center">
          <img
            src={heroBannerImg}
            alt="OHKNEE Quest - Verified cash rewards"
            className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
          />

          {/* Live Activity Badges */}
          <div className="hidden sm:flex flex-col gap-1.5 absolute top-3 right-3 max-w-[200px]">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-black/85 backdrop-blur-md border border-amber-400/40 text-[11px] text-white shadow-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-200">Sofi Plus</span>
              <span className="ml-auto font-black text-emerald-400">+$30</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-black/85 backdrop-blur-md border border-amber-400/40 text-[11px] text-white shadow-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span className="font-semibold text-slate-200">Kalshi</span>
              <span className="ml-auto font-black text-amber-400">+$25</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTIONS - Completely swaps between Boomer & Gen Z content */}
      <div className="text-center max-w-2xl sm:max-w-3xl flex flex-col items-center px-2 sm:px-6 my-1.5 sm:my-2">
        {persona === 'boomer' ? (
          /* BOOMER CONTENT */
          <div className="flex flex-col items-center gap-2 sm:gap-3 animate-in fade-in duration-200">
            <p className="font-['Outfit',sans-serif] text-base sm:text-xl md:text-2xl text-slate-200/95 font-medium leading-relaxed max-w-2xl sm:max-w-3xl tracking-wide">
              So when I'm lucky enough to make a few bucks for taking a selfie or completing a free trial, I add it to my list. These are my referrals with a brief description of how much I made and what's involved.
            </p>

            <div className="h-1 sm:h-2" aria-hidden="true" />

            <p className="font-['Outfit',sans-serif] text-base sm:text-xl md:text-2xl text-slate-100 font-bold leading-relaxed max-w-2xl sm:max-w-3xl tracking-wide flex items-center justify-center flex-wrap gap-x-1.5">
              <span>Most of these offers require KYC (identity verification). You will need a valid ID, a phone, live in the US, and</span>
              <span className="inline-flex tracking-wider font-black drop-shadow-[0_0_8px_rgba(255,255,255,0.25)] mx-1">
                <span className="text-[#ef4444]">A</span>
                <span className="text-[#ffffff]">m</span>
                <span className="text-[#3b82f6]">e</span>
                <span className="text-[#ef4444]">r</span>
                <span className="text-[#ffffff]">i</span>
                <span className="text-[#3b82f6]">c</span>
                <span className="text-[#ef4444]">a</span>
                <span className="text-[#ffffff]">n</span>
              </span>
              <span className="text-red-500 font-black tracking-wide drop-shadow-[0_0_12px_rgba(239,68,68,0.75)] mr-1">
                blood
              </span>
              <span>🇺🇸</span>
            </p>
          </div>
        ) : (
          /* GEN Z CONTENT - Replaces ALL Boomer text, spaced and styled cleanly */
          <div className="flex flex-col items-center gap-2 sm:gap-3 animate-in fade-in duration-200">
            <p className="font-['Outfit',sans-serif] text-base sm:text-xl md:text-2xl text-slate-200/90 font-normal leading-relaxed max-w-2xl sm:max-w-3xl tracking-wide">
              "<strong className="font-black text-yellow-300">Unc</strong>{' '}
              <strong className="font-black text-yellow-300">fleeced</strong> me for my{' '}
              <strong className="font-extrabold text-[#F1641E] tracking-tight drop-shadow-[0_0_10px_rgba(241,100,30,0.35)]">
                Etsy
              </strong>
              , my{' '}
              <strong className="font-extrabold text-[#FFE600] tracking-tight drop-shadow-[0_0_10px_rgba(255,230,0,0.35)]">
                Whatnot
              </strong>
              , and my{' '}
              <strong className="font-extrabold tracking-tight drop-shadow-[0_0_10px_rgba(230,0,35,0.35)]">
                <span className="text-[#E53238]">e</span>
                <span className="text-[#0064D2]">b</span>
                <span className="text-[#F5AF02]">a</span>
                <span className="text-[#86B817]">y</span>
              </strong>{' '}
              accounts on{' '}
              <strong className="font-extrabold text-[#25D366] tracking-tight drop-shadow-[0_0_10px_rgba(37,211,102,0.35)]">
                WhatsApp
              </strong>,{' '}
              <strong className="font-black text-yellow-300">ate and left no crumbs</strong>.{' '}
              <strong className="font-extrabold text-[#0079C1] tracking-tight drop-shadow-[0_0_10px_rgba(0,121,193,0.35)]">
                PayPal
              </strong>{' '}
              is <strong className="font-black text-yellow-300">in the trenches</strong> from refunded payments.{' '}
              <strong className="font-extrabold text-[#00D632] tracking-tight drop-shadow-[0_0_10px_rgba(0,214,50,0.35)]">
                Cash App
              </strong>{' '}
              <strong className="font-black text-yellow-300">IRL</strong> blocked me for being '<strong className="font-black text-yellow-300">sus</strong>'...
            </p>

            <div className="h-1 sm:h-2" aria-hidden="true" />

            <p className="font-['Outfit',sans-serif] text-base sm:text-xl md:text-2xl text-amber-100/90 font-normal leading-relaxed max-w-2xl sm:max-w-3xl tracking-wide drop-shadow-sm">
              "<strong className="font-black text-yellow-300">Womp womp</strong>. My <strong className="font-black text-yellow-300">negative aura</strong> can't be fixed, but my negative credit can. <strong className="font-black text-yellow-300">It's giving scam vibes</strong>, but <strong className="font-black text-yellow-300">trust</strong>. Use my links so we can <strong className="font-black text-yellow-300">live rent free</strong>, before I <strong className="font-black text-yellow-300">rage quit</strong> this <strong className="font-black text-yellow-300">lobby</strong>."
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
