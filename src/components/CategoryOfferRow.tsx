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
  Plus,
  Minus,
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
        isOpen ? 'mb-4 sm:mb-6' : ''
      }`}
    >
      {isOpen ? (
        <>
          {/* 1. ROW HEADER & TOOLBAR (When expanded) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2 px-0.5">
            {/* Left: Title + Arrow + Search */}
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
                {/* Category Title with Icon & Arrow */}
                <button
                  type="button"
                  onClick={handleToggle}
                  className="flex items-center gap-2 text-white transition-colors font-black tracking-tight text-xl sm:text-2xl md:text-3xl cursor-pointer group"
                >
                  <span
                    style={{ color: `rgb(${catRgb})` }}
                    className="group-hover:scale-110 transition-transform"
                  >
                    {icon}
                  </span>
                  <span className="tracking-tight">{title}</span>
                  <ChevronDown
                    size={22}
                    style={{ color: `rgb(${catRgb})` }}
                    className="transition-transform duration-200 rotate-0"
                  />
                </button>

                {/* Search Toggle for row */}
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
                    <Search size={14} />
                  </button>
                </div>

                {/* Inline Search Input */}
                {showSearch && (
                  <div
                    style={{ borderColor: `rgba(${catRgb}, 0.6)` }}
                    className="flex items-center gap-1.5 bg-[#131622] border rounded-xl px-2.5 py-1 text-xs sm:text-sm animate-in fade-in duration-150"
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Search ${title}...`}
                      className="bg-transparent text-white placeholder-slate-500 focus:outline-hidden w-32 sm:w-44 text-xs sm:text-sm"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="text-slate-400 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>
              {subtitle && (
                <p className="text-xs sm:text-sm text-slate-400 font-medium ml-1 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Right: Carousel Navigation Arrows & Hide Row Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={scrollLeft}
                style={{ color: `rgb(${catRgb})` }}
                className="w-9 h-9 rounded-xl bg-[#151926] border border-[#23293b] flex items-center justify-center hover:text-white hover:bg-[#1e2436] transition-colors cursor-pointer"
                title="Previous offers"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={scrollRight}
                style={{ color: `rgb(${catRgb})` }}
                className="w-9 h-9 rounded-xl bg-[#151926] border border-[#23293b] flex items-center justify-center hover:text-white hover:bg-[#1e2436] transition-colors cursor-pointer"
                title="Next offers"
              >
                <ChevronRight size={18} />
              </button>
              <button
                type="button"
                onClick={handleToggle}
                style={{
                  color: `rgb(${catRgb})`,
                  borderColor: `rgba(${catRgb}, 0.5)`,
                  backgroundColor: `rgba(${catRgb}, 0.12)`,
                  boxShadow: `0 0 10px rgba(${catRgb}, 0.25)`,
                }}
                className="text-xs sm:text-sm font-bold transition-all ml-1 px-3 py-1.5 rounded-xl border flex items-center gap-1.5 hover:brightness-125 cursor-pointer"
                title="Hide row"
              >
                <Minus size={14} className="stroke-[2.5]" />
                <span>Hide row</span>
              </button>
            </div>
          </div>

          {/* 3. EXPANDED VIEW: Horizontal Carousel OR Full Grid */}
          <div className="w-full animate-in fade-in duration-150">
            {isFullGridView ? (
              /* Full Multi-Line Grid View */
              <div className="w-full">
                <div className="flex justify-between items-center mb-3 px-1">
                  <span className="text-sm sm:text-base text-slate-300 font-bold">
                    Showing all {displayedOffers.length} offers
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsFullGridView(false)}
                    style={{ color: `rgb(${catRgb})` }}
                    className="text-xs sm:text-sm font-extrabold cursor-pointer hover:underline"
                  >
                    Switch to Carousel ‹ ›
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4.5">
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
                className="flex items-center gap-3.5 sm:gap-4.5 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth"
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
                    background: `linear-gradient(145deg, rgba(${catRgb}, 0.92) 0%, rgba(${catRgb}, 0.70) 100%)`,
                    borderColor: `rgba(${catRgb}, 0.85)`,
                    boxShadow: `0 8px 24px -4px rgba(${catRgb}, 0.45)`,
                  }}
                  className={`group flex-shrink-0 cursor-pointer rounded-2xl border p-4 flex flex-col items-center justify-center text-center text-white hover:scale-[1.02] transition-transform select-none ${
                    isSingleFrame
                      ? 'w-[195px] sm:w-[215px] h-[280px] sm:h-[300px]'
                      : 'w-[230px] sm:w-[255px] md:w-[275px] h-[325px] sm:h-[350px] md:h-[370px]'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                    <LayoutGrid size={38} className="text-white" />
                  </div>
                  <span className="text-base sm:text-lg md:text-xl font-black tracking-tight leading-tight">
                    View More
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white/95 mt-1">
                    +{offers.length} Offers
                  </span>
                  <div className="mt-4 w-9 h-9 rounded-full bg-white/25 flex items-center justify-center shadow-md group-hover:bg-white/35 transition-colors">
                    <Play size={16} className="fill-white text-white translate-x-0.5" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        /* 2. COLLAPSED VIEW: Sleek single pill ribbon so all 5 categories fit on ONE screen */
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
            borderColor: `rgba(${catRgb}, 0.35)`,
            backgroundColor: `rgba(${catRgb}, 0.08)`,
          }}
          className="w-full hover:bg-[#161a28] border rounded-2xl px-3.5 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between cursor-pointer transition-all duration-200 shadow-sm group"
        >
          {/* Left: Category Title + Preview of smaller apps with amount of apps at the end */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-wrap">
            <div className="flex items-center gap-2.5">
              <span style={{ color: `rgb(${catRgb})` }} className="text-lg sm:text-xl">
                {icon}
              </span>
              <span className="font-black text-base sm:text-lg text-white tracking-tight">
                {title}
              </span>
            </div>

            {/* Overlapping thumbnail icons with amount of apps at the end */}
            <div className="flex items-center -space-x-1.5 sm:-space-x-2 overflow-hidden py-0.5">
              {previewOffers.map((offer, idx) => {
                const logo =
                  offer.logoUrl ||
                  (offer.domain
                    ? `https://www.google.com/s2/favicons?domain=${offer.domain}&sz=128`
                    : undefined);

                return (
                  <div
                    key={offer.id || idx}
                    className="w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-lg bg-[#0e111a] border border-slate-700/80 p-0.5 shadow-sm overflow-hidden flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"
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
                        className="text-[9px] sm:text-[10px] font-black"
                      >
                        {initialsOf(offer.name)}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* End of preview of smaller apps: amount of apps in category */}
              <div
                style={{
                  backgroundColor: `rgba(${catRgb}, 0.22)`,
                  borderColor: `rgba(${catRgb}, 0.75)`,
                  color: `rgb(${catRgb})`,
                  boxShadow: `0 0 10px rgba(${catRgb}, 0.35)`,
                }}
                className="h-7.5 sm:h-8.5 px-2.5 rounded-lg border-2 flex items-center justify-center text-[10px] sm:text-xs font-black tracking-tight z-10 flex-shrink-0 backdrop-blur-xs whitespace-nowrap shadow-sm group-hover:scale-105 transition-transform"
                title={`${offers.length} apps in ${title}`}
              >
                {offers.length} apps
              </div>
            </div>
          </div>

          {/* Far Right: Neon Plus Sign Icon fitting the category theme */}
          <div
            style={{
              color: `rgb(${catRgb})`,
              borderColor: `rgba(${catRgb}, 0.85)`,
              backgroundColor: `rgba(${catRgb}, 0.16)`,
              boxShadow: `0 0 14px rgba(${catRgb}, 0.5), inset 0 0 8px rgba(${catRgb}, 0.28)`,
            }}
            className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-xl border-2 flex items-center justify-center group-hover:scale-110 group-hover:brightness-125 transition-all duration-200 flex-shrink-0 ml-2 shadow-sm"
            title={`Show ${title} row`}
            aria-label={`Show ${title} row`}
          >
            <Plus
              size={20}
              className="stroke-[3]"
              style={{ filter: `drop-shadow(0 0 6px rgba(${catRgb}, 0.95))` }}
            />
          </div>
        </div>
      )}
    </section>
  );
};
