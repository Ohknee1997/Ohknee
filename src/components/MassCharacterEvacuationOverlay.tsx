import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Sword, Zap, Heart } from 'lucide-react';

interface MassCharacterEvacuationOverlayProps {
  onComplete: () => void;
}

export const MassCharacterEvacuationOverlay: React.FC<MassCharacterEvacuationOverlayProps> = ({
  onComplete,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 450);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-center bg-black/40 backdrop-blur-xs">
      {/* 1. Left-Side Characters: Flip horizontally & sprint off the left edge (translateX(-100vw)) */}
      <div className="absolute left-6 sm:left-16 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        {[
          { name: 'Knight Alpha', emoji: '⚔️', title: 'Paladin', icon: <Sword size={18} /> },
          { name: 'Ranger Leo', emoji: '🏹', title: 'Marksman', icon: <Zap size={18} /> },
          { name: 'Guardian', emoji: '🛡️', title: 'Defender', icon: <Shield size={18} /> },
        ].map((char, idx) => (
          <motion.div
            key={`left-char-${idx}`}
            initial={{ x: 0, scaleX: -1, opacity: 1 }}
            animate={{ x: '-120vw', scaleX: -1, opacity: [1, 1, 0] }}
            transition={{
              duration: 0.42,
              delay: idx * 0.04,
              ease: [0.32, 0, 0.67, 0],
            }}
            className="flex items-center gap-2 p-2.5 px-3.5 rounded-2xl bg-[#1c2233] border-2 border-purple-400 text-white shadow-[0_0_25px_rgba(147,51,234,0.5)]"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600/40 border border-purple-400/50 flex items-center justify-center text-xl">
              {char.emoji}
            </div>
            <div className="text-left select-none">
              <div className="text-xs font-black text-white">{char.name}</div>
              <div className="text-[10px] font-bold text-purple-300 uppercase">{char.title}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. Center Female Characters: Turn around & walk away into depth (scale(0) & fade to 0) */}
      <div className="relative flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 1, opacity: 1, y: 0 }}
          animate={{ scale: 0, opacity: 0, y: -60 }}
          transition={{
            duration: 0.42,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="flex flex-col items-center text-center select-none"
        >
          {/* Princess / Queen / Heroine Avatar */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-pink-500 via-purple-600 to-amber-400 p-1 shadow-[0_0_40px_rgba(236,72,153,0.6)] border-2 border-white">
            <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center text-4xl overflow-hidden relative">
              <span className="text-4xl filter drop-shadow-md">👸</span>
              <div className="absolute -bottom-1 text-[9px] font-black uppercase tracking-wider text-pink-300 px-2 py-0.5 rounded-full bg-pink-950/80 border border-pink-500/40">
                Queen
              </div>
            </div>
          </div>

          <div className="mt-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-400/60 text-purple-200 text-xs font-black flex items-center gap-1.5 shadow-md">
            <Sparkles size={12} className="text-pink-400 animate-spin" />
            <span>Evacuating to Ascension Hub</span>
          </div>
        </motion.div>
      </div>

      {/* 3. Right-Side Characters: Flip horizontally & sprint off the right edge (translateX(100vw)) */}
      <div className="absolute right-6 sm:right-16 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        {[
          { name: 'Knight Beta', emoji: '🗡️', title: 'Duelist', icon: <Sword size={18} /> },
          { name: 'Mage Kira', emoji: '🧙‍♂️', title: 'Sorcerer', icon: <Sparkles size={18} /> },
          { name: 'Berserker', emoji: '🪓', title: 'Slayer', icon: <Zap size={18} /> },
        ].map((char, idx) => (
          <motion.div
            key={`right-char-${idx}`}
            initial={{ x: 0, scaleX: 1, opacity: 1 }}
            animate={{ x: '120vw', scaleX: 1, opacity: [1, 1, 0] }}
            transition={{
              duration: 0.42,
              delay: idx * 0.04,
              ease: [0.32, 0, 0.67, 0],
            }}
            className="flex items-center gap-2 p-2.5 px-3.5 rounded-2xl bg-[#1c2233] border-2 border-pink-400 text-white shadow-[0_0_25px_rgba(236,72,153,0.5)]"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-600/40 border border-pink-400/50 flex items-center justify-center text-xl">
              {char.emoji}
            </div>
            <div className="text-left select-none">
              <div className="text-xs font-black text-white">{char.name}</div>
              <div className="text-[10px] font-bold text-pink-300 uppercase">{char.title}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
