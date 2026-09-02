import React, { useState } from 'react';
import { EnrichedOffer } from '../data/enrichedOffers';
import { CompactOfferCard } from './CompactOfferCard';
import { initialsOf } from '../utils';
import { ChevronDown } from 'lucide-react';

interface CategoryOfferRowProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  offers: EnrichedOffer[];
  savedOfferIds: Set<string>;
  onSelectOffer: (offer: EnrichedOffer) => void;
  onToggleSave: (offerId: string) => void;
  isOpen?: boolean;
  onToggleOpen?: (isOpen: boolean) => void;
  initialOpen?: boolean;
  initialExpanded?: boolean;
}

export const CategoryOfferRow: React.FC<CategoryOfferRowProps> = ({
  id,
  title,
  icon,
  subtitle,
  offers,
  savedOfferIds,
  onSelectOffer,
  onToggleSave,
  isOpen: controlledIsOpen,
  onToggleOpen,
  initialOpen = false,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(initialOpen);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  if (offers.length === 0) return null;

  const handleToggle = () => {
    const nextState = !isOpen;
    if (onToggleOpen) {
      onToggleOpen(nextState);
    } else {
      setInternalIsOpen(nextState);
    }
  };

  return (
    <section
      id={id}
      className="mb-3 sm:mb-4 w-full rounded-2xl bg-white/90 border border-purple-200/70 shadow-sm hover:shadow-md transition-all select-none overflow-hidden"
    >
      {/* Clickable Row Header - Self-taught toggle, no bulky show/hide buttons */}
      <div
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        className="w-full min-h-[76px] sm:min-h-[84px] px-3.5 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-3 cursor-pointer group hover:bg-purple-50/50 transition-colors"
      >
        {/* Left: Category Icon & Title */}
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
          {/* Category Icon Container */}
          <div className="flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-sky-100 border border-purple-200 text-purple-700 group-hover:scale-105 transition-transform flex-shrink-0 shadow-xs">
            {React.isValidElement(icon)
              ? React.cloneElement(icon as React.ReactElement<{ size?: number; className?: string }>, {
                  size: 22,
                  className: 'stroke-[2.2]',
                })
              : icon}
          </div>

          {/* Title & Subtitle */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm md:text-base font-black tracking-tight text-slate-900 uppercase group-hover:text-purple-900 transition-colors truncate">
                {title}
              </h3>
              <span className="hidden xs:inline-flex px-2 py-0.5 rounded-md bg-purple-100/80 text-[10px] font-black text-purple-800">
                {offers.length}
              </span>
            </div>
            {subtitle && (
              <p className="text-[10.5px] sm:text-xs text-slate-500 font-medium truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Center: Preview Logos (when collapsed) */}
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-1.5 overflow-hidden px-2">
            {offers.slice(0, 4).map((offer) => {
              const rawLogo =
                offer.logoUrl ||
                (offer.domain
                  ? `https://www.google.com/s2/favicons?domain=${offer.domain}&sz=128`
                  : undefined);

              return (
                <div
                  key={offer.id}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 p-1 flex-shrink-0 shadow-2xs"
                  title={offer.name}
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
                    <span className="text-[10px] font-black text-purple-700">
                      {initialsOf(offer.name)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Right: Sleek Chevron Indicator (No bulky buttons) */}
        <div className="flex items-center gap-1.5 flex-shrink-0 pl-1">
          <span className="text-[11px] font-bold text-slate-400 group-hover:text-purple-600 transition-colors hidden xs:inline">
            {isOpen ? 'Tap to close' : `${offers.length} offers`}
          </span>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-700 group-hover:bg-purple-100 transition-all ${
              isOpen ? 'rotate-180' : ''
            }`}
          >
            <ChevronDown size={17} className="stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Expanded Cards Grid: Clean 2-column on mobile, fits 100% without halfway cuts */}
      {isOpen && (
        <div className="p-2.5 sm:p-4 border-t border-purple-100/80 bg-gradient-to-b from-purple-50/20 to-transparent animate-in fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5">
            {offers.map((offer) => (
              <CompactOfferCard
                key={offer.id}
                offer={offer}
                isSaved={savedOfferIds.has(offer.id)}
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

