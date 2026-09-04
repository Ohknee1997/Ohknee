import React, { useState, useMemo } from 'react';
import { EnrichedOffer } from '../data/enrichedOffers';
import { initialsOf } from '../utils';
import {
  Trophy,
  Plus,
  X,
  Apple,
  Smartphone,
  Monitor,
  Sparkles,
  ExternalLink,
  Check,
  Zap,
} from 'lucide-react';

interface Top10MobileViewProps {
  offers: EnrichedOffer[];
  allOffers?: EnrichedOffer[];
  onSelectOffer: (offer: EnrichedOffer) => void;
  onToggleSave?: (offerId: string) => void;
  savedOfferIds?: Set<string>;
}

type RankTier = 'all' | 'gold' | 'silver' | 'bronze';

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

  // Assign tiers (Gold, Silver, Bronze) based on payout value or rank
  const tieredOffers = useMemo(() => {
    return masterOffers.map((offer, idx) => {
      let rank: 'gold' | 'silver' | 'bronze';
      if (idx < 10 || offer.rewardValue >= 50 || offer.isFeatured) {
        rank = 'gold';
      } else if (idx < 25 || offer.rewardValue >= 20) {
        rank = 'silver';
      } else {
        rank = 'bronze';
      }
      return {
        ...offer,
        rank,
      };
    });
  }, [masterOffers]);

  // Active filter tab: 'all' | 'gold' | 'silver' | 'bronze' (matches screenshot where 'silver' or active is purple)
  const [activeTier, setActiveTier] = useState<RankTier>('all');

  // Slotted offers in Ascension Hub (up to 5 slots: 3 top row, 2 bottom row)
  const [slottedOffers, setSlottedOffers] = useState<typeof tieredOffers>([]);

  // Celebration modal state
  const [isAscendCelebrationOpen, setIsAscendCelebrationOpen] = useState(false);

  // Filter offers by selected tier
  const displayedOffers = useMemo(() => {
    if (activeTier === 'all') return tieredOffers;
    return tieredOffers.filter((o) => o.rank === activeTier);
  }, [tieredOffers, activeTier]);

  // Toggle slotting an offer into Ascension Hub
  const handleToggleSlotOffer = (offer: typeof tieredOffers[0]) => {
    setSlottedOffers((prev) => {
      const isAlreadySlotted = prev.some((o) => o.id === offer.id);
      if (isAlreadySlotted) {
        return prev.filter((o) => o.id !== offer.id);
      }
      if (prev.length >= 5) {
        // Replace last or inform
        return [...prev.slice(0, 4), offer];
      }
      return [...prev, offer];
    });
  };

  // Remove a specific slot
  const handleRemoveSlot = (index: number) => {
    setSlottedOffers((prev) => prev.filter((_, i) => i !== index));
  };

  // Check if current ascension is matching rank for bonus
  const ascensionStatus = useMemo(() => {
    if (slottedOffers.length < 5) return null;
    const firstRank = slottedOffers[0].rank;
    const allMatch = slottedOffers.every((o) => o.rank === firstRank);
    if (allMatch) {
      if (firstRank === 'gold') return { rank: 'Gold', bonus: '$5 Bonus' };
      if (firstRank === 'silver') return { rank: 'Silver', bonus: '$3 Bonus' };
      return { rank: 'Bronze', bonus: '$1 Bonus' };
    }
    return { rank: 'Mixed', bonus: '$1 Bonus' };
  }, [slottedOffers]);

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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* =======================================================================
            1. HERO SECTION: TITLE + INSTRUCTIONS (LEFT) | ASCENSION HUB (RIGHT)
            ======================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 sm:gap-8 mb-8">
          {/* Left Column: Headline, Description & Tier Bonus Badges */}
          <div className="flex-1 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] mb-3 sm:mb-4">
              Ascend your <span className="text-purple-500">Offers</span>
              <br />
              for Massive Rewards
            </h1>

            <p className="text-xs sm:text-sm md:text-[15px] text-slate-400 font-medium leading-relaxed mb-4 max-w-xl">
              Install and play 5 offers of the same rank (Gold, Silver, or Bronze)
              and ascend them to claim an exclusive bonus payout.
            </p>

            {/* Rank Bonus Badges matching screenshot */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950/40 border border-amber-500/50 text-amber-300 text-xs font-black shadow-xs">
                <Trophy size={13} className="text-amber-400" />
                <span>$ 5 Bonus</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-500/50 text-slate-300 text-xs font-black shadow-xs">
                <Trophy size={13} className="text-slate-300" />
                <span>$ 3 Bonus</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950/20 border border-amber-800/40 text-amber-600 text-xs font-black shadow-xs">
                <Trophy size={13} className="text-amber-600" />
                <span>$ 1 Bonus</span>
              </div>
            </div>
          </div>

          {/* Right Column: ASCENSION HUB Widget (Exact layout from screenshot) */}
          <div className="w-full lg:w-[380px] xl:w-[410px] rounded-2xl bg-[#131622] border border-[#23293c] p-4 sm:p-5 shadow-xl flex flex-col justify-between shrink-0">
            {/* Header: Title + Counter */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs sm:text-sm font-black tracking-wider text-white uppercase">
                ASCENSION HUB
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-400">
                {slottedOffers.length}/5
              </span>
            </div>

            {/* 5 Slots Grid (Row 1: 3 slots, Row 2: 2 slots centered) */}
            <div className="w-full flex flex-col items-center gap-2.5 mb-4">
              {/* Row 1: 3 Slots */}
              <div className="grid grid-cols-3 gap-2.5 w-full">
                {[0, 1, 2].map((slotIdx) => {
                  const offer = slottedOffers[slotIdx];
                  return (
                    <div
                      key={`slot-${slotIdx}`}
                      onClick={() => offer && handleRemoveSlot(slotIdx)}
                      className={`h-16 sm:h-20 rounded-xl border flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer overflow-hidden group ${
                        offer
                          ? 'bg-[#0c0e16] border-purple-500/60 shadow-md shadow-purple-950/40'
                          : 'bg-[#0e111a] border-[#22293c] hover:border-slate-600'
                      }`}
                      title={offer ? `${offer.name} (Click to remove)` : 'Empty slot'}
                    >
                      {offer ? (
                        <>
                          {/* Partner Logo */}
                          <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center p-1">
                            {offer.logoUrl || offer.domain ? (
                              <img
                                src={
                                  offer.logoUrl ||
                                  `https://www.google.com/s2/favicons?domain=${offer.domain}&sz=128`
                                }
                                alt={offer.name}
                                className="max-h-full max-w-full object-contain rounded-xs"
                              />
                            ) : (
                              <span className="text-xs font-black text-purple-400">
                                {initialsOf(offer.name)}
                              </span>
                            )}
                          </div>
                          {/* Name & Payout */}
                          <span className="text-[10px] font-bold text-white truncate max-w-[90%] px-1">
                            {offer.name}
                          </span>
                          {/* Hover X to remove */}
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <X size={16} className="text-red-400" />
                          </div>
                        </>
                      ) : (
                        <Plus size={20} className="text-slate-600 group-hover:text-purple-400 transition-colors" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Row 2: 2 Slots Centered */}
              <div className="flex justify-center gap-2.5 w-full">
                {[3, 4].map((slotIdx) => {
                  const offer = slottedOffers[slotIdx];
                  return (
                    <div
                      key={`slot-${slotIdx}`}
                      onClick={() => offer && handleRemoveSlot(slotIdx)}
                      className={`w-[calc(33.333%-0.45rem)] h-16 sm:h-20 rounded-xl border flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer overflow-hidden group ${
                        offer
                          ? 'bg-[#0c0e16] border-purple-500/60 shadow-md shadow-purple-950/40'
                          : 'bg-[#0e111a] border-[#22293c] hover:border-slate-600'
                      }`}
                      title={offer ? `${offer.name} (Click to remove)` : 'Empty slot'}
                    >
                      {offer ? (
                        <>
                          <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center p-1">
                            {offer.logoUrl || offer.domain ? (
                              <img
                                src={
                                  offer.logoUrl ||
                                  `https://www.google.com/s2/favicons?domain=${offer.domain}&sz=128`
                                }
                                alt={offer.name}
                                className="max-h-full max-w-full object-contain rounded-xs"
                              />
                            ) : (
                              <span className="text-xs font-black text-purple-400">
                                {initialsOf(offer.name)}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-white truncate max-w-[90%] px-1">
                            {offer.name}
                          </span>
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <X size={16} className="text-red-400" />
                          </div>
                        </>
                      ) : (
                        <Plus size={20} className="text-slate-600 group-hover:text-purple-400 transition-colors" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Big Purple ASCEND OFFERS Button */}
            <button
              type="button"
              disabled={slottedOffers.length === 0}
              onClick={() => {
                if (slottedOffers.length > 0) {
                  setIsAscendCelebrationOpen(true);
                }
              }}
              className={`w-full py-3 sm:py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                slottedOffers.length === 5
                  ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-lg shadow-purple-900/50 animate-pulse'
                  : slottedOffers.length > 0
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-900/30'
                  : 'bg-purple-900/40 text-purple-300/60 border border-purple-800/30 cursor-not-allowed'
              }`}
            >
              <Sparkles size={16} className="text-purple-200" />
              <span>
                {slottedOffers.length === 5 ? 'ASCEND OFFERS' : `ASCEND OFFERS (${slottedOffers.length}/5)`}
              </span>
            </button>
          </div>
        </div>

        {/* =======================================================================
            2. FILTER PILLS: All | Gold | Silver | Bronze
            ======================================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-6 bg-[#131622] border border-[#23293c] p-1 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setActiveTier('all')}
            className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTier === 'all'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-[#1a2030]'
            }`}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => setActiveTier('gold')}
            className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTier === 'gold'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-[#1a2030]'
            }`}
          >
            Gold
          </button>

          <button
            type="button"
            onClick={() => setActiveTier('silver')}
            className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTier === 'silver'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-[#1a2030]'
            }`}
          >
            Silver
          </button>

          <button
            type="button"
            onClick={() => setActiveTier('bronze')}
            className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTier === 'bronze'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-[#1a2030]'
            }`}
          >
            Bronze
          </button>
        </div>

        {/* =======================================================================
            3. OFFERS GRID (8 COLUMNS ON XL DESKTOP, EXACT PLACEMENT & LAYOUT)
            ======================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5 sm:gap-3 w-full">
          {displayedOffers.map((offer) => {
            const isSlotted = slottedOffers.some((o) => o.id === offer.id);
            const rawLogoSrc =
              offer.logoUrl ||
              (offer.domain
                ? `https://www.google.com/s2/favicons?domain=${offer.domain}&sz=128`
                : undefined);

            // Trophy icon & border color by rank
            const rankBadgeColor =
              offer.rank === 'gold'
                ? 'border-amber-400/80 text-amber-400 bg-amber-950/80'
                : offer.rank === 'silver'
                ? 'border-slate-300/80 text-slate-300 bg-slate-800/80'
                : 'border-amber-700/80 text-amber-600 bg-amber-950/60';

            return (
              <div
                key={offer.id}
                onClick={() => handleToggleSlotOffer(offer)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggleSlotOffer(offer);
                  }
                }}
                className={`group relative flex flex-col justify-between select-none cursor-pointer rounded-2xl p-2 transition-all duration-200 hover:-translate-y-1 shadow-md ${
                  isSlotted
                    ? 'bg-[#181d2c] border-2 border-purple-500 shadow-purple-950/60 shadow-lg'
                    : 'bg-[#131622] hover:bg-[#181d2c] border border-[#22293c] hover:border-purple-500/60 shadow-black/40'
                }`}
              >
                {/* 1. TOP ARTWORK / LOGO CONTAINER */}
                <div className="w-full h-28 sm:h-32 rounded-xl bg-[#0c0e16] border border-[#1d2334] relative flex items-center justify-center p-2.5 overflow-hidden flex-shrink-0 group-hover:border-purple-500/40 transition-colors">
                  {/* Top-left: Circular Rank Badge with Trophy */}
                  <div
                    className={`absolute top-2 left-2 z-10 w-6 h-6 rounded-full border flex items-center justify-center ${rankBadgeColor} shadow-xs`}
                    title={`${offer.rank.toUpperCase()} Tier`}
                  >
                    <Trophy size={11} />
                  </div>

                  {/* Top-right: Platform Device Icons Badge (Apple, Smartphone, Monitor) */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#161a28]/95 backdrop-blur-xs border border-slate-700/70 rounded-md px-1.5 py-0.5 z-10">
                    <Apple size={10} className="text-slate-400" />
                    <Smartphone size={10} className="text-slate-400" />
                    <span className="text-[9px] font-black text-purple-400 ml-0.5">★</span>
                  </div>

                  {/* Slotted Indicator Badge */}
                  {isSlotted && (
                    <div className="absolute bottom-2 left-2 z-10">
                      <span className="px-1.5 py-0.5 rounded-md bg-purple-600 text-white text-[9px] font-black flex items-center gap-0.5 shadow-sm">
                        <Check size={9} />
                        SLOTTED
                      </span>
                    </div>
                  )}

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

      {/* =======================================================================
          4. ASCENSION CELEBRATION MODAL
          ======================================================================= */}
      {isAscendCelebrationOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-[#131622] border border-purple-500/60 p-6 shadow-2xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-md">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Ascension Hub Ready!
                  </h3>
                  <p className="text-xs text-purple-300 font-bold">
                    {ascensionStatus
                      ? `🎉 ${ascensionStatus.rank} Rank Match: ${ascensionStatus.bonus} Unlocked!`
                      : '5 Selected Partner Offers'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAscendCelebrationOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
              Complete these verified partner offers to maximize your cashout. Click each offer below to claim with verified promo codes:
            </p>

            {/* Slotted List */}
            <div className="space-y-2 mb-5 max-h-60 overflow-y-auto pr-1">
              {slottedOffers.map((offer, idx) => (
                <div
                  key={`ascended-${offer.id}-${idx}`}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#0c0e16] border border-[#22293c]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-black text-purple-400">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-white truncate">
                      {offer.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-extrabold text-emerald-400">
                      {offer.payout}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAscendCelebrationOpen(false);
                        onSelectOffer(offer);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <span>Claim</span>
                      <ExternalLink size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSlottedOffers([]);
                  setIsAscendCelebrationOpen(false);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#1c2234] hover:bg-[#252c42] text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Reset Hub
              </button>
              <button
                type="button"
                onClick={() => setIsAscendCelebrationOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-md shadow-purple-900/40"
              >
                Continue Earning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
