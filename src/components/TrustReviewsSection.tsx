import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, CheckCircle2, Edit3 } from 'lucide-react';

interface TrustReviewsSectionProps {
  reviewUrl?: string;
  onUpdateReviewUrl?: (url: string) => void;
}

export const TrustReviewsSection: React.FC<TrustReviewsSectionProps> = ({
  reviewUrl = 'https://www.trustpilot.com/review/ohknee.com',
  onUpdateReviewUrl,
}) => {
  const [currentUrl, setCurrentUrl] = useState(reviewUrl);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState(reviewUrl);

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUrl(tempUrl);
    setIsEditingUrl(false);
    if (onUpdateReviewUrl) {
      onUpdateReviewUrl(tempUrl);
    }
  };

  return (
    <section
      id="homepage-trust-section"
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none"
    >
      <div className="rounded-3xl bg-[#090d18] border border-slate-800/90 p-6 sm:p-8 shadow-xl shadow-teal-500/5">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-black text-white">4.9 / 5.0</span>
              <span className="text-xs font-semibold text-slate-400">Community Score</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Trusted by Our Community
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Real feedback from members who cash out verified sign-ups and game rewards.
            </p>
          </div>

          {/* Review / Trustpilot Link CTA */}
          <div className="flex flex-col items-start sm:items-end gap-1.5 flex-shrink-0">
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/90 border border-slate-700/80 hover:border-teal-400/50 text-white text-xs font-bold transition-all group shadow-sm cursor-pointer"
              title="Visit verified community reviews on Trustpilot"
            >
              <ShieldCheck size={14} className="text-teal-400" />
              <span>Read Trustpilot Reviews</span>
              <ExternalLink size={13} className="text-slate-400 group-hover:text-teal-300 transition-colors" />
            </a>

            {/* Configurable Review URL Helper */}
            <button
              type="button"
              onClick={() => setIsEditingUrl(!isEditingUrl)}
              className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Edit3 size={11} />
              <span>{isEditingUrl ? 'Cancel link edit' : 'Edit review destination link'}</span>
            </button>
          </div>
        </div>

        {/* Editable Review URL Form (Appears when toggled) */}
        {isEditingUrl && (
          <form onSubmit={handleSaveUrl} className="mt-4 p-4 rounded-2xl bg-[#0e1422] border border-teal-500/40 animate-in fade-in duration-150">
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Set Your Review Page / Trustpilot URL:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="https://www.trustpilot.com/review/your-domain.com"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-400"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs cursor-pointer transition-colors"
              >
                Save Link
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              This link powers the &quot;Read Trustpilot Reviews&quot; button above.
            </p>
          </form>
        )}

        {/* 3 Simple & Professional Testimonial Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#0c1220]/90 border border-slate-800/80 flex flex-col justify-between">
            <p className="text-xs text-slate-300 leading-relaxed italic">
              &quot;Followed the Fast Cash list step-by-step and withdrew $115 straight to my bank account. The instructions are super straightforward.&quot;
            </p>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
              <span className="font-bold text-white">Marcus T.</span>
              <span className="text-[11px] text-teal-400 font-semibold flex items-center gap-1">
                <CheckCircle2 size={12} /> Verified Member
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c1220]/90 border border-slate-800/80 flex flex-col justify-between">
            <p className="text-xs text-slate-300 leading-relaxed italic">
              &quot;Best collection of daily free sweepstakes coins and sign-up promos. No spam, no fake survey redirects, just working links.&quot;
            </p>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
              <span className="font-bold text-white">Elena R.</span>
              <span className="text-[11px] text-teal-400 font-semibold flex items-center gap-1">
                <CheckCircle2 size={12} /> Verified Member
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c1220]/90 border border-slate-800/80 flex flex-col justify-between">
            <p className="text-xs text-slate-300 leading-relaxed italic">
              &quot;Clean design, honest recommendations. I appreciate that they warn users against scams and actually test the promo codes.&quot;
            </p>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
              <span className="font-bold text-white">David K.</span>
              <span className="text-[11px] text-teal-400 font-semibold flex items-center gap-1">
                <CheckCircle2 size={12} /> Verified Member
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
