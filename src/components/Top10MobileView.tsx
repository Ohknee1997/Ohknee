import React, { useMemo } from 'react';
import { EnrichedOffer } from '../data/enrichedOffers';
import { initialsOf } from '../utils';
import { TopEditableBanner } from './TopEditableBanner';

interface Top10MobileViewProps {
  offers: EnrichedOffer[];
  allOffers?: EnrichedOffer[];
  onSelectOffer: (offer) => void;
  onToggleSave?: (offerId: string) => void;
  savedOfferIds?: Set<string>;
}

export const Top10MobileView: React.FC<Top10MobileViewProps> = ({
  offers,
  allOffers,
  onSelectOffer,
}) => {
  // Prioritize top 10 verified partner offers
  const masterOffers = useMemo(() => {
    const list = allOffers && allOffers.length > 0 ? allOffers : offers;
    const topIds = new Set(offers.slice(0, 10).map((o) => o.id));
    const topList = offers.slice(0, 10);
    const restList = list.filter((o) => !topIds.has(o.id));
    return [...topList, ...restList];
  }, [offers, allOffers]);

  // Format payout number ($ 336.60 or $ 110.19)
  const formatPayoutDisplay = (text?: string, value?: number) => {
    if (!text && !value) return '$25.00';
    const numMatch = text?.match(/\$?(\d+(\.\d+)?)/);
    if (numMatch && numMatch[1]) {
      const num = parseFloat(numMatch[1]);
      return `$${num % 1 === 0 ? `${num}.00` : num.toFixed(2)}`;
    }
    if (value && value > 0) {
      return `$${value % 1 === 0 ? `${value}.00` : value.toFixed(2)}`;
    }
    return text || '$25.00';
  };

  return (
    <div
      id="top-10-ascension-view"
      className="w-full min-h-screen bg-[#0d0f15] text-slate-100 select-none pb-28 md:pb-20"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
        {/* Spot at the top with text and small desktop-only editor button */}
        <TopEditableBanner />

        {/* 4 CARDS ACROSS GRID - BORDERLESS SQUARE TILES */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 md:gap-3 w-full">
          {masterOffers.map((offer, idx) => {
            const rawLogoSrc =
              offer.logoUrl ||
              (offer.domain
                ? `https://www.google.com/s2/favicons?domain=${offer.domain}&sz=128`
                : undefined);

            return (
              <div
                key={offer.id}
                onClick={() => onSelectOffer(offer)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectOffer(offer);
                  }
                }}
                className="group relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer select-none bg-[#161a28] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                {/* 1. Rank Badge on Top Left */}
                <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 z-10 px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur-xs text-[11px] sm:text-xs font-black text-white shadow-sm">
                  #{idx + 1}
                </div>

                {/* 2. Full-bleed Logo taking up the entire square space */}
                {rawLogoSrc ? (
                  <img
                    src={rawLogoSrc}
                    alt={offer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#181d2c]">
                    <span className="text-xl sm:text-2xl md:text-3xl font-black text-purple-400">
                      {initialsOf(offer.name)}
                    </span>
                  </div>
                )}

                {/* 3. Text Overlay on the Bottom-Left Corner of the Logo with LARGER text */}
                <div className="absolute inset-x-0 bottom-0 pt-8 pb-1.5 px-1.5 sm:pb-2 sm:px-2.5 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex flex-col justify-end text-left pointer-events-none">
                  <span className="text-xs sm:text-sm md:text-base font-black text-white truncate leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">
                    {offer.name}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base font-black text-emerald-400 leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,1)] mt-0.5">
                    {formatPayoutDisplay(offer.payout, offer.rewardValue)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
