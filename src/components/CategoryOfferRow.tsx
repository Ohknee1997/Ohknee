import React, { useState, useRef } from 'react';
import { EnrichedOffer } from '../data/enrichedOffers';
import { CompactOfferCard } from './CompactOfferCard';
import { initialsOf } from '../utils';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Monitor,
  Smartphone,
  Apple,
  LayoutGrid,
  Search,
  Play,
  X,
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
  isSingleFrame?: boolean;
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
  isSingleFrame = false,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(initialOpen);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  // Platform device filter for this specific row (Gemsloot GUI)
  const [activePlatform, setActivePlatform] = useState<'all' | 'apple' | 'android' | 'desktop'>('all');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullGridView, setIsFullGridView] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);

  if (offers.length === 0) return null;

  const handleToggle = () => {
    const nextState = !isOpen;
    if (onToggleOpen) {
      onToggleOpen(nextState);
    } else {
      setInternalIsOpen(nextState);
    }
  };

  // Filter offers based on platform and search
  const displayedOffers = offers.filter((offer) => {
    if (activePlatform !== 'all') {
      if (!offer.platforms?.includes(activePlatform)) {
        return false;
      }
    }
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
            className="flex items-center gap-1.5 text-white hover:text-purple-300 transition-colors font-black tracking-tight text-sm sm:text-base cursor-pointer group"
          >
            <span className="text-purple-400 group-hover:scale-110 transition-transform">
              {icon}
            </span>
            <span className="capitalize">{title}</span>
            <ChevronDown
              size={16}
              className={`text-slate-400 group-hover:text-purple-300 transition-transform ${
                isOpen ? 'rotate-0' : '-rotate-90'
              }`}
            />
          </button>

          {/* Device Platform Filters (Visible when expanded or always available) */}
          {isOpen && (
            <div className="flex items-center gap-1 bg-[#131622] border border-[#23293b] rounded-xl p-0.5">
              {/* Apple (iOS) */}
              <button
                type="button"
                onClick={() => setActivePlatform((p) => (p === 'apple' ? 'all' : 'apple'))}
                title="Apple iOS offers"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  activePlatform === 'apple'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-[#1c2234]'
                }`}
              >
                <Apple size={13} />
              </button>

              {/* Android */}
              <button
                type="button"
                onClick={() => setActivePlatform((p) => (p === 'android' ? 'all' : 'android'))}
                title="Android offers"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  activePlatform === 'android'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-[#1c2234]'
                }`}
              >
                <Smartphone size={13} />
              </button>

              {/* Desktop / PC */}
              <button
                type="button"
                onClick={() => setActivePlatform((p) => (p === 'desktop' ? 'all' : 'desktop'))}
                title="Desktop & Web offers"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  activePlatform === 'desktop'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-[#1c2234]'
                }`}
              >
                <Monitor size={13} />
              </button>

              {/* All / Grid */}
              <button
                type="button"
                onClick={() => setActivePlatform('all')}
                title="All platforms"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  activePlatform === 'all'
                    ? 'bg-purple-600/40 text-purple-300'
                    : 'text-slate-400 hover:text-white hover:bg-[#1c2234]'
                }`}
              >
                <LayoutGrid size={13} />
              </button>

              {/* Purple Search Toggle */}
              <button
                type="button"
                onClick={() => setShowSearch((s) => !s)}
                title="Search this row"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  showSearch || searchQuery
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-purple-900/60 hover:bg-purple-800 text-purple-300'
                }`}
              >
                <Search size={13} />
              </button>
            </div>
          )}

          {/* Inline Search Input */}
          {isOpen && showSearch && (
            <div className="flex items-center gap-1 bg-[#131622] border border-purple-500/50 rounded-xl px-2 py-0.5 text-xs animate-in fade-in duration-150">
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
              className="w-7 h-7 rounded-lg bg-[#151926] border border-[#23293b] flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#1e2436] transition-colors cursor-pointer"
              title="Previous offers"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              className="w-7 h-7 rounded-lg bg-[#151926] border border-[#23293b] flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#1e2436] transition-colors cursor-pointer"
              title="Next offers"
            >
              <ChevronRight size={15} />
            </button>
            <button
              type="button"
              onClick={handleToggle}
              className="text-xs font-bold text-slate-400 hover:text-purple-300 transition-colors ml-1 px-2 py-1 rounded-lg hover:bg-[#151926] cursor-pointer"
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
          className="w-full bg-[#131620] hover:bg-[#161a28] border border-[#22283a] hover:border-purple-500/50 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between cursor-pointer transition-all duration-200 shadow-sm group"
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
                      <span className="text-[9px] font-black text-purple-400">
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
          <span className="text-xs sm:text-sm font-bold text-purple-400 group-hover:text-purple-300 transition-colors flex items-center gap-1">
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
                  className="text-xs text-purple-400 hover:text-purple-300 font-bold cursor-pointer"
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

              {/* Purple "View More" Card (Gemsloot GUI) */}
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
                style={{ scrollSnapAlign: 'start' }}
                className={`group flex-shrink-0 cursor-pointer rounded-2xl bg-gradient-to-b from-[#8f2bf7] to-[#6d13db] border border-purple-400/40 p-3 flex flex-col items-center justify-center text-center text-white shadow-lg shadow-purple-950/50 hover:scale-[1.02] transition-transform select-none ${
                  isSingleFrame
                    ? 'w-[150px] sm:w-[165px] h-[215px] sm:h-[225px]'
                    : 'w-[170px] sm:w-[185px] h-[245px] sm:h-[255px]'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <LayoutGrid size={32} className="text-white" />
                </div>
                <span className="text-sm sm:text-base font-black tracking-tight leading-tight">
                  View More
                </span>
                <span className="text-[10.5px] font-bold text-purple-200/90 mt-0.5">
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
