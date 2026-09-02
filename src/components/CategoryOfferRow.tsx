import React, { useRef, useState } from 'react';
import { EnrichedOffer } from '../data/enrichedOffers';
import { CompactOfferCard } from './CompactOfferCard';
import { initialsOf } from '../utils';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Grid,
  List,
  Eye,
  EyeOff,
} from 'lucide-react';

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
  initialExpanded = false,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(initialOpen);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const [isGridMode, setIsGridMode] = useState(initialExpanded);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (offers.length === 0) return null;

  const handleToggle = () => {
    const nextState = !isOpen;
    if (onToggleOpen) {
      onToggleOpen(nextState);
    } else {
      setInternalIsOpen(nextState);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const distance = 420;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  // 1. CLOSED STATE: Perfectly aligned category tab with exact same height,
  // exact same width, exact same icon container size, and fixed start position for icons (NO ZIGZAG)
  if (!isOpen) {
    return (
      <section
        id={id}
        onClick={handleToggle}
        className="w-full h-[88px] sm:h-[92px] min-h-[88px] sm:min-h-[92px] max-h-[88px] sm:max-h-[92px] rounded-2xl bg-[#0a101d]/90 border border-slate-800/80 hover:border-teal-500/40 px-3.5 sm:px-5 py-3 mb-3 shadow-md hover:shadow-teal-500/5 transition-all flex items-center justify-between gap-3 sm:gap-4 cursor-pointer group select-none"
      >
        {/* COLUMN 1: Fixed-size Category Icon + Title Area (Ensures icons in Column 2 always start at the EXACT same horizontal coordinate) */}
        <div className="w-[200px] sm:w-[280px] md:w-[320px] lg:w-[350px] flex-shrink-0 flex items-center gap-3 sm:gap-3.5 min-w-0">
          {/* Category Icon container: Significantly larger (56px) & visually prominent */}
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/25 text-teal-300 group-hover:scale-105 group-hover:border-teal-400/50 transition-all flex-shrink-0 shadow-sm">
            {React.isValidElement(icon)
              ? React.cloneElement(icon as React.ReactElement<{ size?: number; className?: string }>, {
                  size: 26,
                  className: 'stroke-[2.2]',
                })
              : icon}
          </div>

          {/* Title & Subtitle: Adapts within the fixed column without ever shifting the logo area */}
          <div className="min-w-0 flex-1 pr-1 sm:pr-2">
            <h3 className="text-xs sm:text-sm md:text-base font-black tracking-tight text-white uppercase group-hover:text-teal-300 transition-colors truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* COLUMN 2: Offer Logos / Icons Area - Fixed start position & identical icon containers across all tabs */}
        <div className="hidden md:flex flex-1 items-center justify-start gap-2.5 sm:gap-3 overflow-hidden px-2 sm:px-3">
          {offers.slice(0, 5).map((offer) => {
            const rawLogo =
              offer.logoUrl ||
              (offer.domain
                ? `https://www.google.com/s2/favicons?domain=${offer.domain}&sz=128`
                : undefined);

            return (
              <div
                key={offer.id}
                className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[#070b14] border border-slate-800 p-2 flex-shrink-0 shadow-sm group-hover:border-slate-700/80 transition-all"
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
              </div>
            );
          })}
          {offers.length > 5 && (
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[#070b14]/90 border border-slate-800 text-xs font-black text-slate-400 flex-shrink-0">
              +{offers.length - 5}
            </div>
          )}
        </div>

        {/* COLUMN 3: SHOW ROW Button - Fixed size & right-aligned */}
        <div className="w-[105px] sm:w-[125px] flex-shrink-0 flex items-center justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-500/10 h-10 px-3.5 text-xs font-bold text-teal-300 hover:bg-teal-500/20 hover:border-teal-400 transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
          >
            <Eye size={14} />
            <span>SHOW ROW</span>
            <ChevronDown size={14} className="text-teal-400" />
          </button>
        </div>
      </section>
    );
  }

  // 2. OPEN STATE: Same unified tab header with identical height & alignment + expanded cards track/grid
  return (
    <section
      id={id}
      className="mb-6 w-full rounded-2xl bg-[#0a101d]/90 border border-slate-800/90 shadow-lg transition-all animate-in fade-in duration-200 overflow-hidden"
    >
      {/* Category Tab Header - Identical height & column structure as closed state */}
      <div className="h-[88px] sm:h-[92px] min-h-[88px] sm:min-h-[92px] max-h-[88px] sm:max-h-[92px] px-3.5 sm:px-5 py-3 flex items-center justify-between gap-3 sm:gap-4 border-b border-slate-800/80">
        {/* COLUMN 1: Category Icon + Title (Identical width & icon size as closed state) */}
        <div className="w-[200px] sm:w-[280px] md:w-[320px] lg:w-[350px] flex-shrink-0 flex items-center gap-3 sm:gap-3.5 min-w-0">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/25 text-teal-300 flex-shrink-0 shadow-sm">
            {React.isValidElement(icon)
              ? React.cloneElement(icon as React.ReactElement<{ size?: number; className?: string }>, {
                  size: 26,
                  className: 'stroke-[2.2]',
                })
              : icon}
          </div>
          <div className="min-w-0 flex-1 pr-1 sm:pr-2">
            <h3 className="text-xs sm:text-sm md:text-base font-black tracking-tight text-white uppercase truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* COLUMN 2: Controls Area (Aligned in the same column position) */}
        <div className="hidden sm:flex flex-1 items-center justify-start gap-2 px-2 sm:px-3">
          {/* Carousel Arrows (only in row mode) */}
          {!isGridMode && offers.length > 3 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:border-teal-400/50 hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                title="Scroll left"
                aria-label="Scroll left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:border-teal-400/50 hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                title="Scroll right"
                aria-label="Scroll right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* VIEW MORE / COMPACT ROW Toggle Button */}
          <button
            type="button"
            onClick={() => setIsGridMode(!isGridMode)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-900/90 h-9 px-3.5 text-xs font-bold text-slate-300 hover:text-teal-300 hover:border-teal-400/50 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            {isGridMode ? (
              <>
                <List size={14} />
                <span>COMPACT ROW</span>
              </>
            ) : (
              <>
                <Grid size={14} />
                <span>VIEW MORE ({offers.length})</span>
              </>
            )}
          </button>
        </div>

        {/* COLUMN 3: HIDE ROW Button (Identical size & right alignment) */}
        <div className="w-[105px] sm:w-[125px] flex-shrink-0 flex items-center justify-end">
          <button
            type="button"
            onClick={handleToggle}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-900/90 h-10 px-3.5 text-xs font-bold text-slate-300 hover:text-white hover:border-teal-400 transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
            title="Hide Row"
          >
            <EyeOff size={14} />
            <span>HIDE ROW</span>
            <ChevronUp size={14} />
          </button>
        </div>
      </div>

      {/* Row or Grid presentation */}
      <div className="p-3 sm:p-4">
        {isGridMode ? (
          /* Expanded Multi-Column Grid with identical dimensions */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 animate-in fade-in duration-200">
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
        ) : (
          /* Horizontal Carousel Track with identical dimensions */
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-1"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {offers.map((offer) => (
              <div key={offer.id} style={{ scrollSnapAlign: 'start' }}>
                <CompactOfferCard
                  offer={offer}
                  isSaved={savedOfferIds.has(offer.id)}
                  onToggleSave={onToggleSave}
                  onSelectOffer={onSelectOffer}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
