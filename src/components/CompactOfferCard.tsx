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
    const trimmed = text?.trim() || '';
    if (trimmed.toLowerCase().includes('free card')) {
      return { prefix: '', amount: 'Free Cards' };
    }
    // ReBet and Onyx: Ensure dollar signs in front as requested
    if (trimmed === '100' || trimmed === '$100') {
      return { prefix: '$', amount: '100' };
    }
    if (trimmed === '150' || trimmed === '$150') {
      return { prefix: '$', amount: '150' };
    }
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
    return { prefix: '$', amount: text?.replace(/^\$/, '') || '25.00' };
  };

  const payout = formatPayoutDisplay(offer.payout, offer.rewardValue);

  // Theme-matched custom color styles for the box background and borders
  const accentRgb = offer.accentRgb || '59, 130, 246';
  const cardBgStyle = {
    backgroundColor: `rgba(${accentRgb}, 0.12)`,
    borderColor: `rgba(${accentRgb}, 0.35)`,
    boxShadow: `0 4px 14px -3px rgba(${accentRgb}, 0.25)`,
  };
  const innerArtBgStyle = {
    backgroundColor: `rgba(${accentRgb}, 0.16)`,
    borderColor: `rgba(${accentRgb}, 0.40)`,
  };
  const accentTextStyle = {
    color: `rgb(${accentRgb})`,
  };

  const hasCode = Boolean(offer.code && offer.code.trim().length > 0);

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
      style={cardBgStyle}
      className={`group relative flex flex-col justify-between flex-shrink-0 select-none cursor-pointer rounded-2xl border p-3.5 transition-all duration-200 hover:-translate-y-1.5 hover:brightness-110 shadow-lg ${
        isCompact
          ? 'w-[195px] sm:w-[215px] h-[280px] sm:h-[300px]'
          : 'w-[230px] sm:w-[255px] md:w-[275px] h-[325px] sm:h-[350px] md:h-[370px]'
      } ${className}`}
    >
      {/* 1. TOP ARTWORK / LOGO CONTAINER */}
      <div
        style={innerArtBgStyle}
        className={`w-full rounded-xl border relative flex items-center justify-center p-3 overflow-hidden flex-shrink-0 transition-colors ${
          isCompact ? 'h-[140px] sm:h-[155px]' : 'h-[170px] sm:h-[190px] md:h-[205px]'
        }`}
      >
        {/* High-resolution logo centered */}
        {logoSrc ? (
          <img
            src={logoSrc}
            alt={offer.name}
            className="max-h-full max-w-full w-auto h-auto object-contain rounded-md drop-shadow-md group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <span style={accentTextStyle} className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wider">
              {initialsOf(offer.name)}
            </span>
          </div>
        )}
      </div>

      {/* Code button underneath image - fully visible & click-to-copy */}
      {hasCode && (
        <button
          type="button"
          onClick={handleCopyCode}
          title="Click to copy promo code"
          aria-label={`Copy code ${offer.code}`}
          style={{
            borderColor: `rgba(${accentRgb}, 0.45)`,
            backgroundColor: copied ? `rgba(${accentRgb}, 0.28)` : `rgba(15, 18, 29, 0.85)`,
          }}
          className="mt-2 w-full flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer text-white"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 uppercase tracking-wider flex-shrink-0">
              CODE:
            </span>
            <span className="text-xs sm:text-sm font-mono font-black tracking-wide text-white truncate">
              {offer.code}
            </span>
          </div>
          {copied ? (
            <span
              style={{
                backgroundColor: `rgba(${accentRgb}, 0.35)`,
                borderColor: `rgba(${accentRgb}, 0.65)`,
                color: '#fff',
              }}
              className="flex items-center gap-1 text-[10px] font-extrabold flex-shrink-0 px-1.5 py-0.5 rounded-lg border"
            >
              <Check size={11} />
              COPIED
            </span>
          ) : (
            <span
              style={accentTextStyle}
              className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold flex-shrink-0"
            >
              <Copy size={11} />
              COPY
            </span>
          )}
        </button>
      )}

      {/* 2. TEXT INFORMATION: Centered and uniform */}
      <div className="flex flex-col w-full min-w-0 pt-2.5 px-1 items-center text-center justify-center mt-auto">
        {/* Offer Name */}
        <h4 className="w-full truncate text-sm sm:text-base md:text-lg font-black text-white group-hover:underline transition-colors leading-tight text-center">
          {offer.name}
        </h4>

        {/* Payout Display - Centered */}
        <div className="w-full flex items-center justify-center gap-1 mt-1.5 truncate text-center">
          {payout.prefix && (
            <span style={accentTextStyle} className="text-base sm:text-lg md:text-xl font-black">
              {payout.prefix}
            </span>
          )}
          <span className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-none">
            {payout.amount}
          </span>
        </div>

        {/* Secondary Info (Code or instruction) */}
        <p className="w-full truncate text-xs sm:text-sm font-semibold text-slate-300 mt-1.5 text-center">
          {offer.code ? `Code: ${offer.code}` : offer.payoutTag || 'Verified Instant'}
        </p>
      </div>
    </div>
  );
};

