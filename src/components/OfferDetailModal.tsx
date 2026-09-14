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
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface OfferDetailModalProps {
  offer: EnrichedOffer | null;
  detail?: CardDetail;
  isSaved: boolean;
  onToggleSave: (offerId: string) => void;
  onUpdateDetail?: (cardId: string, detail: CardDetail) => void;
  onClose: () => void;
}

interface FoggyGlassVariant {
  id: number;
  name: string;
  shapeTag: string;
  containerClass: string;
  containerStyle?: React.CSSProperties;
  glassBg: string;
  borderStyle: string;
  badgeColor: string;
}

const FOGGY_GLASS_VARIANTS: FoggyGlassVariant[] = [
  {
    id: 1,
    name: 'Cyber Frost Prism',
    shapeTag: 'Hex Chamfered Cut',
    containerClass: 'w-full max-w-[420px]',
    containerStyle: {
      clipPath: 'polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)',
    },
    glassBg: 'bg-slate-950/40 backdrop-blur-2xl',
    borderStyle: 'border-2 border-cyan-400/80 shadow-[0_0_35px_rgba(34,211,238,0.35)]',
    badgeColor: 'text-cyan-300 border-cyan-400/40 bg-cyan-950/50',
  },
  {
    id: 2,
    name: 'Frosted Pill Capsule',
    shapeTag: 'Ultra Smooth Pill (38px)',
    containerClass: 'w-full max-w-[380px] rounded-[38px]',
    glassBg: 'bg-white/12 backdrop-blur-3xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.45)]',
    borderStyle: 'border-2 border-white/50 shadow-[0_12px_45px_rgba(255,255,255,0.2)]',
    badgeColor: 'text-white border-white/40 bg-white/10',
  },
  {
    id: 3,
    name: 'Smoked Obsidian Minimalist',
    shapeTag: 'Sharp Geometric Squircle',
    containerClass: 'w-full max-w-[440px] rounded-xl',
    glassBg: 'bg-black/60 backdrop-blur-3xl',
    borderStyle: 'border-2 border-zinc-400/60 ring-1 ring-zinc-700/60 shadow-[0_15px_50px_rgba(0,0,0,0.9)]',
    badgeColor: 'text-zinc-300 border-zinc-400/40 bg-zinc-900/60',
  },
  {
    id: 4,
    name: 'Radiant Sunset Amber',
    shapeTag: 'Widescreen Soft Squircle',
    containerClass: 'w-full max-w-[480px] rounded-3xl',
    glassBg: 'bg-amber-950/30 backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(251,191,36,0.3)]',
    borderStyle: 'border-2 border-amber-400/85 shadow-[0_0_40px_rgba(251,191,36,0.4)]',
    badgeColor: 'text-amber-300 border-amber-400/40 bg-amber-950/60',
  },
  {
    id: 5,
    name: 'Asymmetric Emerald Leaf',
    shapeTag: 'Opposing Corner Radii',
    containerClass: 'w-full max-w-[390px] rounded-tl-[48px] rounded-br-[48px] rounded-tr-xl rounded-bl-xl',
    glassBg: 'bg-emerald-950/30 backdrop-blur-2xl',
    borderStyle: 'border-2 border-emerald-400/80 shadow-[0_0_35px_rgba(52,211,153,0.4)]',
    badgeColor: 'text-emerald-300 border-emerald-400/40 bg-emerald-950/60',
  },
  {
    id: 6,
    name: 'Retro TV Convex Bezel',
    shapeTag: 'Chunky CRT Glass (5px)',
    containerClass: 'w-full max-w-[430px] rounded-[32px]',
    glassBg: 'bg-slate-900/45 backdrop-blur-2xl shadow-[inset_0_3px_8px_rgba(255,255,255,0.5)]',
    borderStyle: 'border-[5px] border-slate-200/50 shadow-[0_15px_45px_rgba(0,0,0,0.7)]',
    badgeColor: 'text-slate-200 border-slate-300/40 bg-slate-800/60',
  },
  {
    id: 7,
    name: 'Cyberpunk Violet Slate',
    shapeTag: 'Widescreen Neon Matrix',
    containerClass: 'w-full max-w-[490px] rounded-2xl',
    glassBg: 'bg-purple-950/35 backdrop-blur-2xl',
    borderStyle: 'border-2 border-fuchsia-400/85 shadow-[0_0_40px_rgba(232,121,249,0.45)]',
    badgeColor: 'text-fuchsia-300 border-fuchsia-400/40 bg-purple-950/60',
  },
  {
    id: 8,
    name: 'Industrial Blueprint Grid',
    shapeTag: 'Dashed Cyan Wireframe',
    containerClass: 'w-full max-w-[370px] rounded-lg',
    glassBg: 'bg-sky-950/25 backdrop-blur-xl',
    borderStyle: 'border-2 border-dashed border-sky-400/75 shadow-[0_0_25px_rgba(56,189,248,0.3)]',
    badgeColor: 'text-sky-300 border-sky-400/40 bg-sky-950/60',
  },
  {
    id: 9,
    name: 'Liquid Pebble Morph',
    shapeTag: 'Organic Flow Pebble',
    containerClass: 'w-full max-w-[410px] rounded-[44px_18px_44px_18px]',
    glassBg: 'bg-slate-900/40 backdrop-blur-3xl shadow-[inset_0_1px_3px_rgba(244,114,182,0.35)]',
    borderStyle: 'border-2 border-pink-400/70 shadow-[0_0_30px_rgba(244,114,182,0.35)]',
    badgeColor: 'text-pink-300 border-pink-400/40 bg-pink-950/60',
  },
  {
    id: 10,
    name: 'Ultra-Sheer Ghost Frost',
    shapeTag: 'Pure High Transparency',
    containerClass: 'w-full max-w-[450px] rounded-3xl',
    glassBg: 'bg-white/[0.07] backdrop-blur-md',
    borderStyle: 'border border-white/40 shadow-[0_12px_40px_rgba(0,0,0,0.7)]',
    badgeColor: 'text-white border-white/30 bg-white/5',
  },
];

