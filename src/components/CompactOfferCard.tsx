import React, { useState } from 'react';
import { EnrichedOffer } from '../data/enrichedOffers';
import { initialsOf } from '../utils';

interface CompactOfferCardProps {
  offer: EnrichedOffer;
  isSaved?: boolean;
  onToggleSave?: (offerId: string) => void;
  onSelectOffer: (offer: EnrichedOffer) => void;
  className?: string;
}

export const CompactOfferCard: React.FC<CompactOfferCardProps> = ({
  offer,
  onSelectOffer,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  // Derive high-resolution logo source
  const rawLogoSrc =
    offer.logoUrl ||
    (offer.domain
      ? `https://www.google.com/s2/favicons?domain=${offer.domain}&sz=128`
      : undefined);

  const logoSrc = imgError ? undefined : rawLogoSrc;

  // Derive clean, single-line reward info
  const rewardInfo =
    offer.payoutTag ||
    offer.categoryDisplay ||
    (offer.code ? `Code: ${offer.code}` : 'Verified Offer');

  return (
    <div
      id={`offer-card-${offer.id}`}
      onClick={() => onSelectOffer(offer)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectOffer(offer);
        }
      }}
      className={`group relative flex flex-col justify-between w-[180px] sm:w-[190px] h-[240px] flex-shrink-0 select-none cursor-pointer rounded-2xl bg-[#0c1322] hover:bg-[#111c33] border border-slate-800/90 hover:border-teal-400/50 p-3 transition-all duration-200 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-teal-500/10 ${className}`}
    >
      {/* 1. LARGE LOGO - Uniform Dimensions & Container */}
      <div className="w-full h-[125px] rounded-xl bg-[#070b14] border border-slate-800/80 flex items-center justify-center p-3.5 overflow-hidden flex-shrink-0 group-hover:border-teal-500/30 transition-colors">
        {logoSrc ? (
          <img
            src={logoSrc}
            alt={offer.name}
            className="max-h-full max-w-full w-auto h-auto object-contain rounded-lg drop-shadow-md group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-2xl font-black text-teal-300 tracking-wider">
            {initialsOf(offer.name)}
          </span>
        )}
      </div>

      {/* 2. TEXT INFORMATION: Offer Name -> Reward/Value -> Reward Info */}
      <div className="flex flex-col items-center justify-center text-center w-full min-w-0 pt-2 pb-1">
        {/* Offer Name */}
        <h4 className="w-full truncate text-[13px] sm:text-sm font-bold text-white group-hover:text-teal-200 transition-colors leading-tight px-1">
          {offer.name}
        </h4>

        {/* Reward / Value */}
        <p className="w-full truncate text-sm sm:text-[15px] font-extrabold text-emerald-400 tracking-tight leading-tight mt-1 px-1">
          {offer.rewardDisplay}
        </p>

        {/* Reward information */}
        <p className="w-full truncate text-[11px] font-medium text-slate-400 mt-0.5 px-1">
          {rewardInfo}
        </p>
      </div>
    </div>
  );
};
