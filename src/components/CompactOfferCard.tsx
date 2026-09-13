import React, { useState } from 'react';
import { EnrichedOffer } from '../data/enrichedOffers';
import { initialsOf } from '../utils';
import { Copy, Check } from 'lucide-react';

interface CompactOfferCardProps {
  offer: EnrichedOffer;
  isSaved?: boolean;
  onToggleSave?: (offerId: string) => void;
  onSelectOffer: (offer: EnrichedOffer) => void;
  className?: string;
  isCompact?: boolean;
}

export const CompactOfferCard: React.FC<CompactOfferCardProps> = ({
  offer,
  onSelectOffer,
  className = '',
  isCompact = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!offer.code) return;
    navigator.clipboard.writeText(offer.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Derive high-resolution logo source
  const rawLogoSrc =
    offer.logoUrl ||
    (offer.domain
      ? `https://www.google.com/s2/favicons?domain=${offer.domain}&sz=128`
      : undefined);

  const logoSrc = imgError ? undefined : rawLogoSrc;

  // Format the payout number cleanly (e.g. $ 25.00 or $ 10–$ 75)
  const formatPayoutDisplay = (text?: string, value?: number) => {
    if (!text && !value) return { prefix: '$', amount: '25.00' };
    const rangeMatch = text?.match(/\$?(\d+)\s*[-–]\s*\$?(\d+)/);
    if (rangeMatch && rangeMatch[1] && rangeMatch[2]) {
      return { prefix: '$', amount: `${rangeMatch[1]}–$${rangeMatch[2]}` };
    }
    const numMatch = text?.match(/\$?(\d+(\.\d+)?)/);
    if (numMatch && numMatch[1]) {
      const num = parseFloat(numMatch[1]);
      return { prefix: '$', amount: num % 1 === 0 ? `${num}.00` : num.toFixed(2) };
    }
    if (value && value > 0) {
      return { prefix: '$', amount: value % 1 === 0 ? `${value}.00` : value.toFixed(2) };
    }
    if (text?.toLowerCase().includes('sc') || text?.toLowerCase().includes('free')) {
      return { prefix: '⭐', amount: text.replace(/[•$]/g, '').trim() };
    }
    return { prefix: '$', amount: text || '25.00' };
  };

  const payout = formatPayoutDisplay(offer.payout, offer.rewardValue);

  return (
    <div
      id={`offer-card-${offer.id}`}
      onClick={() => onSelectOffer(offer)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectOffer(offer);
        }
      }}
      className={`group relative flex flex-col justify-between flex-shrink-0 select-none cursor-pointer rounded-2xl bg-[#131622] hover:bg-[#181d2c] border border-[#22293c] hover:border-emerald-500/70 p-2.5 transition-all duration-200 hover:-translate-y-1 shadow-md hover:shadow-emerald-950/40 ${
        isCompact
          ? 'w-[150px] sm:w-[165px] h-[215px] sm:h-[225px]'
          : 'w-[170px] sm:w-[185px] h-[245px] sm:h-[255px]'
      } ${className}`}
    >
      {/* 1. TOP ARTWORK / LOGO CONTAINER */}
      <div
        className={`w-full rounded-xl bg-[#0c0e16] border border-[#1d2334] relative flex items-center justify-center p-2.5 overflow-hidden flex-shrink-0 group-hover:border-emerald-500/40 transition-colors ${
          isCompact ? 'h-[110px] sm:h-[118px]' : 'h-[130px] sm:h-[140px]'
        }`}
      >
        {/* High-resolution logo centered */}
        {logoSrc ? (
          <img
            src={logoSrc}
            alt={offer.name}
            className="max-h-full max-w-full w-auto h-auto object-contain rounded-md drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <span className="text-xl sm:text-2xl font-black text-emerald-400 tracking-wider">
              {initialsOf(offer.name)}
            </span>
          </div>
        )}
      </div>

      {/* Code button underneath image - fully visible & click-to-copy */}
      {offer.code && (
        <button
          type="button"
          onClick={handleCopyCode}
          title="Click to copy promo code"
          aria-label={`Copy code ${offer.code}`}
          className={`mt-1.5 w-full flex items-center justify-between gap-1 px-2 py-1 rounded-lg border transition-all cursor-pointer ${
            copied
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
          {copied ? (
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

      {/* 2. TEXT INFORMATION (Gemsloot layout) */}
      <div className="flex flex-col items-start text-left w-full min-w-0 pt-1.5 px-1">
        {/* Offer Name */}
        <h4 className="w-full truncate text-xs sm:text-[13px] font-bold text-white group-hover:text-emerald-300 transition-colors leading-tight">
          {offer.name}
        </h4>

        {/* Payout Display (e.g. $ 25.00 matching Gemsloot $ 632.35) */}
        <div className="w-full flex items-center gap-1 mt-1 truncate">
          <span className="text-xs sm:text-sm font-black text-emerald-400">
            {payout.prefix}
          </span>
          <span className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-none">
            {payout.amount}
          </span>
        </div>

        {/* Secondary Info (Code or instruction) */}
        <p className="w-full truncate text-[10px] sm:text-[11px] font-semibold text-slate-400 mt-1">
          {offer.code ? `Code: ${offer.code}` : offer.payoutTag || 'Verified Instant'}
        </p>
      </div>
    </div>
  );
};

