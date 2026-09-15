import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { HomepageReviewsSplitCard } from './HomepageReviewsSplitCard';

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

      {/* REVIEWS SPLIT BOX - EXACT SAME SIZE AS HERO BANNER PHOTO, CUT DOWN THE MIDDLE */}
      <HomepageReviewsSplitCard onExploreClick={onExploreClick} />

      {/* PROMINENT START HERE ACTION BUTTON */}
      {onExploreClick && (
        <div className="my-2 sm:my-3.5 flex items-center justify-center z-10">
          <button
            type="button"
            id="homepage-hero-start-here-btn"
            onClick={onExploreClick}
            className="group relative flex items-center justify-center gap-2 sm:gap-2.5 px-6 sm:px-9 py-2.5 sm:py-3 rounded-2xl start-here-glowing-red text-white cursor-pointer select-none active:scale-95 transition-all shadow-xl hover:scale-105"
            aria-label="Start Here - Top 10 Verified Offers"
          >
            {/* Ambient glowing red halo */}
            <span className="absolute -inset-1 rounded-2xl bg-red-600/40 blur-md pointer-events-none start-here-red-halo" />

            <Sparkles
              size={18}
              className="relative z-10 text-red-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse"
            />

            <span className="relative z-10 font-black text-sm sm:text-base tracking-wider uppercase whitespace-nowrap leading-none drop-shadow-[0_0_12px_rgba(239,68,68,1)]">
              Start Here
            </span>

            <span className="relative z-10 text-[10px] sm:text-xs font-bold text-red-100 bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-400/50 ml-1">
              Top 10 Fast Cash
            </span>
          </button>
        </div>
      )}

      {/* BOTTOM SECTIONS - Completely swaps between Boomer & Gen Z content */}
      <div className="text-center w-full max-w-2xl sm:max-w-3xl flex flex-col items-center px-3 sm:px-6 my-2 sm:my-3">
        {persona === 'boomer' ? (
          /* BOOMER CONTENT */
          <div className="flex flex-col items-center gap-2.5 sm:gap-3.5 w-full animate-in fade-in duration-200">
            <p className="font-['Outfit',sans-serif] text-base sm:text-xl md:text-2xl text-slate-100 font-semibold leading-relaxed sm:leading-loose tracking-wide text-center drop-shadow-sm">
              When I'm lucky to make a few bucks for taking a selfie or completing a free trial I add it to my list.
            </p>

            <p className="font-['Outfit',sans-serif] text-sm sm:text-lg md:text-xl text-amber-200/95 font-bold leading-relaxed sm:leading-relaxed tracking-wide text-center drop-shadow-sm">
              Most of these offers require KYC (identity verification). You will need a valid ID, a phone, and live in the US.
            </p>
          </div>
        ) : (
          /* GEN Z CONTENT - Replaces ALL Boomer text, spaced and styled cleanly */
          <div className="flex flex-col items-center gap-2.5 sm:gap-3.5 w-full animate-in fade-in duration-200">
            <p className="font-['Outfit',sans-serif] text-base sm:text-xl md:text-2xl text-slate-100 font-normal leading-relaxed tracking-wide text-center">
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

            <p className="font-['Outfit',sans-serif] text-base sm:text-xl md:text-2xl text-amber-100 font-normal leading-relaxed tracking-wide text-center drop-shadow-sm">
              "<strong className="font-black text-yellow-300">Womp womp</strong>. My <strong className="font-black text-yellow-300">negative aura</strong> can't be fixed, but my negative credit can. <strong className="font-black text-yellow-300">It's giving scam vibes</strong>, but <strong className="font-black text-yellow-300">trust</strong>. Use my links so we can <strong className="font-black text-yellow-300">live rent free</strong>, before I <strong className="font-black text-yellow-300">rage quit</strong> this <strong className="font-black text-yellow-300">lobby</strong>."
            </p>
          </div>
        )}
      </div>

      {/* STAKE CODE BANNER - PLACED BELOW THE THIRD PARAGRAPH JUST ABOVE BOTTOM TABS */}
      <div className="w-full max-w-xl px-3 flex flex-col gap-1 mt-1 sm:mt-2 mb-1 z-10">
        <a
          href="https://stake.us/?c=20ae01b862"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-950/90 via-neutral-900/95 to-emerald-950/90 border border-emerald-500/40 text-[11px] sm:text-xs text-emerald-200 shadow-lg active:scale-95 hover:border-emerald-400 transition-all group"
        >
          <span className="flex items-center gap-1.5 font-medium truncate">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <strong className="text-white font-bold">Stake.us:</strong>
            <span className="text-slate-300">Instant $25 Free Cash (Code</span>
            <code className="text-emerald-300 font-mono font-bold bg-black/50 px-1 py-0.5 rounded border border-emerald-500/30">20ae01b862</code>
            <span className="text-slate-300">)</span>
          </span>
          <span className="ml-2 font-black text-emerald-400 text-[10px] uppercase tracking-wider shrink-0 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-400/30 group-hover:bg-emerald-500/30 transition-colors">
            Claim $25 ↗
          </span>
        </a>
      </div>
    </section>
  );
};
