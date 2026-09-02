import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface ScammerMemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinish?: () => void;
}

export const ScammerMemeModal: React.FC<ScammerMemeModalProps> = ({ isOpen, onClose, onFinish }) => {
  const [animationStep, setAnimationStep] = useState<1 | 2 | 3 | 4>(1);

  // Auto-advance through the comedic cartoon sequence at a brisk, easily readable pace
  useEffect(() => {
    if (!isOpen) {
      setAnimationStep(1);
      return;
    }

    setAnimationStep(1);
    // Slightly faster pacing while keeping dialogue comfortable to read
    const timer1 = setTimeout(() => setAnimationStep(2), 3400); // Shady stick figure pitch
    const timer2 = setTimeout(() => setAnimationStep(3), 6000); // "No." response + hammer appears
    const timer3 = setTimeout(() => setAnimationStep(4), 8000); // Bonk!! impact explosion
    const timerFinish = setTimeout(() => {
      // Auto-transition to the Top 10 section
      if (onFinish) {
        onFinish();
      } else {
        onClose();
      }
    }, 11200); // Punchline PSA -> auto transition

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerFinish);
    };
  }, [isOpen, onFinish, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-[#0b0f19] border border-amber-500/40 shadow-2xl shadow-amber-500/10 p-5 overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cartoon Stage Area - No separate exit/X button, no text above */}
        <div className="relative w-full min-h-[300px] bg-[#070b14] border border-slate-800/90 rounded-2xl my-2 overflow-hidden flex flex-col items-center justify-center p-4">
          {/* Ambient background comic burst */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_#f59e0b_0%,_transparent_70%)]" />

          {/* STEP 1: Shady Stick Figure Asking for Cash App */}
          {animationStep === 1 && (
            <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
              {/* Comic Speech Bubble */}
              <div className="relative mb-3 px-4 py-2.5 bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg animate-bounce max-w-[290px] text-center leading-snug">
                &quot;I got $5,000 and I&apos;m gonna give you some money! What&apos;s your Cash App?&quot;
                <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-amber-400" />
              </div>

              {/* Cartoony Stick Figure with Sunglasses */}
              <svg width="120" height="130" viewBox="0 0 100 120" className="mt-1">
                {/* Head */}
                <circle cx="50" cy="28" r="16" fill="#f8fafc" stroke="#0f172a" strokeWidth="3" />
                {/* Shady Cool Guy Sunglasses */}
                <rect x="37" y="24" width="12" height="7" rx="2" fill="#000000" />
                <rect x="51" y="24" width="12" height="7" rx="2" fill="#000000" />
                <line x1="48" y1="27" x2="52" y2="27" stroke="#000000" strokeWidth="2" />
                {/* Smug Smirk */}
                <path d="M 44 36 Q 52 42 58 35" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
                {/* Body */}
                <line x1="50" y1="44" x2="50" y2="85" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                {/* Left Arm holding money stack */}
                <line x1="50" y1="56" x2="25" y2="66" stroke="#f8fafc" strokeWidth="3.5" strokeLinecap="round" />
                <rect x="16" y="60" width="14" height="9" rx="1" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
                <text x="23" y="67" fontSize="7" fontWeight="bold" fill="#052e16" textAnchor="middle">$</text>
                {/* Right Arm waving */}
                <line x1="50" y1="56" x2="78" y2="48" stroke="#f8fafc" strokeWidth="3.5" strokeLinecap="round" />
                {/* Legs */}
                <line x1="50" y1="85" x2="35" y2="114" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                <line x1="50" y1="85" x2="65" y2="114" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
          )}

          {/* STEP 2: The Other Character Says "No." and The Giant Anti-Scam Mallet Appears */}
          {animationStep === 2 && (
            <div className="flex flex-col items-center">
              {/* Other character response bubble */}
              <div className="relative mb-3 px-5 py-2 bg-emerald-500 text-white font-black text-base rounded-2xl shadow-xl animate-in zoom-in-95 duration-200">
                &quot;No.&quot;
                <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-emerald-500" />
              </div>

              <div className="relative">
                {/* Giant cartoon hammer dropping */}
                <div className="absolute -top-16 -right-12 animate-in slide-in-from-top duration-500">
                  <div className="relative rotate-[-25deg]">
                    {/* Hammer head */}
                    <div className="w-24 h-16 bg-gradient-to-r from-red-600 to-amber-600 rounded-2xl border-4 border-white flex items-center justify-center shadow-2xl">
                      <span className="text-[11px] font-black text-white uppercase tracking-tighter">
                        OHKNEE BONK
                      </span>
                    </div>
                    {/* Wooden handle */}
                    <div className="w-4 h-24 bg-amber-800 border-2 border-amber-950 mx-auto -mt-1 rounded-b" />
                  </div>
                </div>

                {/* Sweating Stick Figure */}
                <svg width="100" height="120" viewBox="0 0 100 120">
                  <circle cx="50" cy="28" r="16" fill="#f8fafc" stroke="#0f172a" strokeWidth="3" />
                  {/* Big scared eyes */}
                  <circle cx="44" cy="26" r="3" fill="#000000" />
                  <circle cx="56" cy="26" r="3" fill="#000000" />
                  {/* Sweat drop */}
                  <rect x="63" y="14" width="4" height="8" rx="2" ry="4" fill="#38bdf8" />
                  {/* Wobbly mouth */}
                  <path d="M 42 38 Q 48 34 52 38 Q 56 42 60 38" fill="none" stroke="#000000" strokeWidth="2.5" />
                  <line x1="50" y1="44" x2="50" y2="85" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                  <line x1="50" y1="56" x2="25" y2="40" stroke="#f8fafc" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="50" y1="56" x2="75" y2="40" stroke="#f8fafc" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="50" y1="85" x2="35" y2="114" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                  <line x1="50" y1="85" x2="65" y2="114" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          )}

          {/* STEP 3: BONK!! Cartoon slapstick explosion */}
          {animationStep === 3 && (
            <div className="flex flex-col items-center justify-center animate-in zoom-in duration-200">
              {/* Comic Impact Word */}
              <div className="px-6 py-2 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-slate-950 font-black text-2xl sm:text-3xl rounded-2xl border-4 border-white shadow-2xl rotate-[-4deg] scale-110 tracking-widest">
                💥 BONK!! 💥
              </div>

              {/* Flattened cartoony stick figure with stars */}
              <div className="relative mt-6 flex flex-col items-center">
                {/* Circling yellow stars */}
                <div className="flex items-center gap-3 text-amber-300 animate-spin">
                  <Sparkles size={18} />
                  <span className="text-xs font-black">⭐ ⭐ ⭐</span>
                  <Sparkles size={18} />
                </div>

                {/* Squished head */}
                <svg width="100" height="40" viewBox="0 0 100 40" className="mt-2">
                  <rect x="20" y="8" width="60" height="24" rx="30" ry="12" fill="#f8fafc" stroke="#0f172a" strokeWidth="3" />
                </svg>
                <div className="text-[11px] font-black text-slate-900 -mt-7">x _ x</div>
                <div className="w-28 h-3 bg-slate-400 rounded-full mt-2" />
              </div>
            </div>
          )}

          {/* STEP 4: Ohknee Anti-Scam Punchline */}
          {animationStep === 4 && (
            <div className="flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in-95 duration-400">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40 mb-3 shadow-lg">
                <ShieldCheck size={28} />
              </div>

              <h4 className="text-base sm:text-lg font-black text-white leading-snug">
                Never send money or your Cash App to strangers!
              </h4>
              <p className="text-xs text-slate-300 mt-2 max-w-sm leading-relaxed">
                Real reward platforms pay <span className="text-teal-300 font-bold">YOU</span> directly for completing verified offers.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
