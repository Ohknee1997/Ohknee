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
      className={`group relative flex flex-col justify-between w-full h-[220px] sm:h-[240px] select-none cursor-pointer rounded-2xl bg-[#131722] hover:bg-[#181d2b] border border-[#242b3d] hover:border-purple-500/60 p-2.5 sm:p-3 transition-all duration-200 hover:-translate-y-1 shadow-md hover:shadow-purple-900/20 ${className}`}
    >
      {/* 1. LOGO - Dark Container matching Master Theme */}
      <div className="w-full h-[115px] sm:h-[125px] rounded-xl bg-[#0e111a] border border-[#242b3d] flex items-center justify-center p-2.5 sm:p-3.5 overflow-hidden flex-shrink-0 group-hover:border-purple-500/50 transition-colors">
        {logoSrc ? (
          <img
            src={logoSrc}
            alt={offer.name}
            className="max-h-full max-w-full w-auto h-auto object-contain rounded-md drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-xl sm:text-2xl font-black text-purple-400 tracking-wider">
            {initialsOf(offer.name)}
          </span>
        )}
      </div>

      {/* 2. TEXT INFORMATION: High Contrast & Master Theme */}
      <div className="flex flex-col items-center justify-center text-center w-full min-w-0 pt-1.5 pb-0.5">
        {/* Offer Name */}
        <h4 className="w-full truncate text-xs sm:text-[13px] font-extrabold text-white group-hover:text-purple-300 transition-colors leading-tight px-1">
          {offer.name}
        </h4>

        {/* Reward / Value */}
        <p className="w-full truncate text-xs sm:text-sm font-black text-emerald-400 tracking-tight leading-tight mt-1 px-1">
          {offer.rewardDisplay}
        </p>

        {/* Reward information */}
        <p className="w-full truncate text-[10.5px] sm:text-[11px] font-semibold text-slate-400 mt-0.5 px-1">
          {rewardInfo}
        </p>
      </div>
    </div>
  );
};