export const OfferDetailModal: React.FC<OfferDetailModalProps> = ({
  offer,
  isSaved,
  onToggleSave,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Compute default variant from offer orderNumber or ID (Card 1 -> Style 1, Card 2 -> Style 2, etc.)
  const defaultVariantIndex = offer?.orderNumber
    ? (offer.orderNumber - 1) % FOGGY_GLASS_VARIANTS.length
    : offer
    ? Math.abs(offer.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % FOGGY_GLASS_VARIANTS.length
    : 0;

  const [activeVariantIndex, setActiveVariantIndex] = useState(defaultVariantIndex);

  // When offer changes, update default active style
  useEffect(() => {
    setActiveVariantIndex(defaultVariantIndex);
  }, [defaultVariantIndex]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!offer) return null;

  const currentVariant = FOGGY_GLASS_VARIANTS[activeVariantIndex] || FOGGY_GLASS_VARIANTS[0];

  const handlePrevVariant = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveVariantIndex((prev) => (prev > 0 ? prev - 1 : FOGGY_GLASS_VARIANTS.length - 1));
  };

  const handleNextVariant = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveVariantIndex((prev) => (prev + 1) % FOGGY_GLASS_VARIANTS.length);
  };

  // Extract and compute dynamic accent color matching the clicked app square
  const accentRgb = offer.accentRgb || '34, 197, 94';
  const accentColor = `rgb(${accentRgb})`;
  const accentBorderColor = `rgba(${accentRgb}, 0.5)`;
  const accentLightBg = `rgba(${accentRgb}, 0.15)`;
  const accentShadow = `0 8px 24px -4px rgba(${accentRgb}, 0.55)`;

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/35 backdrop-blur-[2px] animate-in fade-in duration-150 select-none overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Foggy Glass Window Modal */}
      <div
        id={`offer-detail-modal-${offer.id}`}
        style={currentVariant.containerStyle}
        className={`relative ${currentVariant.containerClass} ${currentVariant.glassBg} ${currentVariant.borderStyle} max-h-[92vh] overflow-y-auto text-white flex flex-col no-scrollbar transition-all duration-200 animate-in zoom-in-95`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Style Preview Switcher Header Bar (Lets the user test and compare all 10 styles easily!) */}
        <div className="w-full bg-black/40 border-b border-white/10 px-3 py-2 flex items-center justify-between text-xs backdrop-blur-md">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
              <Sparkles size={13} className="text-amber-400" />
              <span>Style {currentVariant.id}/10:</span>
            </span>
            <span className="font-extrabold text-white truncate max-w-[140px] sm:max-w-[200px]">
              {currentVariant.name}
            </span>
            <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded-full border border-white/20 text-slate-300 bg-white/5">
              {currentVariant.shapeTag}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button
              type="button"
              onClick={handlePrevVariant}
              className="flex items-center justify-center h-6 w-6 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
              title="Previous Style"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={handleNextVariant}
              className="flex items-center justify-center h-6 w-6 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
              title="Next Style"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Top Action Bar: Save & Close */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          <button
            type="button"
            onClick={() => onToggleSave(offer.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer backdrop-blur-md ${
              isSaved
                ? 'border-amber-400 bg-amber-400/25 text-amber-300'
                : 'border-white/20 bg-white/10 text-slate-200 hover:text-white hover:bg-white/20'
            }`}
            title={isSaved ? 'Saved in My Offers' : 'Save to My Offers'}
          >
            <Star size={13} fill={isSaved ? 'currentColor' : 'none'} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/15 backdrop-blur-md"
            aria-label="Close offer details"
          >
            <X size={18} />
          </button>
        </div>

        {/* Centered App Branding Header */}
        <div className="flex flex-col items-center text-center px-6 pt-1 pb-3">
          {/* Logo artwork container inside frosted glass */}
          <div
            className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-black/40 border p-2 shadow-lg mb-2.5 backdrop-blur-md"
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
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {offer.name}
            </h2>
            <span
              className="flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 backdrop-blur-sm"
              title="Verified partner link"
            >
              <ShieldCheck size={13} />
              <span>Verified</span>
            </span>
          </div>

          {/* Domain & Device Support */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-300 font-medium">
            {offer.domain && <span>{offer.domain}</span>}
            <span>•</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span title="Desktop"><Monitor size={12} /></span>
              <span title="Android"><Smartphone size={12} /></span>
              <span title="iOS"><Apple size={12} /></span>
            </div>
          </div>
        </div>

        {/* Centered Main Modal Content */}
        <div className="p-5 pt-1 space-y-3.5 text-center flex flex-col items-center w-full">
          {/* 1. Primary Reward Box (Translucent Frosted Glass Card) */}
          <div
            className="w-full rounded-2xl border p-5 shadow-lg flex flex-col items-center text-center transition-all backdrop-blur-xl"
            style={{
              borderColor: accentBorderColor,
              backgroundColor: accentLightBg,
            }}
          >
            <span
              className="text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full border mb-1.5 backdrop-blur-md"
              style={{
                color: accentColor,
                borderColor: accentBorderColor,
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
              }}
            >
              Exclusive Reward
            </span>

            <h3
              className="text-2xl sm:text-3xl font-black leading-tight tracking-tight mt-0.5 drop-shadow-md"
              style={{ color: accentColor }}
            >
              {offer.rewardDisplay || offer.payout}
            </h3>

            {offer.instructionSub && (
              <p className="mt-2 text-xs text-slate-200 font-medium max-w-xs leading-relaxed drop-shadow-sm">
                💡 {offer.instructionSub}
              </p>
            )}

            {/* Primary Action Button */}
            <button
              type="button"
              id={`claim-offer-btn-${offer.id}`}
              onClick={handleStartOffer}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-3 px-6 text-sm font-black text-white transition-all cursor-pointer active:scale-95 hover:opacity-95 shadow-lg"
              style={{
                backgroundColor: accentColor,
                boxShadow: accentShadow,
              }}
            >
              <span>START OFFER NOW</span>
              <ExternalLink size={16} />
            </button>
          </div>

          {/* 2. Promo / Referral Code Section (Frosted Translucent Box) */}
          {offer.code && (
            <div className="w-full rounded-2xl bg-black/45 border border-white/20 p-4 flex flex-col items-center text-center backdrop-blur-xl">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300">
                Promo / Referral Code
              </p>
              <p className="text-xl sm:text-2xl font-mono font-black text-white mt-1 tracking-wider drop-shadow-md">
                {offer.code}
              </p>

              <button
                type="button"
                id={`copy-code-btn-${offer.id}`}
                onClick={handleCopyCode}
                className="mt-2.5 flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold transition-all cursor-pointer active:scale-95 w-full sm:w-auto min-w-[140px] backdrop-blur-md"
                style={{
                  borderColor: copied ? accentColor : 'rgba(255, 255, 255, 0.25)',
                  color: copied ? accentColor : '#ffffff',
                  backgroundColor: copied ? accentLightBg : 'rgba(255, 255, 255, 0.1)',
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

          {/* Helper hint for user */}
          <p className="text-[11px] text-slate-400/90 italic pt-1">
            Tap arrows above to preview other foggy glass styles
          </p>
        </div>
      </div>
    </div>
  );
};

