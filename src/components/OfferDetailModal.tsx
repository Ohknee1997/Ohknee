import React, { useState, useEffect } from 'react';
import { EnrichedOffer } from '../data/enrichedOffers';
import { CardDetail } from '../types';
import { initialsOf, copyTextToClipboard } from '../utils';
import { trackCodeClipped, trackOfferLinkClick } from '../utils/trafficTracker';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Monitor,
  Smartphone,
  Apple,
  Star,
} from 'lucide-react';

interface OfferDetailModalProps {
  offer: EnrichedOffer | null;
  detail?: CardDetail;
  isSaved: boolean;
  onToggleSave: (offerId: string) => void;
  onUpdateDetail?: (cardId: string, detail: CardDetail) => void;
  onClose: () => void;
}

export const OfferDetailModal: React.FC<OfferDetailModalProps> = ({
  offer,
  isSaved,
  onToggleSave,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!offer) return null;

  // Extract and compute dynamic accent color matching the clicked app square
  const accentRgb = offer.accentRgb || '34, 197, 94';
  const accentColor = `rgb(${accentRgb})`;
  const accentBorderColor = `rgba(${accentRgb}, 0.35)`;
  const accentLightBg = `rgba(${accentRgb}, 0.08)`;
  const accentShadow = `0 8px 24px -4px rgba(${accentRgb}, 0.45)`;

  const rawLogoSrc =
    offer.logoUrl ||
    (offer.domain
      ? `https://www.google.com/s2/favicons?domain=${offer.domain}&sz=256`
      : undefined);

  const logoSrc = imgError ? undefined : rawLogoSrc;

  const handleCopyCode = () => {
    if (!offer.code) return;
    trackCodeClipped({
      id: offer.id,
      name: offer.name,
      code: offer.code,
      payout: offer.payout,
      tabId: offer.tabId,
    });
    copyTextToClipboard(offer.code).then((ok) => {
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    });
  };

  const handleStartOffer = () => {
    trackOfferLinkClick({
      id: offer.id,
      name: offer.name,
      signupUrl: offer.signupUrl,
      tabId: offer.tabId,
    });
    window.open(offer.signupUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id="offer-detail-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id={`offer-detail-modal-${offer.id}`}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 flex flex-col no-scrollbar animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar: Save & Close */}
        <div className="flex items-center justify-between px-5 pt-4 pb-1">
          <button
            type="button"
            onClick={() => onToggleSave(offer.id)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
              isSaved
                ? 'border-amber-400 bg-amber-100/80 text-amber-900'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title={isSaved ? 'Saved in My Offers' : 'Save to My Offers'}
          >
            <Star size={13} fill={isSaved ? 'currentColor' : 'none'} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close offer details"
          >
            <X size={18} />
          </button>
        </div>

        {/* Centered App Branding Header */}
        <div className="flex flex-col items-center text-center px-6 pt-1 pb-4">
          {/* Logo artwork container */}
          <div
            className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-slate-50 border p-2 shadow-sm mb-3"
            style={{ borderColor: accentBorderColor }}
          >
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={offer.name}
                className="h-full w-full object-contain rounded-xl"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-xl sm:text-2xl font-black" style={{ color: accentColor }}>
                {initialsOf(offer.name)}
              </span>
            )}
          </div>

          {/* App Title & Verified */}
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {offer.name}
            </h2>
            <span
              className="flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
              title="Verified partner link"
            >
              <ShieldCheck size={13} />
              <span>Verified</span>
            </span>
          </div>

          {/* Domain & Device Support */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            {offer.domain && <span>{offer.domain}</span>}
            <span>•</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span title="Desktop"><Monitor size={12} /></span>
              <span title="Android"><Smartphone size={12} /></span>
              <span title="iOS"><Apple size={12} /></span>
            </div>
          </div>
        </div>

        {/* Centered Main Modal Content */}
        <div className="p-5 pt-1 space-y-4 text-center flex flex-col items-center w-full">
          {/* 1. Primary Reward Box (Centered, with color matching the app square) */}
          <div
            className="w-full rounded-2xl border p-5 shadow-xs flex flex-col items-center text-center transition-all"
            style={{
              borderColor: accentBorderColor,
              backgroundColor: accentLightBg,
            }}
          >
            <span
              className="text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full border mb-1.5"
              style={{
                color: accentColor,
                borderColor: accentBorderColor,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              Exclusive Reward
            </span>

            <h3
              className="text-2xl sm:text-3xl font-black leading-tight tracking-tight mt-0.5"
              style={{ color: accentColor }}
            >
              {offer.rewardDisplay || offer.payout}
            </h3>

            {offer.instructionSub && (
              <p className="mt-1.5 text-xs text-slate-700 font-medium max-w-xs leading-relaxed">
                💡 {offer.instructionSub}
              </p>
            )}

            {/* Primary Action Button (Colored to match the square's app color instead of orange) */}
            <button
              type="button"
              id={`claim-offer-btn-${offer.id}`}
              onClick={handleStartOffer}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-3 px-6 text-sm font-black text-white transition-all cursor-pointer active:scale-95 hover:opacity-95"
              style={{
                backgroundColor: accentColor,
                boxShadow: accentShadow,
              }}
            >
              <span>START OFFER NOW</span>
              <ExternalLink size={16} />
            </button>
          </div>

          {/* 2. Promo / Referral Code Section (Centered, with app-matched color) */}
          {offer.code && (
            <div
              className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 flex flex-col items-center text-center"
            >
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                Promo / Referral Code
              </p>
              <p className="text-xl sm:text-2xl font-mono font-black text-slate-900 mt-1 tracking-wider">
                {offer.code}
              </p>

              <button
                type="button"
                id={`copy-code-btn-${offer.id}`}
                onClick={handleCopyCode}
                className="mt-2.5 flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold transition-all cursor-pointer active:scale-95 w-full sm:w-auto min-w-[140px]"
                style={{
                  borderColor: copied ? accentColor : accentBorderColor,
                  color: accentColor,
                  backgroundColor: copied ? accentLightBg : 'white',
                }}
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>COPY CODE</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Note: All sections below referral code (Secret Sauce, proof photos, notes, how-to) have been completely removed per user request */}
        </div>
      </div>
    </div>
  );
};

