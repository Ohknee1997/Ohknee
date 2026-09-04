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
  // Pool of all verified partner offers (strictly locking #1 Stake, #2 Freecash, #3 Gemsloot)
  const masterOffers = useMemo(() => {
    const list = allOffers && allOffers.length > 0 ? allOffers : offers;

    const isStake = (o: EnrichedOffer) =>
      o.id === 'fast-stake' || (o.name.toLowerCase().includes('stake') && !o.name.toLowerCase().includes('pulsz'));
    const isFreecash = (o: EnrichedOffer) =>
      o.id === 'fast-freecash' || o.name.toLowerCase().includes('freecash');
    const isGemsloot = (o: EnrichedOffer) =>
      o.id === 'fast-gemsloot' || o.name.toLowerCase().includes('gemsloot') || o.name.toLowerCase().includes('gems loot');

    const stakeOffer = list.find(isStake) || offers.find(isStake);
    const freecashOffer = list.find(isFreecash) || offers.find(isFreecash);
    const gemslootOffer = list.find(isGemsloot) || offers.find(isGemsloot);

    const lockedTop3 = [stakeOffer, freecashOffer, gemslootOffer].filter(Boolean) as EnrichedOffer[];
    const lockedIds = new Set(lockedTop3.map((o) => o.id));

    // Next 7 from top 10 offers
    const next7 = offers.filter((o) => !lockedIds.has(o.id)).slice(0, 7);
    const top10Ids = new Set([...lockedTop3, ...next7].map((o) => o.id));
    const restList = list.filter((o) => !top10Ids.has(o.id));

    return [...lockedTop3, ...next7, ...restList];
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
        {/* Top 3 Breakdown & Creator Tips Banner */}
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

                {/* 2. TEXT INFORMATION: Name + Bold Payout */}
                <div className="flex flex-col items-start text-left w-full min-w-0 pt-2 px-1">
                  {/* Offer Name */}
                  <h4 className="w-full truncate text-xs sm:text-[13px] font-bold text-white group-hover:text-emerald-300 transition-colors leading-tight">
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
                      className="text-emerald-400 hover:text-emerald-300 p-1 hover:bg-[#1f2638] rounded-md transition-colors"
                      title="View Offer Details & Promo Link"
                    >
                      <ExternalLink size={12} className="text-emerald-400" />
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
