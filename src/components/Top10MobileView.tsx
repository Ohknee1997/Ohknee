import React, { useMemo } from 'react';
import { EnrichedOffer } from '../data/enrichedOffers';
import { initialsOf } from '../utils';
import { ExternalLink } from 'lucide-react';

interface Top10MobileViewProps {
  offers: EnrichedOffer[];
  allOffers?: EnrichedOffer[];
  onSelectOffer: (offer: EnrichedOffer) => void;
  onToggleSave?: (offerId: string) => void;
  savedOfferIds?: Set<string>;
}

export const Top10MobileView: React.FC<Top10MobileViewProps> = ({
  offers,
  allOffers,
  onSelectOffer,
}) => {
  // Pool of all verified partner offers (prioritizing top 10 + all enriched partners)
  const masterOffers = useMemo(() => {
    const list = allOffers && allOffers.length > 0 ? allOffers : offers;
    // Ensure Top 10 are at the beginning
    const topIds = new Set(offers.slice(0, 10).map((o) => o.id));
    const topList = offers.slice(0, 10);
    const restList = list.filter((o) => !topIds.has(o.id));
    return [...topList, ...restList];
  }, [offers, allOffers]);

  // Format payout number matching Gemsloot ($ 336.60 or $ 110.19)
  const formatPayoutDisplay = (text?: string, value?: number) => {
    if (!text && !value) return '$ 25.00';
    const numMatch = text?.match(/\$?(\d+(\.\d+)?)/);
    if (numMatch && numMatch[1]) {
      const num = parseFloat(numMatch[1]);
      return `$ ${num % 1 === 0 ? `${num}.00` : num.toFixed(2)}`;
    }
    if (value && value > 0) {
      return `$ ${value % 1 === 0 ? `${value}.00` : value.toFixed(2)}`;
    }
    return text || '$ 25.00';
  };

  return (
    <div
      id="top-10-ascension-view"
      className="w-full min-h-screen bg-[#0d0f15] text-slate-100 select-none pb-28 md:pb-20"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-5">
        {/* =======================================================================
            OFFERS GRID NUMBERED SEQUENTIALLY 1 - 10000 (DIRECTLY BELOW HEADER)
            ======================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5 sm:gap-3 w-full">
          {masterOffers.map((offer, idx) => {
            const rankNumber = idx + 1;
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
                className="group relative flex flex-col justify-between select-none cursor-pointer rounded-2xl p-2 transition-all duration-200 hover:-translate-y-1 shadow-md bg-[#131622] hover:bg-[#181d2c] border border-[#22293c] hover:border-purple-500/60 shadow-black/40"
              >
                {/* 1. TOP ARTWORK / LOGO CONTAINER */}
                <div className="w-full h-28 sm:h-32 rounded-xl bg-[#0c0e16] border border-[#1d2334] relative flex items-center justify-center p-2.5 overflow-hidden flex-shrink-0 group-hover:border-purple-500/40 transition-colors">
                  {/* Top-left: Sequential App Number (1 - 10000) */}
                  <div
                    className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-[#181d2c]/95 border border-purple-500/80 text-white text-xs font-black shadow-md flex items-center gap-0.5 backdrop-blur-xs"
                    title={`Rank #${rankNumber}`}
                  >
                    <span className="text-purple-400 text-[10px]">#</span>
                    <span>{rankNumber}</span>
                  </div>

                  {/* High-Resolution Referral Partner Logo */}
                  {rawLogoSrc ? (
                    <img
                      src={rawLogoSrc}
                      alt={offer.name}
                      className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-purple-400 tracking-wider">
                        {initialsOf(offer.name)}
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. TEXT INFORMATION: Name + Bold Payout */}
                <div className="flex flex-col items-start text-left w-full min-w-0 pt-2 px-1">
                  {/* Offer Name */}
                  <h4 className="w-full truncate text-xs sm:text-[13px] font-bold text-white group-hover:text-purple-300 transition-colors leading-tight">
                    {offer.name}
                  </h4>

                  {/* Bold Payout ($ 336.60 style) */}
                  <div className="w-full flex items-center justify-between gap-1 mt-1 truncate">
                    <span className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-none">
                      {formatPayoutDisplay(offer.payout, offer.rewardValue)}
                    </span>

                    {/* Quick Action Icon: Details trigger */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOffer(offer);
                      }}
                      className="text-slate-400 hover:text-purple-300 p-1 hover:bg-[#1f2638] rounded-md transition-colors"
                      title="View Offer Details & Promo Link"
                    >
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
