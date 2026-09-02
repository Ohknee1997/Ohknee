import React, { useState } from 'react';
import { EnrichedOffer } from '../data/enrichedOffers';
import { CompactOfferCard } from './CompactOfferCard';
import { initialsOf } from '../utils';
import { Star, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

interface MyOffersRowProps {
  savedOffers: EnrichedOffer[];
  allOffers: EnrichedOffer[];
  onSelectOffer: (offer: EnrichedOffer) => void;
  onToggleSave: (offerId: string) => void;
}

export const MyOffersRow: React.FC<MyOffersRowProps> = ({
  savedOffers,
  allOffers,
  onSelectOffer,
  onToggleSave,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // If user hasn't saved anything yet, display the top recommended starter set
  const displayOffers =
    savedOffers.length > 0
      ? savedOffers
      : allOffers.filter((o) => o.categories.includes('fast-easy')).slice(0, 6);

  const isDefaultSet = savedOffers.length === 0;

  return (
    <section className="w-full rounded-2xl bg-[#0a101d]/90 border border-slate-800/90 mb-4 shadow-lg backdrop-blur-md overflow-hidden transition-all">
      {/* Top Banner Row - Identical height & column structure as all Category Tabs */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-[88px] sm:h-[92px] min-h-[88px] sm:min-h-[92px] max-h-[88px] sm:max-h-[92px] px-3.5 sm:px-5 py-3 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer group select-none hover:border-teal-500/40"
      >
        {/* COLUMN 1: Fixed-size Category Icon + Title Area (Matches Category tabs exactly) */}
        <div className="w-[200px] sm:w-[280px] md:w-[320px] lg:w-[350px] flex-shrink-0 flex items-center gap-3 sm:gap-3.5 min-w-0">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/25 text-teal-300 group-hover:scale-105 group-hover:border-teal-400/50 transition-all flex-shrink-0 shadow-sm">
            <Star size={26} className="stroke-[2.2]" fill="currentColor" />
          </div>
          <div className="min-w-0 flex-1 pr-1 sm:pr-2">
            <h3 className="text-xs sm:text-sm md:text-base font-black tracking-tight text-white uppercase group-hover:text-teal-300 transition-colors truncate">
              MY OFFERS
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate mt-0.5">
              {isDefaultSet
                ? 'Quick-start sequence • Pin your favorites anytime'
                : `${savedOffers.length} saved offers tracked`}
            </p>
          </div>
        </div>

        {/* COLUMN 2: Offer Logos / Icons Area - Exactly identical size & start coordinate */}
        <div className="hidden md:flex flex-1 items-center justify-start gap-2.5 sm:gap-3 overflow-hidden px-2 sm:px-3">
          {displayOffers.slice(0, 5).map((offer) => {
            const rawLogo =
              offer.logoUrl ||
              (offer.domain
                ? `https://www.google.com/s2/favicons?domain=${offer.domain}&sz=128`
                : undefined);

            return (
              <button
                key={offer.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectOffer(offer);
                }}
                className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[#070b14] border border-slate-800 p-2 flex-shrink-0 shadow-sm group-hover:border-slate-700/80 hover:border-teal-400 transition-all cursor-pointer"
                title={`${offer.name} (${offer.rewardDisplay})`}
              >
                {rawLogo ? (
                  <img
                    src={rawLogo}
                    alt={offer.name}
                    className="h-full w-full object-contain rounded-lg"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-xs sm:text-sm font-black text-teal-300">
                    {initialsOf(offer.name)}
                  </span>
                )}
              </button>
            );
          })}
          {displayOffers.length > 5 && (
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[#070b14]/90 border border-slate-800 text-xs font-black text-slate-400 flex-shrink-0">
              +{displayOffers.length - 5}
            </div>
          )}
        </div>

        {/* COLUMN 3: SHOW ROW / HIDE ROW Button */}
        <div className="w-[105px] sm:w-[125px] flex-shrink-0 flex items-center justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-500/10 h-10 px-3.5 text-xs font-bold text-teal-300 hover:bg-teal-500/20 hover:border-teal-400 transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
          >
            {isExpanded ? (
              <>
                <EyeOff size={14} />
                <span>HIDE ROW</span>
                <ChevronUp size={14} className="text-teal-400" />
              </>
            ) : (
              <>
                <Eye size={14} />
                <span>SHOW ROW</span>
                <ChevronDown size={14} className="text-teal-400" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Grid View */}
      {isExpanded && (
        <div className="p-3 sm:p-4 border-t border-slate-800/80 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {displayOffers.map((offer) => (
              <CompactOfferCard
                key={offer.id}
                offer={offer}
                isSaved={savedOffers.some((o) => o.id === offer.id)}
                onToggleSave={onToggleSave}
                onSelectOffer={onSelectOffer}
                className="w-full"
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
