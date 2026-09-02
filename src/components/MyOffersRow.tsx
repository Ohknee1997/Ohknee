import React, { useState } from 'react';
import { EnrichedOffer } from '../data/enrichedOffers';
import { CompactOfferCard } from './CompactOfferCard';
import { initialsOf } from '../utils';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';

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
    <section className="w-full rounded-2xl bg-white/90 border border-purple-200/90 mb-4 shadow-xs backdrop-blur-md overflow-hidden transition-all hover:border-purple-300">
      {/* Top Banner Row - Click to Toggle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-[80px] sm:h-[88px] min-h-[80px] sm:min-h-[88px] px-3.5 sm:px-5 py-3 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer group select-none"
      >
        {/* COLUMN 1: Category Icon + Title Area */}
        <div className="flex-1 sm:flex-initial sm:w-[280px] md:w-[320px] flex items-center gap-3 sm:gap-3.5 min-w-0">
          <div className="flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-2xl bg-amber-100/80 border border-amber-300 text-amber-800 group-hover:scale-105 transition-all flex-shrink-0 shadow-xs">
            <Star size={24} className="stroke-[2.2]" fill="currentColor" />
          </div>
          <div className="min-w-0 flex-1 pr-1 sm:pr-2">
            <h3 className="text-xs sm:text-sm md:text-base font-black tracking-tight text-slate-900 uppercase group-hover:text-purple-700 transition-colors truncate">
              MY OFFERS
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-600 font-medium truncate mt-0.5">
              {isDefaultSet
                ? 'Quick-start sequence • Pin your favorites anytime'
                : `${savedOffers.length} saved offers tracked`}
            </p>
          </div>
        </div>

        {/* COLUMN 2: Offer Logos / Icons Area */}
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
                className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 p-2 flex-shrink-0 shadow-xs hover:border-purple-300 transition-all cursor-pointer"
                title={`${offer.name} (${offer.rewardDisplay})`}
              >
                {rawLogo ? (
                  <img
                    src={rawLogo}
                    alt={offer.name}
                    className="h-full w-full object-contain rounded-md"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-xs font-black text-purple-700">
                    {initialsOf(offer.name)}
                  </span>
                )}
              </button>
            );
          })}
          {displayOffers.length > 5 && (
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-xs font-black text-slate-600 flex-shrink-0">
              +{displayOffers.length - 5}
            </div>
          )}
        </div>

        {/* COLUMN 3: Subtle Chevron Indicator */}
        <div className="flex-shrink-0 flex items-center justify-end pl-2">
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold group-hover:bg-purple-100 transition-colors">
            <span className="hidden sm:inline">{isExpanded ? 'Collapse' : 'Expand'}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </div>

      {/* Expanded Grid View */}
      {isExpanded && (
        <div className="p-3 sm:p-4 border-t border-purple-100 bg-purple-50/30 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3">
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

