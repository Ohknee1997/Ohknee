import React from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, ArrowRight, DollarSign } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExplore: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose, onExplore }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#090d18] border border-slate-700/80 shadow-2xl p-6 sm:p-8 overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Sparkles size={18} />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">How OHKNEE Works</h3>
              <p className="text-xs text-slate-400">3 simple steps to claim verified rewards</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 my-6">
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-500/20 text-teal-300 text-xs font-black flex-shrink-0">
              1
            </span>
            <div>
              <h4 className="text-sm font-bold text-white">Choose a Verified Offer</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Browse our curated categories—from $150 Fast Cash sequences to daily sweepstakes coins and banking bonuses.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-500/20 text-teal-300 text-xs font-black flex-shrink-0">
              2
            </span>
            <div>
              <h4 className="text-sm font-bold text-white">Follow Simple Steps</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Click the direct official link, sign up or install the app, and follow the simple chronological instructions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-500/20 text-teal-300 text-xs font-black flex-shrink-0">
              3
            </span>
            <div>
              <h4 className="text-sm font-bold text-white">Withdraw Direct to Bank or Crypto</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Cash out your bonuses directly. We never charge fees and never ask for personal payment credentials.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onExplore();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs cursor-pointer shadow-md transition-all"
          >
            <span>Start Earning Now</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
