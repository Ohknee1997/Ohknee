import React from 'react';
import { EnrichedOffer } from '../data/enrichedOffers';
import { Trophy, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { initialsOf } from '../utils';

interface Top10MobileViewProps {
  offers: EnrichedOffer[];
  onSelectOffer: (offer: EnrichedOffer) => void;
  onToggleSave?: (offerId: string) => void;
  savedOfferIds?: Set<string>;
}

export const Top10MobileView: React.FC<Top10MobileViewProps> = ({
  offers,
  onSelectOffer,
}) => {
  // Ensure exactly top 10 items
  const top10 = offers.slice(0, 10);

  return (
    <div
      id="top-10-mobile-view"
      className="w-full min-h-screen bg-[#0d0f15] text-slate-100 select-none pb-28 md:pb-20"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header - Unified Master Theme */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 p-4 rounded-2xl bg-[#131722] border border-[#242b3d] shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-purple-600/20 border border-amber-400/40 text-amber-400 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Trophy size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight uppercase flex items-center gap-2">
                <span>Top 10 Highest Payouts</span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Ranked by verified guaranteed instant rewards
              </p>
            </div>
          </div>

          <div className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs font-black text-emerald-400 shrink-0 shadow-xs">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>VERIFIED INSTANT REWARDS</span>
          </div>
        </div>

        {/* Unified 2/3 Column Grid matching Master Design System */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
          {top10.map((offer, index) => {
            const rank = index + 1;

            // Metallic rank badges
            const rankBadgeStyle =
              rank === 1
                ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.4)] border border-amber-300'
                : rank === 2
                ? 'bg-gradient-to-tr from-slate-200 to-slate-400 text-slate-950 font-black shadow-[0_0_12px_rgba(203,213,225,0.3)] border border-slate-300'
                : rank === 3
                ? 'bg-gradient-to-tr from-amber-600 to-amber-700 text-white font-black shadow-[0_0_12px_rgba(217,119,6,0.3)] border border-amber-500'
                : 'bg-[#1c2233] text-purple-300 border border-[#2f374e] font-black';

            const rawLogoSrc =
              offer.logoUrl ||
              (offer.domain
                ? `https://www.google.com/s2/favicons?domain=${offer.domain}&sz=128`
                : undefined);

            return (
              <div
                key={`top10-card-${offer.id}`}
                id={`top10-card-${offer.id}`}
                onClick={() => onSelectOffer(offer)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectOffer(offer);
                  }
                }}
                className="relative rounded-2xl bg-[#131722] border border-[#242b3d] hover:border-purple-500/60 p-4 flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-purple-900/20 active:scale-[0.99] transition-all duration-200 group overflow-hidden"
              >
                {/* Top: Rank + Brand Logo + Payout */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Rank Badge */}
                    <div
                      className={`h-7 px-2.5 rounded-lg text-xs flex items-center justify-center shrink-0 ${rankBadgeStyle}`}
                    >
                      #{rank}
                    </div>

                    {/* Brand Logo - 40px container */}
                    <div className="w-10 h-10 rounded-xl bg-[#181d2c] border border-slate-800 flex items-center justify-center p-1.5 shrink-0 overflow-hidden group-hover:border-purple-400 transition-colors">
                      {rawLogoSrc ? (
                        <img
                          src={rawLogoSrc}
                          alt={offer.name}
                          className="max-h-full max-w-full w-auto h-auto object-contain rounded drop-shadow-xs group-hover:scale-105 transition-transform"
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-xs font-black text-purple-400">
                          {initialsOf(offer.name)}
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <div className="min-w-0">
                      <h3 className="text-sm font-extrabold text-white group-hover:text-purple-300 transition-colors truncate">
                        {offer.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-slate-400 truncate">
                        {offer.categoryDisplay || 'Verified Cash Reward'}
                      </p>
                    </div>
                  </div>

                  {/* Payout Display */}
                  <div className="text-right shrink-0">
                    <span className="text-base sm:text-lg font-black text-emerald-400 tracking-tight">
                      {offer.payout}
                    </span>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1">
                    <span>Instant Credit</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  <button
                    type="button"
                    className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 group-hover:scale-[1.02] transition-transform"
                  >
                    <span>Claim Now</span>
                    <ArrowRight size={13} className="text-purple-200" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
