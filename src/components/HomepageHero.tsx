import React from 'react';
import heroBannerImg from '../assets/images/sunset_quest_hero_1788384094071.jpg';

interface HomepageHeroProps {
  onExploreClick?: () => void;
}

export const HomepageHero: React.FC<HomepageHeroProps> = ({ onExploreClick }) => {
  return (
    <section
      id="homepage-hero-section"
      className="relative w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4 flex flex-col items-center justify-center select-none"
    >
      {/* Subtle Warm Sunset Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[300px] bg-gradient-to-tr from-purple-300/30 via-sky-300/30 to-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Clean Centered Hero Visual - High-Resolution Sunset Quest Artwork */}
      <div
        id="homepage-hero-banner-container"
        onClick={onExploreClick}
        className={`relative w-full max-w-3xl sm:max-w-4xl rounded-2xl sm:rounded-3xl overflow-hidden border border-purple-200/80 bg-white/90 shadow-xl shadow-purple-900/5 group ${
          onExploreClick ? 'cursor-pointer active:scale-[0.99] transition-transform' : ''
        }`}
      >
        {/* Glow corner accents */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Hero Banner Visual */}
        <div className="relative w-full aspect-[16/9] max-h-[220px] sm:max-h-[300px] md:max-h-[360px] lg:max-h-[400px] overflow-hidden bg-sky-50">
          <img
            id="homepage-hero-banner-image"
            src={heroBannerImg}
            alt="OHKNEE Fantasy Cash Quest - Knights in the center with suitors asking for Cash App on light blue background"
            className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out crisp-hd-image"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Rewards Message */}
      <div className="mt-4 sm:mt-6 text-center max-w-3xl flex flex-col items-center px-4">
        <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug drop-shadow-sm">
          Cashback, Giveaways, Commissions, Vouchers, Rewards, Bonuses, Referrals.
        </h1>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-white/90 italic font-medium">
          &quot;We don&apos;t use the F word cuz ain&apos;t shit in life free.&quot;
        </p>
      </div>
    </section>
  );
};
