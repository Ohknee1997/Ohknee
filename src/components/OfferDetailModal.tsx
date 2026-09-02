import React, { useState, useRef, useEffect } from 'react';
import { EnrichedOffer } from '../data/enrichedOffers';
import { CardDetail } from '../types';
import { initialsOf, copyTextToClipboard } from '../utils';
import { trackCodeClipped, trackOfferLinkClick } from '../utils/trafficTracker';
import { ImageLightboxModal } from './ImageLightboxModal';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Monitor,
  Smartphone,
  Apple,
  Upload,
  Trash2,
  Maximize2,
  Lock,
  Sparkles,
  HelpCircle,
  FileText,
  Star,
} from 'lucide-react';

interface OfferDetailModalProps {
  offer: EnrichedOffer | null;
  detail: CardDetail;
  isSaved: boolean;
  onToggleSave: (offerId: string) => void;
  onUpdateDetail: (cardId: string, detail: CardDetail) => void;
  onClose: () => void;
}

export const OfferDetailModal: React.FC<OfferDetailModalProps> = ({
  offer,
  detail,
  isSaved,
  onToggleSave,
  onUpdateDetail,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [note, setNote] = useState(detail.note || '');
  const [link2, setLink2] = useState(detail.link2 || '');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when detail changes
  useEffect(() => {
    setNote(detail.note || '');
    setLink2(detail.link2 || '');
  }, [detail]);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!offer) return null;

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

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNote(val);
    onUpdateDetail(offer.id, { ...detail, note: val });
  };

  const handleLink2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setLink2(val);
    onUpdateDetail(offer.id, { ...detail, link2: val });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newImg = String(reader.result);
      const updatedImages = [...(detail.images || []), newImg];
      onUpdateDetail(offer.id, { ...detail, images: updatedImages });
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const updatedImages = (detail.images || []).filter((_, i) => i !== index);
    onUpdateDetail(offer.id, { ...detail, images: updatedImages });
  };

  const images = detail.images || [];

  return (
    <>
      <div
        id="offer-detail-backdrop"
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          id={`offer-detail-modal-${offer.id}`}
          className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white border border-purple-200 shadow-2xl text-slate-900 flex flex-col no-scrollbar animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-purple-100 bg-white/95 px-5 py-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 p-1 shadow-xs">
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    alt={offer.name}
                    className="h-full w-full object-contain rounded-lg"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span className="text-base font-black text-purple-700">
                    {initialsOf(offer.name)}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black tracking-tight text-slate-900">
                    {offer.name}
                  </h2>
                  <span className="flex items-center gap-1 text-emerald-700 text-xs font-bold" title="Verified partner link">
                    <ShieldCheck size={14} />
                    <span className="hidden sm:inline">Verified</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  {offer.domain && <span>{offer.domain}</span>}
                  <span>•</span>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Monitor size={11} title="Desktop" />
                    <Smartphone size={11} title="Android" />
                    <Apple size={11} title="iOS" />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Save & Close */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onToggleSave(offer.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  isSaved
                    ? 'border-amber-400 bg-amber-100/80 text-amber-900'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={isSaved ? 'Saved in My Offers' : 'Save to My Offers'}
              >
                <Star size={13} fill={isSaved ? 'currentColor' : 'none'} />
                <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                aria-label="Close offer details"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Modal Body Content */}
          <div className="p-5 space-y-5">
            {/* Primary Reward Box */}
            <div className="rounded-xl bg-gradient-to-br from-amber-50 via-purple-50 to-sky-50 border border-amber-200 p-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700">
                    Exclusive Reward
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-emerald-800 leading-tight">
                    {offer.rewardDisplay}
                  </h3>
                  {offer.instructionSub && (
                    <p className="mt-1 text-xs text-slate-700 font-medium">
                      💡 {offer.instructionSub}
                    </p>
                  )}
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  id={`claim-offer-btn-${offer.id}`}
                  onClick={handleStartOffer}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 px-5 py-3 text-sm font-black text-white shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all cursor-pointer active:scale-95"
                >
                  <span>START OFFER NOW</span>
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>

            {/* Promo Code Section (if present) */}
            {offer.code && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Promo / Referral Code
                    </p>
                    <p className="text-base font-mono font-black text-purple-900 mt-0.5">
                      {offer.code}
                    </p>
                  </div>

                  <button
                    type="button"
                    id={`copy-code-btn-${offer.id}`}
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 rounded-lg bg-purple-100 border border-purple-200 px-3 py-2 text-xs font-bold text-purple-900 hover:bg-purple-200 transition-all cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        <span className="text-emerald-700">COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>COPY CODE</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* How to Complete Step-by-step */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
                <FileText size={14} className="text-amber-600" />
                <span>How to Complete & Withdraw</span>
              </h4>

              <ol className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-black text-amber-700 border border-slate-300">
                    1
                  </span>
                  <span>
                    Click <strong>"START OFFER NOW"</strong> to open the official partner registration page.
                  </span>
                </li>
                {offer.code && (
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-black text-amber-700 border border-slate-300">
                      2
                    </span>
                    <span>
                      Apply code <strong className="font-mono text-purple-900">{offer.code}</strong> during sign up if prompted.
                    </span>
                  </li>
                )}
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-black text-amber-700 border border-slate-300">
                    {offer.code ? '3' : '2'}
                  </span>
                  <span>
                    Complete basic phone or ID verification to unlock instant cashout eligibility.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-black text-amber-700 border border-slate-300">
                    {offer.code ? '4' : '3'}
                  </span>
                  <span>
                    {offer.instructionSub || 'Claim your bonus and transfer your rewards directly to Coinbase or bank.'}
                  </span>
                </li>
              </ol>
            </div>

            {/* SECRET SAUCE: Private Notes & Proof Screenshot Archive */}
            <div className="rounded-xl bg-purple-50/50 border border-purple-200/80 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🌶️</span>
                  <h4 className="text-xs font-black uppercase tracking-wider text-purple-900">
                    SECRET SAUCE STRATEGY & PROOF
                  </h4>
                </div>
                <span className="text-[10px] text-slate-500">
                  Saved on this device
                </span>
              </div>

              <p className="text-[11px] text-slate-600 mb-3">
                Private steps, login used, wagering notes, or tricks to cash out maximum profit.
              </p>

              {/* Strategy Note Textarea */}
              <textarea
                value={note}
                onChange={handleNoteChange}
                placeholder="Type your personal strategy, deposit amount used, payout verification status, or quick tips here..."
                rows={3}
                className="w-full rounded-lg bg-white border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-purple-400 focus:outline-none transition-colors"
              />

              {/* Optional Secondary Link */}
              <div className="mt-3">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-600 block mb-1">
                  Optional Secondary Link / Reference URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={link2}
                    onChange={handleLink2Change}
                    placeholder="https://secondary-reference-or-cashout-link.com"
                    className="flex-1 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-purple-400 focus:outline-none"
                  />
                  {link2 && (
                    <button
                      type="button"
                      onClick={() => window.open(link2, '_blank')}
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900"
                      title="Open secondary link"
                    >
                      <ExternalLink size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Proof Screenshots Gallery */}
              <div className="mt-4 pt-3 border-t border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-700">
                    Proof Screenshots ({images.length}/2)
                  </span>

                  {images.length < 2 && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 cursor-pointer"
                      >
                        <Upload size={12} />
                        <span>Upload Proof Photo</span>
                      </button>
                    </>
                  )}
                </div>

                {images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {images.map((imgSrc, idx) => (
                      <div
                        key={idx}
                        className="group relative h-28 rounded-lg overflow-hidden border border-slate-700/80 bg-slate-950 cursor-pointer"
                        onClick={() => {
                          setLightboxIndex(idx);
                          setLightboxOpen(true);
                        }}
                      >
                        <img
                          src={imgSrc}
                          alt={`Proof ${idx + 1}`}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            className="p-1 rounded bg-black/60 text-white hover:bg-black"
                            title="Expand photo"
                          >
                            <Maximize2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveImage(e, idx)}
                            className="p-1 rounded bg-red-600/80 text-white hover:bg-red-600"
                            title="Remove photo"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic py-1">
                    No proof photos attached yet. You can upload cashout confirmations or registration screenshots here.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proof Lightbox */}
      <ImageLightboxModal
        isOpen={lightboxOpen}
        images={images}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
};
