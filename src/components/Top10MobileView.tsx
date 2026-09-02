import React from 'react';
import { EnrichedOffer } from '../data/enrichedOffers';
import { Trophy, ShieldCheck } from 'lucide-react';
import { initialsOf } from '../utils';

interface Top10MobileViewProps {
  offers: EnrichedOffer[];
  onSelectOffer: (offer: EnrichedOffer) => void;
  onToggleSave?: (offerId: string) => void;
  savedOfferIds?: Set<string>;
}

export const Top10MobileView: React.FC<Top10MobileViewProps> = ({
  offers,
  onSelectOffer,
}) => {
  // Ensure exactly top 10 items
  const top10 = offers.slice(0, 10);

  return (
    <div
      id="top-10-mobile-view"
      className="w-full max-w-md mx-auto px-2.5 sm:px-4 pt-1 sm:pt-2 pb-16 flex flex-col justify-center select-none"
    >
      {/* Compact Top 10 Header - Sunset styling */}
      <div className="flex items-center justify-between gap-2 mb-2 px-1">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 border border-amber-300 text-amber-700 shrink-0 shadow-xs">
            <Trophy size={15} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight uppercase truncate flex items-center gap-1.5">
              <span>Top 10 Highest Payouts</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            </h2>
            <p className="text-[10px] text-slate-500 font-semibold truncate">
              Ranked by verified guaranteed rewards
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100/90 border border-emerald-300 text-[10px] font-black text-emerald-800 shrink-0">
          <ShieldCheck size={11} className="text-emerald-700" />
          <span>VERIFIED</span>
        </div>
      </div>

      {/* 2-Column Grid with Exactly 5 Rows - All 10 ads Uniform & Same Size */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 w-full">
        {top10.map((offer, index) => {
          const rank = index + 1;

          // Uniform rank styling
          const rankStyle =
            rank === 1
              ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-xs'
              : rank === 2
              ? 'bg-gradient-to-tr from-slate-200 to-slate-400 text-slate-950 shadow-xs'
              : rank === 3
              ? 'bg-gradient-to-tr from-amber-600 to-amber-500 text-white shadow-xs'
              : 'bg-purple-100 text-purple-900 border border-purple-200';

          const rawLogoSrc =
            offer.logoUrl ||
            (offer.domain
              ? `https://www.google.com/s2/favicons?domain=${offer.domain}&sz=128`
              : undefined);

          return (
            <div
              key={`top10-card-${offer.id}`}
              id={`top10-card-${offer.id}`}
              onClick={() => onSelectOffer(offer)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectOffer(offer);
                }
              }}
              className="relative w-full h-[64px] sm:h-[68px] rounded-xl bg-white/95 border border-purple-100/90 hover:border-amber-400/60 p-1.5 flex items-center gap-2 cursor-pointer shadow-xs hover:shadow-md active:scale-[0.98] transition-all overflow-hidden group"
            >
              {/* Rank Badge - Exactly uniform size */}
              <div
                className={`w-6 h-6 rounded-md font-black text-[11px] shrink-0 flex items-center justify-center ${rankStyle}`}
              >
                #{rank}
              </div>

              {/* Brand Logo - Uniform 34px container */}
              <div className="w-[34px] h-[34px] rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center p-1 shrink-0 overflow-hidden group-hover:border-purple-300 transition-colors">
                {rawLogoSrc ? (
                  <img
                    src={rawLogoSrc}
                    alt={offer.name}
                    className="max-h-full max-w-full w-auto h-auto object-contain rounded drop-shadow-xs group-hover:scale-105 transition-transform"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-[11px] font-black text-purple-700">
                    {initialsOf(offer.name)}
                  </span>
                )}
              </div>

              {/* Text Information - 100% Readable */}
              <div className="min-w-0 flex-1 flex flex-col justify-center leading-none">
                <span className="text-[11px] sm:text-xs font-extrabold text-slate-900 group-hover:text-amber-800 transition-colors truncate">
                  {offer.name}
                </span>
                <span className="text-xs sm:text-[13px] font-black text-emerald-700 tracking-tight mt-1 truncate">
                  {offer.payout}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

