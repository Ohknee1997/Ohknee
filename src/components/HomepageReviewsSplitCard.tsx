import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, CheckCircle2, Settings, Mail, Copy, Check, Instagram } from 'lucide-react';
import { recordDeviceClick } from '../utils/deviceAnalytics';

const STORE_TRUSTPILOT_URL = 'ohknee_trustpilot_url';
const STORE_GOOGLE_REVIEWS_URL = 'ohknee_google_reviews_url';
const STORE_INSTAGRAM_URL = 'ohknee_instagram_url';

export const TRUSTPILOT_INVITE_EMAIL = 'ohknee.com+5874d9006b@invite.trustpilot.com';
const DEFAULT_TRUSTPILOT_URL = 'https://www.trustpilot.com/review/ohknee.com';
const DEFAULT_GOOGLE_REVIEWS_URL = 'https://www.google.com/search?q=ohknee+reviews';
const DEFAULT_INSTAGRAM_URL = 'https://www.instagram.com/oh_knee97?stkn=ZW9iNzdubDdxdW1o';

interface HomepageReviewsSplitCardProps {
  onExploreClick?: () => void;
}

export const HomepageReviewsSplitCard: React.FC<HomepageReviewsSplitCardProps> = () => {
  const [trustpilotUrl, setTrustpilotUrl] = useState<string>(() => {
    try {
      return localStorage.getItem(STORE_TRUSTPILOT_URL) || DEFAULT_TRUSTPILOT_URL;
    } catch {
      return DEFAULT_TRUSTPILOT_URL;
    }
  });

  const [googleReviewsUrl, setGoogleReviewsUrl] = useState<string>(() => {
    try {
      return localStorage.getItem(STORE_GOOGLE_REVIEWS_URL) || DEFAULT_GOOGLE_REVIEWS_URL;
    } catch {
      return DEFAULT_GOOGLE_REVIEWS_URL;
    }
  });

  const [instagramUrl, setInstagramUrl] = useState<string>(() => {
    try {
      return localStorage.getItem(STORE_INSTAGRAM_URL) || DEFAULT_INSTAGRAM_URL;
    } catch {
      return DEFAULT_INSTAGRAM_URL;
    }
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTrustpilot, setEditTrustpilot] = useState(trustpilotUrl);
  const [editGoogle, setEditGoogle] = useState(googleReviewsUrl);
  const [editInstagram, setEditInstagram] = useState(instagramUrl);
  const [isEmailCopied, setIsEmailCopied] = useState(false);

  const handleOpenLink = (url: string, platformName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    recordDeviceClick({
      targetId: `review-box-${platformName.toLowerCase()}`,
      targetTag: 'review_card',
      text: `Link Click: ${platformName}`,
      context: 'homepage_hero_reviews_split_3col',
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSaveLinks = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTrustpilot = editTrustpilot.trim() || DEFAULT_TRUSTPILOT_URL;
    const finalGoogle = editGoogle.trim() || DEFAULT_GOOGLE_REVIEWS_URL;
    const finalInstagram = editInstagram.trim() || DEFAULT_INSTAGRAM_URL;
    setTrustpilotUrl(finalTrustpilot);
    setGoogleReviewsUrl(finalGoogle);
    setInstagramUrl(finalInstagram);
    try {
      localStorage.setItem(STORE_TRUSTPILOT_URL, finalTrustpilot);
      localStorage.setItem(STORE_GOOGLE_REVIEWS_URL, finalGoogle);
      localStorage.setItem(STORE_INSTAGRAM_URL, finalInstagram);
    } catch {
      // Storage unavailable
    }
    setIsEditModalOpen(false);
  };

  return (
    <>
      {/* BOX THE EXACT SAME SIZE AS THE ORIGINAL HOMEPAGE HERO PHOTO */}
      <div
        id="homepage-reviews-split-card"
        className="relative w-full max-w-2xl sm:max-w-3xl rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-700/80 bg-[#070b13] shadow-2xl shadow-black/80 group my-1.5 sm:my-2.5 flex-shrink-0"
      >
        <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] min-h-[175px] sm:min-h-[200px] max-h-[200px] sm:max-h-[230px] md:max-h-[260px] overflow-hidden">
          {/* CUT INTO 3 EVEN COLUMNS: TRUSTPILOT | GOOGLE | INSTAGRAM */}
          <div className="grid grid-cols-3 h-full w-full divide-x divide-slate-800/90 relative">
            
            {/* ============================================================ */}
            {/* 1. TRUSTPILOT REVIEWS */}
            {/* ============================================================ */}
            <div
              id="trustpilot-review-col"
              onClick={(e) => handleOpenLink(trustpilotUrl, 'Trustpilot', e)}
              className="relative h-full flex flex-col justify-between p-2 sm:p-3.5 md:p-5 bg-gradient-to-b from-[#091512]/95 via-[#060e0c]/90 to-[#040807]/95 hover:from-[#0d221d] hover:via-[#091714] hover:to-[#050c0a] cursor-pointer transition-all duration-200 group/trust select-none"
              role="button"
              tabIndex={0}
              aria-label="Read or leave reviews on Trustpilot"
            >
              {/* Subtle green ambient accent glow */}
              <div className="absolute top-0 left-0 w-28 h-28 bg-[#00b67a]/15 rounded-full blur-2xl pointer-events-none -z-0 group-hover/trust:bg-[#00b67a]/25 transition-all" />

              {/* Top Row: Trustpilot Brand & Rating Tag */}
              <div className="relative z-10 flex items-center justify-between w-full">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {/* Official Trustpilot Green Star Icon */}
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded bg-[#00b67a] flex items-center justify-center shadow-md shadow-[#00b67a]/30 shrink-0">
                    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 fill-white" aria-hidden="true">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </div>
                  <span className="font-extrabold text-[11px] sm:text-sm md:text-base text-white tracking-tight truncate">
                    Trustpilot
                  </span>
                </div>

                <span className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#00b67a]/20 border border-[#00b67a]/40 text-[#4ade80] text-[9px] font-bold shrink-0">
                  <ShieldCheck size={10} />
                  <span>Verified</span>
                </span>
              </div>

              {/* Middle Section: TrustScore & 5 Signature Green Stars */}
              <div className="relative z-10 flex flex-col items-start gap-1 my-auto">
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-[#00b67a] flex items-center justify-center rounded-[2px] shadow-sm shadow-[#00b67a]/30"
                    >
                      <svg viewBox="0 0 24 24" className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 fill-white" aria-hidden="true">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </div>
                  ))}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-[11px] sm:text-xs md:text-sm font-black text-white">4.8</span>
                  <span className="text-[9px] sm:text-[11px] font-semibold text-[#4ade80]">Excellent</span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-slate-400 truncate hidden xs:inline">
                  Verified Reviews
                </span>
              </div>

              {/* Bottom Action Button */}
              <div className="relative z-10 flex items-center justify-between w-full pt-1 border-t border-slate-800/60">
                <span className="text-[9px] sm:text-[11px] md:text-xs font-bold text-slate-300 group-hover/trust:text-[#4ade80] transition-colors flex items-center gap-1 truncate">
                  <span className="truncate">Trustpilot</span>
                  <ExternalLink size={10} className="shrink-0 transition-transform group-hover/trust:translate-x-0.5 group-hover/trust:-translate-y-0.5" />
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono text-slate-500 uppercase tracking-wider shrink-0">
                  Open ↗
                </span>
              </div>
            </div>

            {/* ============================================================ */}
            {/* 2. GOOGLE REVIEWS */}
            {/* ============================================================ */}
            <div
              id="google-review-col"
              onClick={(e) => handleOpenLink(googleReviewsUrl, 'Google', e)}
              className="relative h-full flex flex-col justify-between p-2 sm:p-3.5 md:p-5 bg-gradient-to-b from-[#11131a]/95 via-[#0b0d14]/90 to-[#07080d]/95 hover:from-[#181a24] hover:via-[#10131d] hover:to-[#0b0c13] cursor-pointer transition-all duration-200 group/google select-none"
              role="button"
              tabIndex={0}
              aria-label="Read or leave reviews on Google"
            >
              {/* Subtle multi-color / warm ambient glow */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/15 rounded-full blur-2xl pointer-events-none -z-0 group-hover/google:bg-amber-500/25 transition-all" />

              {/* Top Row: Google Official Logo & Verified Tag */}
              <div className="relative z-10 flex items-center justify-between w-full">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {/* Official Google 4-Color "G" SVG */}
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-white flex items-center justify-center p-0.5 shadow-md shadow-black/40 shrink-0">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" aria-hidden="true">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                  </div>
                  <span className="font-extrabold text-[11px] sm:text-sm md:text-base text-white tracking-tight truncate">
                    Google
                  </span>
                </div>

                <span className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] font-bold shrink-0">
                  <CheckCircle2 size={10} />
                  <span>Public</span>
                </span>
              </div>

              {/* Middle Section: Rating & 5 Gold Stars */}
              <div className="relative z-10 flex flex-col items-start gap-1 my-auto">
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      viewBox="0 0 24 24"
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 fill-[#FBBC05] drop-shadow-[0_0_4px_rgba(251,188,5,0.45)]"
                      aria-hidden="true"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-[11px] sm:text-xs md:text-sm font-black text-white">4.9</span>
                  <span className="text-[9px] sm:text-[11px] font-semibold text-amber-300">Ratings</span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-slate-400 truncate hidden xs:inline">
                  Customer Score
                </span>
              </div>

              {/* Bottom Action Button */}
              <div className="relative z-10 flex items-center justify-between w-full pt-1 border-t border-slate-800/60">
                <span className="text-[9px] sm:text-[11px] md:text-xs font-bold text-slate-300 group-hover/google:text-amber-300 transition-colors flex items-center gap-1 truncate">
                  <span className="truncate">Google</span>
                  <ExternalLink size={10} className="shrink-0 transition-transform group-hover/google:translate-x-0.5 group-hover/google:-translate-y-0.5" />
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono text-slate-500 uppercase tracking-wider shrink-0">
                  Open ↗
                </span>
              </div>
            </div>

            {/* ============================================================ */}
            {/* 3. INSTAGRAM (FITS EVENLY & MATCHES DESIGN) */}
            {/* ============================================================ */}
            <div
              id="instagram-review-col"
              onClick={(e) => handleOpenLink(instagramUrl, 'Instagram', e)}
              className="relative h-full flex flex-col justify-between p-2 sm:p-3.5 md:p-5 bg-gradient-to-b from-[#180a15]/95 via-[#0f060d]/90 to-[#080307]/95 hover:from-[#240e1f] hover:via-[#160813] hover:to-[#0c040b] cursor-pointer transition-all duration-200 group/insta select-none"
              role="button"
              tabIndex={0}
              aria-label="Follow and check proof on Instagram"
            >
              {/* Subtle pink/purple ambient glow */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-pink-500/15 rounded-full blur-2xl pointer-events-none -z-0 group-hover/insta:bg-pink-500/25 transition-all" />

              {/* Top Row: Instagram Official App Icon & Tag */}
              <div className="relative z-10 flex items-center justify-between w-full">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {/* Official Instagram Squircle Gradient Icon */}
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-[5px] sm:rounded-[6px] overflow-hidden shadow-md shadow-pink-600/30 shrink-0">
                    <svg viewBox="0 0 48 48" className="w-full h-full" aria-hidden="true">
                      <defs>
                        <radialGradient id="igCardRadial" cx="20%" cy="105%" r="120%">
                          <stop offset="0%" stopColor="#ffd600" />
                          <stop offset="10%" stopColor="#ffab00" />
                          <stop offset="50%" stopColor="#dd2a7b" />
                          <stop offset="100%" stopColor="#8134af" />
                        </radialGradient>
                      </defs>
                      <rect width="48" height="48" rx="14" fill="url(#igCardRadial)" />
                      <rect x="10" y="10" width="28" height="28" rx="8" fill="none" stroke="#ffffff" strokeWidth="3.5" />
                      <circle cx="24" cy="24" r="6.5" fill="none" stroke="#ffffff" strokeWidth="3.5" />
                      <circle cx="31.5" cy="16.5" r="2" fill="#ffffff" />
                    </svg>
                  </div>
                  <span className="font-extrabold text-[11px] sm:text-sm md:text-base text-white tracking-tight truncate">
                    Instagram
                  </span>
                </div>

                <span className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-[9px] font-bold shrink-0">
                  <ShieldCheck size={10} />
                  <span>Creator</span>
                </span>
              </div>

              {/* Middle Section: Handle & Proof / Community Badge */}
              <div className="relative z-10 flex flex-col items-start gap-1 my-auto">
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      viewBox="0 0 24 24"
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 fill-pink-500 drop-shadow-[0_0_4px_rgba(236,72,153,0.5)]"
                      aria-hidden="true"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-[11px] sm:text-xs md:text-sm font-black text-white truncate">@oh_knee97</span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-pink-300/90 truncate hidden xs:inline">
                  Cashout Proofs
                </span>
              </div>

              {/* Bottom Action Button */}
              <div className="relative z-10 flex items-center justify-between w-full pt-1 border-t border-slate-800/60">
                <span className="text-[9px] sm:text-[11px] md:text-xs font-bold text-slate-300 group-hover/insta:text-pink-300 transition-colors flex items-center gap-1 truncate">
                  <span className="truncate">Instagram</span>
                  <ExternalLink size={10} className="shrink-0 transition-transform group-hover/insta:translate-x-0.5 group-hover/insta:-translate-y-0.5" />
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono text-slate-500 uppercase tracking-wider shrink-0">
                  Open ↗
                </span>
              </div>
            </div>

          </div>

          {/* Quick link config gear button (accessible & quiet in top right) */}
          <button
            type="button"
            id="btn-edit-review-links"
            title="Configure review & social links"
            onClick={(e) => {
              e.stopPropagation();
              setEditTrustpilot(trustpilotUrl);
              setEditGoogle(googleReviewsUrl);
              setEditInstagram(instagramUrl);
              setIsEditModalOpen(true);
            }}
            className="absolute top-1.5 right-1.5 z-20 p-1.5 rounded-lg bg-black/60 hover:bg-black/90 border border-slate-700/60 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Edit review and social URLs"
          >
            <Settings size={12} />
          </button>
        </div>
      </div>

      {/* QUICK URL EDIT MODAL */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-neutral-900 border border-slate-700 p-5 shadow-2xl text-left max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-white mb-1">Configure Card Links</h3>
            <p className="text-xs text-slate-400 mb-4">
              Customize the destination links for the 3 banner channels.
            </p>

            <form onSubmit={handleSaveLinks} className="space-y-3.5">
              {/* Trustpilot Unique Invite Address */}
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                    <Mail size={12} className="text-emerald-400" />
                    <span>Your Unique Trustpilot Invite Email</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(TRUSTPILOT_INVITE_EMAIL);
                      setIsEmailCopied(true);
                      setTimeout(() => setIsEmailCopied(false), 2000);
                    }}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-[10px] font-bold cursor-pointer transition-colors border border-emerald-500/30"
                  >
                    {isEmailCopied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    <span>{isEmailCopied ? 'Copied' : 'Copy Email'}</span>
                  </button>
                </div>
                <code className="text-[11px] font-mono text-emerald-100 bg-black/60 px-2 py-1 rounded border border-emerald-900/60 truncate select-all">
                  {TRUSTPILOT_INVITE_EMAIL}
                </code>
              </div>

              {/* 1. Trustpilot URL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-emerald-400">
                    Trustpilot Review URL
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditTrustpilot('https://www.trustpilot.com/review/ohknee.com')}
                      className="text-[10px] text-slate-400 hover:text-emerald-300 underline cursor-pointer"
                    >
                      Default
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={() => setEditTrustpilot('https://www.trustpilot.com/evaluate/ohknee.com')}
                      className="text-[10px] text-slate-400 hover:text-emerald-300 underline cursor-pointer"
                    >
                      Evaluate
                    </button>
                  </div>
                </div>
                <input
                  type="url"
                  value={editTrustpilot}
                  onChange={(e) => setEditTrustpilot(e.target.value)}
                  placeholder="https://www.trustpilot.com/review/ohknee.com"
                  className="w-full px-3 py-2 rounded-xl bg-black border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              {/* 2. Google Reviews URL */}
              <div>
                <label className="block text-xs font-semibold text-amber-400 mb-1">
                  Google Reviews URL
                </label>
                <input
                  type="url"
                  value={editGoogle}
                  onChange={(e) => setEditGoogle(e.target.value)}
                  placeholder="https://search.google.com/local/writereview?placeid=..."
                  className="w-full px-3 py-2 rounded-xl bg-black border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* 3. Instagram URL */}
              <div>
                <label className="block text-xs font-semibold text-pink-400 mb-1">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={editInstagram}
                  onChange={(e) => setEditInstagram(e.target.value)}
                  placeholder="https://www.instagram.com/oh_knee97"
                  className="w-full px-3 py-2 rounded-xl bg-black border border-slate-700 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold cursor-pointer transition-colors shadow-md"
                >
                  Save Links
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
