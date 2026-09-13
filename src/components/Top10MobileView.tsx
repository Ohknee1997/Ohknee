import React, { useMemo, useState } from 'react';
import { EnrichedOffer } from '../data/enrichedOffers';
import { initialsOf } from '../utils';
import { ExternalLink, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [expandedOfferIds, setExpandedOfferIds] = useState<Set<string>>(new Set());

  const toggleExpandOffer = (e: React.MouseEvent, offerId: string) => {
    e.stopPropagation();
    setExpandedOfferIds((prev) => {
      const next = new Set(prev);
      if (next.has(offerId)) {
        next.delete(offerId);
      } else {
        next.add(offerId);
      }
      return next;
    });
  };

  const handleCopyPromoCode = (e: React.MouseEvent, offer: EnrichedOffer) => {
    e.stopPropagation();
    if (!offer.code) return;
    navigator.clipboard.writeText(offer.code).catch(() => {});
    setCopiedCodeId(offer.id);
    setTimeout(() => {
      setCopiedCodeId((prev) => (prev === offer.id ? null : prev));
    }, 2000);
  };
  // Pool of all verified partner offers
  // Requested strict order:
  // 1: Stake, 2: Freecash, 3: Gems Loot, 4: Polymarket, 5: DraftKings
  // 6: Kalshi, 7: Coinbase
  // After Coinbase: Crown Coins, Lonestar, Modo, MyPrize, Zula, CoinsBack (ShopBack)
  const masterOffers = useMemo(() => {
    const list = allOffers && allOffers.length > 0 ? allOffers : offers;

    const isStake = (o: EnrichedOffer) =>
      o.id === 'fast-stake' || (o.name.toLowerCase().includes('stake') && !o.name.toLowerCase().includes('pulsz'));
    const isFreecash = (o: EnrichedOffer) =>
      o.id === 'fast-freecash' || o.name.toLowerCase().includes('freecash');
    const isGemsloot = (o: EnrichedOffer) =>
      o.id === 'fast-gemsloot' || o.name.toLowerCase().includes('gemsloot') || o.name.toLowerCase().includes('gems loot');
    const isPolymarket = (o: EnrichedOffer) =>
      o.id === 'fast-polymarket' || o.name.toLowerCase().includes('polymarket');
    const isDraftKings = (o: EnrichedOffer) =>
      o.id === 'fast-draftkings' || o.name.toLowerCase().includes('draftkings');
    const isKalshi = (o: EnrichedOffer) =>
      o.id === 'fast-kalshi' || o.name.toLowerCase().includes('kalshi');
    const isCoinbase = (o: EnrichedOffer) =>
      o.id === 'fast-coinbase' || o.name.toLowerCase().includes('coinbase');
    const isCrownCoins = (o: EnrichedOffer) =>
      o.id === '4' || o.name.toLowerCase().includes('crown coin');
    const isLonestar = (o: EnrichedOffer) =>
      o.id === '10' || o.name.toLowerCase().includes('lonestar') || o.name.toLowerCase().includes('lone star');
    const isModo = (o: EnrichedOffer) =>
      o.id === '13' || o.name.toLowerCase().includes('modo');
    const isMyPrize = (o: EnrichedOffer) =>
      o.id === '15' || o.name.toLowerCase().includes('myprize') || o.name.toLowerCase().includes('my prize');
    const isZula = (o: EnrichedOffer) =>
      o.id === '30' || o.name.toLowerCase().includes('zula');
    const isCoinsBack = (o: EnrichedOffer) =>
      o.id === 'cash-back-1' || o.name.toLowerCase().includes('coins back') || o.name.toLowerCase().includes('coinsback') || o.name.toLowerCase().includes('shopback');

    const orderedFinders = [
      isStake,        // 1
      isFreecash,     // 2
      isGemsloot,     // 3
      isPolymarket,   // 4
      isDraftKings,   // 5
      isKalshi,       // 6
      isCoinbase,     // 7
      isCrownCoins,   // 8
      isLonestar,     // 9
      isModo,         // 10
      isMyPrize,      // 11
      isZula,         // 12
      isCoinsBack,    // 13
    ];

    const orderedOffers: EnrichedOffer[] = [];
    const usedIds = new Set<string>();

    for (const finder of orderedFinders) {
      const match = list.find((o) => !usedIds.has(o.id) && finder(o)) || offers.find((o) => !usedIds.has(o.id) && finder(o));
      if (match) {
        orderedOffers.push(match);
        usedIds.add(match.id);
      }
    }

    const restList = list.filter((o) => !usedIds.has(o.id));

    return [...orderedOffers, ...restList];
  }, [offers, allOffers]);

  // Format payout number matching Gemsloot ($ 336.60 or $ 110.19) or ranges ($10–$75)
  const formatPayoutDisplay = (text?: string, value?: number) => {
    if (!text && !value) return '$ 25.00';
    // Support range like $10-$75 or $10–$75
    const rangeMatch = text?.match(/\$?(\d+)\s*[-–]\s*\$?(\d+)/);
    if (rangeMatch && rangeMatch[1] && rangeMatch[2]) {
      return `$ ${rangeMatch[1]}–$ ${rangeMatch[2]}`;
    }
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
        {/* Top 5 Breakdown & Creator Tips Banner */}
        <div
          id="top3-announcement-banner"
          className="mb-4 sm:mb-5 w-full rounded-2xl bg-[#131724] border border-emerald-500/40 p-3.5 sm:p-4 shadow-lg shadow-black/40 space-y-3"
        >
          {/* 1. Stake.us */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-950/90 border border-sky-500/50 flex items-center justify-center flex-shrink-0 text-sky-300 font-black text-xs sm:text-sm shadow-xs">
              #1
            </div>
            <p className="flex-1 text-xs sm:text-sm text-slate-200 leading-relaxed pt-0.5">
              <strong className="text-sky-400 font-extrabold tracking-tight">
                Stake.us is the easiest $25 you will ever claim.
              </strong>{' '}
              <span className="text-slate-200 font-medium">
                Keeping the number one position week after week.
              </span>{' '}
              <span className="text-slate-300">
                Make sure to check your email for the bonus I see that a lot of you guys are signing up but not claiming your bonus.
              </span>
            </p>
          </div>

          <div className="border-t border-slate-800/80" />

          {/* 2. Freecash */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-950/90 border border-emerald-500/50 flex items-center justify-center flex-shrink-0 text-emerald-300 font-black text-xs sm:text-sm shadow-xs">
              #2
            </div>
            <p className="flex-1 text-xs sm:text-sm text-slate-200 leading-relaxed pt-0.5">
              <strong className="text-emerald-400 font-extrabold tracking-tight">
                Freecash following it in the easiest money
              </strong>{' '}
              <span className="text-slate-300">
                because you literally just download it and play one game for a few minutes before it registers your $15 bonus. I personally made over $1,000 on this app playing games, doing surveys, and sign up bonuses.
              </span>
            </p>
          </div>

          <div className="border-t border-slate-800/80" />

          {/* 3. Gems Loot */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-950/90 border border-purple-500/50 flex items-center justify-center flex-shrink-0 text-purple-300 font-black text-xs sm:text-sm shadow-xs">
              #3
            </div>
            <p className="flex-1 text-xs sm:text-sm text-slate-200 leading-relaxed pt-0.5">
              <strong className="text-purple-400 font-extrabold tracking-tight">
                Gems Loot is our number third app
              </strong>{' '}
              <span className="text-slate-300">
                allowing you to test PC games and their Ascend tab that allows you to download five games for $5 that you can complete three times!
              </span>
            </p>
          </div>

          <div className="border-t border-slate-800/80" />

          {/* 4. Polymarket */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-950/90 border border-blue-500/50 flex items-center justify-center flex-shrink-0 text-blue-300 font-black text-xs sm:text-sm shadow-xs">
              #4
            </div>
            <p className="flex-1 text-xs sm:text-sm text-slate-200 leading-relaxed pt-0.5">
              <strong className="text-blue-400 font-extrabold tracking-tight">
                Polymarket Squad $60 Bonus:
              </strong>{' '}
              <span className="text-slate-300">
                Join our squad on Polymarket with code <span className="font-mono text-emerald-300 font-bold">MOPEYDINGO1343</span> for $60. Trade predictions on events, culture, and crypto.
              </span>
            </p>
          </div>

          <div className="border-t border-slate-800/80" />

          {/* 5. DraftKings */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-950/90 border border-emerald-500/50 flex items-center justify-center flex-shrink-0 text-emerald-300 font-black text-xs sm:text-sm shadow-xs">
              #5
            </div>
            <p className="flex-1 text-xs sm:text-sm text-slate-200 leading-relaxed pt-0.5">
              <strong className="text-emerald-400 font-extrabold tracking-tight">
                DraftKings Predictions ($200 Bonus):
              </strong>{' '}
              <span className="text-slate-300">
                Top picks and predictions on sports and pop culture with fast $200 bonus cashouts. Verified referral bonus for new signups.
              </span>
            </p>
          </div>
        </div>

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
                className="group relative flex flex-col justify-between select-none cursor-pointer rounded-2xl p-2 transition-all duration-200 hover:-translate-y-1 shadow-md bg-[#131622] hover:bg-[#181d2c] border border-[#22293c] hover:border-emerald-500/60 shadow-black/40"
              >
                {/* 1. TOP ARTWORK / LOGO CONTAINER */}
                <div className="w-full h-28 sm:h-32 rounded-xl bg-[#0c0e16] border border-[#1d2334] relative flex items-center justify-center p-2.5 overflow-hidden flex-shrink-0 group-hover:border-emerald-500/40 transition-colors">
                  {/* Top-left: Sequential App Number (1 - 10000) */}
                  <div
                    className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-[#181d2c]/95 border border-emerald-500/80 text-white text-xs font-black shadow-md flex items-center gap-0.5 backdrop-blur-xs"
                    title={`Rank #${rankNumber}`}
                  >
                    <span className="text-emerald-400 text-[10px]">#</span>
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
                      <span className="text-xl font-black text-emerald-400 tracking-wider">
                        {initialsOf(offer.name)}
                      </span>
                    </div>
                  )}
                </div>

                {/* PROMO CODE DISPLAY UNDERNEATH IMAGE - CLEARLY VISIBLE & CLICK-TO-COPY */}
                {offer.code && (
                  <button
                    type="button"
                    onClick={(e) => handleCopyPromoCode(e, offer)}
                    title="Click to copy promo code"
                    aria-label={`Copy code ${offer.code}`}
                    className={`mt-1.5 w-full flex items-center justify-between gap-1 px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                      copiedCodeId === offer.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-[#0f121d] hover:bg-[#181e30] border-emerald-500/40 hover:border-emerald-400 text-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
                        CODE:
                      </span>
                      <span className="text-[11px] sm:text-xs font-mono font-black tracking-wide text-white truncate">
                        {offer.code}
                      </span>
                    </div>
                    {copiedCodeId === offer.id ? (
                      <span className="flex items-center gap-0.5 text-[9px] font-extrabold text-emerald-400 flex-shrink-0 bg-emerald-950/80 px-1 py-0.5 rounded border border-emerald-500/50">
                        <Check size={10} />
                        COPIED
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-[9px] font-bold text-slate-400 group-hover:text-emerald-300 flex-shrink-0">
                        <Copy size={10} />
                        COPY
                      </span>
                    )}
                  </button>
                )}

                {/* 2. TEXT INFORMATION: Name + Bold Payout */}
                <div className="flex flex-col items-start text-left w-full min-w-0 pt-1.5 px-1">
                  {/* Offer Name */}
                  <h4 className="w-full truncate text-xs sm:text-[13px] font-bold text-white group-hover:text-emerald-300 transition-colors leading-tight">
                    {offer.name}
                  </h4>

                  {/* Bold Payout ($ 336.60 style) */}
                  <div className="w-full flex items-center justify-between gap-1 mt-1">
                    <span className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-none truncate">
                      {formatPayoutDisplay(offer.payout, offer.rewardValue)}
                    </span>

                    {/* Quick Action Icon: Details trigger */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOffer(offer);
                      }}
                      className="text-emerald-400 hover:text-emerald-300 p-1 hover:bg-[#1f2638] rounded-md transition-colors flex-shrink-0"
                      title="View Offer Details & Promo Link"
                    >
                      <ExternalLink size={12} className="text-emerald-400" />
                    </button>
                  </div>

                  {/* 3. BRIEF DESCRIPTION - EXPANDABLE & SHRINKABLE WITH RIGHT-SIDE INDICATOR ICON */}
                  {offer.descriptionText && (
                    <div className="w-full mt-2 pt-1.5 border-t border-slate-800/80">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => toggleExpandOffer(e, offer.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleExpandOffer(e as any, offer.id);
                          }
                        }}
                        className="w-full flex items-center justify-between gap-1 cursor-pointer select-none text-[11px] text-slate-400 hover:text-emerald-300 transition-colors py-0.5 group/expand"
                        title={expandedOfferIds.has(offer.id) ? 'Collapse description' : 'Expand description'}
                      >
                        <span className="font-semibold text-[10px] tracking-wide text-slate-300 group-hover/expand:text-emerald-300 truncate">
                          {expandedOfferIds.has(offer.id) ? 'Less info' : 'Read details...'}
                        </span>
                        <span className="flex items-center gap-0.5 text-emerald-400 flex-shrink-0 bg-[#0c0e16] p-0.5 rounded border border-emerald-500/30 group-hover/expand:border-emerald-400">
                          {expandedOfferIds.has(offer.id) ? (
                            <ChevronUp size={11} className="text-emerald-400" />
                          ) : (
                            <ChevronDown size={11} className="text-emerald-400" />
                          )}
                        </span>
                      </div>

                      {expandedOfferIds.has(offer.id) ? (
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-200 animate-fadeIn font-normal">
                          {offer.descriptionText}
                        </p>
                      ) : (
                        <p className="mt-0.5 text-[10px] leading-snug text-slate-400 line-clamp-1">
                          {offer.descriptionText}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
