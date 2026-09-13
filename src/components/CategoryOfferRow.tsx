import React, { useState, useRef, useMemo } from 'react';
import { EnrichedOffer } from '../data/enrichedOffers';
import { CompactOfferCard } from './CompactOfferCard';
import { initialsOf } from '../utils';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Play,
  LayoutGrid,
  X,
} from 'lucide-react';

interface CategoryOfferRowProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  themeRgb?: string;
  offers: EnrichedOffer[];
  savedOfferIds: Set<string>;
  onSelectOffer: (offer: EnrichedOffer) => void;
  onToggleSave: (offerId: string) => void;
  isOpen?: boolean;
  onToggleOpen?: (isOpen: boolean) => void;
  initialOpen?: boolean;
  initialExpanded?: boolean;
  isSingleFrame?: boolean;
}

export const CategoryOfferRow: React.FC<CategoryOfferRowProps> = ({
  id,
  title,
  icon,
  subtitle,
  themeRgb,
  offers,
  savedOfferIds,
  onSelectOffer,
  onToggleSave,
  isOpen: controlledIsOpen,
  onToggleOpen,
  initialOpen = false,
  isSingleFrame = false,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(initialOpen);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullGridView, setIsFullGridView] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);

  // Dynamic category theme color based on average color of the apps in that folder
  const catRgb = useMemo(() => {
    if (themeRgb) return themeRgb;
    if (!offers || offers.length === 0) return '99, 102, 241';
    let tr = 0, tg = 0, tb = 0, count = 0;
    for (const o of offers) {
      if (o.accentRgb) {
        const parts = o.accentRgb.split(',').map((s) => parseInt(s.trim(), 10));
        if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
          tr += parts[0];
          tg += parts[1];
          tb += parts[2];
          count++;
        }
      }
    }
    if (count === 0) return '99, 102, 241';
    let r = Math.round(tr / count);
    let g = Math.round(tg / count);
    let b = Math.round(tb / count);

    // Filter out plain green dominance per user instruction:
    // "I don't like the color green on the second page on the earn tub go ahead and do some more color matching over there as well based on the average color of the apps that are in that folder category."
    if (g > r && g > b) {
      b = Math.min(255, Math.max(b, 190));
      g = Math.min(150, g);
      r = Math.max(r, 65);
    }
    return `${r}, ${g}, ${b}`;
  }, [offers, themeRgb]);

  if (offers.length === 0) return null;

  const handleToggle = () => {
    const nextState = !isOpen;
    if (onToggleOpen) {
      onToggleOpen(nextState);
    } else {
      setInternalIsOpen(nextState);
    }
  };

  // Filter offers based on search
  const displayedOffers = offers.filter((offer) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = offer.name.toLowerCase().includes(q);
      const matchPayout = offer.payout?.toLowerCase().includes(q);
      const matchCode = offer.code?.toLowerCase().includes(q);
      if (!matchName && !matchPayout && !matchCode) return false;
    }
    return true;
  });

  // Carousel navigation handlers
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  // Preview thumbnail icons for collapsed state (ONLY real referral partner logos)
  const previewOffers = offers.slice(0, 9);

  return (
    <section
      id={id}
      className={`w-full transition-all select-none ${
        isSingleFrame ? 'mb-2 sm:mb-2.5' : 'mb-3.5 sm:mb-5'
      }`}
    >
      {/* 1. ROW HEADER & TOOLBAR (Gemsloot GUI) */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 px-0.5">
        {/* Left: Title + Arrow + Device Filter Buttons */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
          {/* Category Title with Icon & Arrow */}
          <button
            type="button"
            onClick={handleToggle}
            className="flex items-center gap-1.5 text-white transition-colors font-black tracking-tight text-sm sm:text-base cursor-pointer group"
          >
            <span
              style={{ color: `rgb(${catRgb})` }}
              className="group-hover:scale-110 transition-transform"
            >
              {icon}
            </span>
            <span className="tracking-tight">{title}</span>
            <ChevronDown
              size={16}
              style={{ color: `rgb(${catRgb})` }}
              className={`transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`}
            />
          </button>

          {/* Search Toggle for row */}
          {isOpen && (
            <div className="flex items-center gap-1 bg-[#131622] border border-[#23293b] rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setShowSearch((s) => !s)}
                title="Search this row"
                style={{
                  backgroundColor: showSearch || searchQuery ? `rgb(${catRgb})` : `rgba(${catRgb}, 0.15)`,
                  color: showSearch || searchQuery ? '#fff' : `rgb(${catRgb})`,
                  borderColor: `rgba(${catRgb}, 0.3)`,
                }}
                className="p-1.5 rounded-lg border transition-colors cursor-pointer"
              >
                <Search size={13} />
              </button>
            </div>
          )}

          {/* Inline Search Input */}
          {isOpen && showSearch && (
            <div
              style={{ borderColor: `rgba(${catRgb}, 0.6)` }}
              className="flex items-center gap-1 bg-[#131622] border rounded-xl px-2 py-0.5 text-xs animate-in fade-in duration-150"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${title}...`}
                className="bg-transparent text-white placeholder-slate-500 focus:outline-hidden w-28 sm:w-36 text-xs"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: Carousel Navigation Arrows & Hide Row Button (when expanded) */}
        {isOpen ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={scrollLeft}
              style={{ color: `rgb(${catRgb})` }}
              className="w-7 h-7 rounded-lg bg-[#151926] border border-[#23293b] flex items-center justify-center hover:text-white hover:bg-[#1e2436] transition-colors cursor-pointer"
              title="Previous offers"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              style={{ color: `rgb(${catRgb})` }}
              className="w-7 h-7 rounded-lg bg-[#151926] border border-[#23293b] flex items-center justify-center hover:text-white hover:bg-[#1e2436] transition-colors cursor-pointer"
              title="Next offers"
            >
              <ChevronRight size={15} />
            </button>
            <button
              type="button"
              onClick={handleToggle}
              style={{ color: `rgb(${catRgb})` }}
              className="text-xs font-bold transition-colors ml-1 px-2 py-1 rounded-lg hover:bg-[#151926] cursor-pointer"
            >
              Hide row
            </button>
          </div>
        ) : null}
      </div>

      {/* 2. COLLAPSED VIEW (Exact Gemsloot GUI Pill Ribbon) */}
      {!isOpen ? (
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
          style={{
            borderColor: `rgba(${catRgb}, 0.28)`,
            backgroundColor: `rgba(${catRgb}, 0.05)`,
          }}
          className="w-full hover:bg-[#161a28] border rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between cursor-pointer transition-all duration-200 shadow-sm group"
        >
          {/* Left: Overlapping real referral logos + hidden count */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Overlapping thumbnail icons */}
            <div className="flex items-center -space-x-2 sm:-space-x-2.5 overflow-hidden py-0.5">
              {previewOffers.map((offer, idx) => {
                const logo =
                  offer.logoUrl ||
                  (offer.domain
                    ? `https://www.google.com/s2/favicons?domain=${offer.domain}&sz=128`
                    : undefined);

                return (
                  <div
                    key={offer.id || idx}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#0e111a] border border-slate-700/80 p-0.5 shadow-sm overflow-hidden flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"
                    title={offer.name}
                  >
                    {logo ? (
                      <img
                        src={logo}
                        alt={offer.name}
                        className="w-full h-full object-contain rounded-xs"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span
                        style={{ color: `rgb(${catRgb})` }}
                        className="text-[9px] font-black"
                      >
                        {initialsOf(offer.name)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Hidden Count */}
            <span className="text-xs sm:text-sm font-semibold text-slate-400 group-hover:text-slate-200 transition-colors pl-1">
              {offers.length} hidden
            </span>
          </div>

          {/* Right: Show row button */}
          <span
            style={{ color: `rgb(${catRgb})` }}
            className="text-xs sm:text-sm font-bold transition-colors flex items-center gap-1 group-hover:brightness-125"
          >
            Show row
          </span>
        </div>
      ) : (
        /* 3. EXPANDED VIEW: Horizontal Carousel OR Full Grid */
        <div className="w-full animate-in fade-in duration-150">
          {isFullGridView ? (
            /* Full Multi-Line Grid View */
            <div className="w-full">
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-xs text-slate-400 font-semibold">
                  Showing all {displayedOffers.length} offers
                </span>
                <button
                  type="button"
                  onClick={() => setIsFullGridView(false)}
                  style={{ color: `rgb(${catRgb})` }}
                  className="text-xs font-bold cursor-pointer hover:underline"
                >
                  Switch to Carousel ‹ ›
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3">
                {displayedOffers.map((offer) => (
                  <CompactOfferCard
                    key={offer.id}
                    offer={offer}
                    isSaved={savedOfferIds.has(offer.id)}
                    onToggleSave={onToggleSave}
                    onSelectOffer={onSelectOffer}
                    isCompact={isSingleFrame}
                    className="w-full"
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Gemsloot Horizontal Carousel Row */
            <div
              ref={carouselRef}
              className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 pt-0.5 no-scrollbar scroll-smooth"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {displayedOffers.map((offer) => (
                <div key={offer.id} style={{ scrollSnapAlign: 'start' }}>
                  <CompactOfferCard
                    offer={offer}
                    isSaved={savedOfferIds.has(offer.id)}
                    onToggleSave={onToggleSave}
                    onSelectOffer={onSelectOffer}
                    isCompact={isSingleFrame}
                  />
                </div>
              ))}

              {/* Theme-Matched "View More" Card (No Green!) */}
              <div
                onClick={() => setIsFullGridView(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsFullGridView(true);
                  }
                }}
                style={{
                  scrollSnapAlign: 'start',
                  background: `linear-gradient(145deg, rgba(${catRgb}, 0.90) 0%, rgba(${catRgb}, 0.65) 100%)`,
                  borderColor: `rgba(${catRgb}, 0.75)`,
                  boxShadow: `0 8px 24px -4px rgba(${catRgb}, 0.4)`,
                }}
                className={`group flex-shrink-0 cursor-pointer rounded-2xl border p-3 flex flex-col items-center justify-center text-center text-white hover:scale-[1.02] transition-transform select-none ${
                  isSingleFrame
                    ? 'w-[150px] sm:w-[165px] h-[215px] sm:h-[225px]'
                    : 'w-[170px] sm:w-[185px] h-[245px] sm:h-[255px]'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <LayoutGrid size={32} className="text-white" />
                </div>
                <span className="text-sm sm:text-base font-black tracking-tight leading-tight">
                  View More
                </span>
                <span className="text-[10.5px] font-bold text-white/90 mt-0.5">
                  +{offers.length} Offers
                </span>
                <div className="mt-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shadow-xs group-hover:bg-white/30 transition-colors">
                  <Play size={14} className="fill-white text-white translate-x-0.5" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
