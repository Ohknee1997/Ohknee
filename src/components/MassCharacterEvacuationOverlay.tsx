import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Sword, Zap, Crown, Heart } from 'lucide-react';

interface MassCharacterEvacuationOverlayProps {
  onComplete: () => void;
  durationMs?: number;
}

export const MassCharacterEvacuationOverlay: React.FC<MassCharacterEvacuationOverlayProps> = ({
  onComplete,
  durationMs = 2600,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [onComplete, durationMs]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-center bg-black/60 backdrop-blur-xs select-none">
      {/* Cinematic Sunset Backdrop in the Middle Frame */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {/* Sky Sunset Gradient Glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0.95, 0] }}
          transition={{ duration: 2.6, times: [0, 0.25, 0.85, 1], ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-t from-amber-600/30 via-purple-900/40 to-slate-950/80 pointer-events-none"
        />

        {/* The Sunset Sun in the middle horizon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: -20 }}
          animate={{
            scale: [0.85, 1.05, 1.15, 1],
            opacity: [0, 0.85, 0.95, 0.1],
            y: [-20, -35, -45, -50],
          }}
          transition={{ duration: 2.6, ease: 'easeInOut' }}
          className="relative flex flex-col items-center justify-center pointer-events-none"
        >
          {/* Outer Sun Corona */}
          <div className="w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-gradient-to-t from-amber-400/40 via-orange-500/30 to-pink-500/20 blur-3xl" />
          {/* Inner Golden Sun Core */}
          <div className="absolute w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-gradient-to-b from-yellow-200 via-amber-400 to-orange-500 shadow-[0_0_60px_rgba(251,191,36,0.85)] blur-md" />

          {/* Sunset Horizon Line */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[85vw] max-w-2xl h-[2px] bg-gradient-to-r from-transparent via-amber-300/80 to-transparent shadow-[0_0_20px_rgba(251,191,36,0.9)]" />

          {/* Subtle Sunset Rays */}
          <div className="absolute text-[11px] font-black uppercase tracking-widest text-amber-200/80 -top-8 flex items-center gap-1.5 drop-shadow-md">
            <Sparkles size={13} className="text-amber-300 animate-spin" />
            <span>Ascension Sunset</span>
          </div>
        </motion.div>
      </div>

      {/* 1. Left-Side People: Turn around slowly, then sprint off the left edge */}
      <div className="absolute left-4 sm:left-14 top-1/2 -translate-y-1/2 flex flex-col gap-3.5 z-20">
        {[
          { name: 'Knight Alpha', emoji: '⚔️', title: 'Paladin', icon: <Sword size={16} /> },
          { name: 'Ranger Leo', emoji: '🏹', title: 'Marksman', icon: <Zap size={16} /> },
          { name: 'Guardian', emoji: '🛡️', title: 'Defender', icon: <Shield size={16} /> },
        ].map((char, idx) => (
          <motion.div
            key={`left-char-${idx}`}
            initial={{ x: 0, scaleX: 1, opacity: 0 }}
            animate={{
              // Phase 1 (0 to 0.6s): appear and turn around to face left (scaleX from 1 to -1)
              // Phase 2 (0.6s to 2.4s): run off left edge slowly
              x: [0, 0, -10, '-125vw'],
              scaleX: [1, 0, -1, -1],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.5,
              times: [0, 0.2, 0.35, 1],
              delay: idx * 0.12,
              ease: 'easeInOut',
            }}
            className="flex items-center gap-2 p-2.5 px-3 rounded-2xl bg-[#1c2233]/95 border-2 border-purple-400 text-white shadow-[0_0_25px_rgba(147,51,234,0.4)] backdrop-blur-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-600/40 border border-purple-400/50 flex items-center justify-center text-lg">
              {char.emoji}
            </div>
            <div className="text-left select-none">
              <div className="text-xs font-black text-white">{char.name}</div>
              <div className="text-[10px] font-bold text-purple-300 uppercase">{char.title}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. Center: The Girls turn around and walk into the sunset into the middle frame, slowly getting smaller */}
      <div className="relative z-30 flex flex-col items-center justify-center">
        <motion.div
          initial={{
            scale: 1,
            y: 30,
            opacity: 0,
            rotateY: 0,
          }}
          animate={{
            // Slow, deliberate journey:
            // 0 -> 0.3: Fade in and prepare
            // 0.3 -> 0.65: Turn around towards the sunset (rotateY from 0 to 180 or flip)
            // 0.65 -> 2.5: Walk step-by-step into the middle frame toward the horizon, slowly getting smaller
            scale: [1, 1, 0.85, 0.58, 0.3, 0.08, 0],
            y: [30, 20, -5, -45, -95, -145, -160],
            opacity: [0, 1, 1, 1, 0.9, 0.6, 0],
          }}
          transition={{
            duration: 2.55,
            times: [0, 0.15, 0.32, 0.58, 0.8, 0.95, 1],
            ease: [0.35, 0, 0.25, 1],
          }}
          className="flex flex-col items-center text-center select-none"
        >
          {/* Walking group of girls side-by-side */}
          <div className="flex items-end justify-center gap-3 sm:gap-4 relative">
            {/* Left Companion Girl: Maiden / Priestess */}
            <motion.div
              animate={{
                y: [0, -5, 0, -5, 0, -5, 0],
                rotate: [-2, 2, -2, 2, -1, 1, 0],
              }}
              transition={{
                duration: 2.5,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
              className="flex flex-col items-center"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 shadow-[0_0_25px_rgba(236,72,153,0.5)] border border-pink-300">
                <div className="w-full h-full rounded-[14px] bg-slate-950 flex flex-col items-center justify-center text-3xl overflow-hidden relative">
                  <span className="text-2xl sm:text-3xl filter drop-shadow-md">🧝‍♀️</span>
                  <div className="absolute -bottom-0.5 text-[7.5px] font-black uppercase tracking-wider text-pink-300 px-1 rounded-full bg-pink-950/80">
                    Maiden
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Center Lead Girl: Princess / Queen */}
            <motion.div
              animate={{
                y: [-4, 0, -4, 0, -4, 0, -2],
                rotate: [1, -1, 1, -1, 1, -1, 0],
              }}
              transition={{
                duration: 2.5,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
              className="flex flex-col items-center"
            >
              <div className="relative w-22 h-22 sm:w-26 sm:h-26 rounded-3xl bg-gradient-to-tr from-pink-500 via-amber-400 to-purple-600 p-1 shadow-[0_0_40px_rgba(251,191,36,0.7)] border-2 border-amber-300">
                <div className="w-full h-full rounded-[20px] bg-slate-950 flex flex-col items-center justify-center text-4xl overflow-hidden relative">
                  <span className="text-3xl sm:text-4xl filter drop-shadow-md">👸</span>
                  <div className="absolute -bottom-0.5 text-[8.5px] font-black uppercase tracking-wider text-amber-200 px-2 rounded-full bg-purple-950/90 border border-amber-400/40 flex items-center gap-1">
                    <Crown size={9} className="text-amber-300" />
                    <span>Queen</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Companion Girl: Sorceress */}
            <motion.div
              animate={{
                y: [0, -5, 0, -5, 0, -5, 0],
                rotate: [2, -2, 2, -2, 1, -1, 0],
              }}
              transition={{
                duration: 2.5,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
              className="flex flex-col items-center"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 p-0.5 shadow-[0_0_25px_rgba(168,85,247,0.5)] border border-purple-300">
                <div className="w-full h-full rounded-[14px] bg-slate-950 flex flex-col items-center justify-center text-3xl overflow-hidden relative">
                  <span className="text-2xl sm:text-3xl filter drop-shadow-md">🧙‍♀️</span>
                  <div className="absolute -bottom-0.5 text-[7.5px] font-black uppercase tracking-wider text-purple-300 px-1 rounded-full bg-purple-950/80">
                    Mage
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Golden Sunset Walk Indicator */}
          <div className="mt-3 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-950/90 via-amber-950/80 to-purple-950/90 border border-amber-400/50 text-amber-200 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-900/30">
            <Heart size={12} className="text-pink-400 fill-pink-400" />
            <span>Walking into the Sunset</span>
            <Sparkles size={12} className="text-amber-300" />
          </div>
        </motion.div>
      </div>

      {/* 3. Right-Side People: Turn around slowly, then sprint off the right edge */}
      <div className="absolute right-4 sm:right-14 top-1/2 -translate-y-1/2 flex flex-col gap-3.5 z-20">
        {[
          { name: 'Knight Beta', emoji: '🗡️', title: 'Duelist', icon: <Sword size={16} /> },
          { name: 'Mage Kira', emoji: '🧙‍♂️', title: 'Sorcerer', icon: <Sparkles size={16} /> },
          { name: 'Berserker', emoji: '🪓', title: 'Slayer', icon: <Zap size={16} /> },
        ].map((char, idx) => (
          <motion.div
            key={`right-char-${idx}`}
            initial={{ x: 0, scaleX: -1, opacity: 0 }}
            animate={{
              // Phase 1 (0 to 0.6s): appear and turn around to face right (scaleX from -1 to 1)
              // Phase 2 (0.6s to 2.4s): run off right edge slowly
              x: [0, 0, 10, '125vw'],
              scaleX: [-1, 0, 1, 1],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.5,
              times: [0, 0.2, 0.35, 1],
              delay: idx * 0.12,
              ease: 'easeInOut',
            }}
            className="flex items-center gap-2 p-2.5 px-3 rounded-2xl bg-[#1c2233]/95 border-2 border-pink-400 text-white shadow-[0_0_25px_rgba(236,72,153,0.4)] backdrop-blur-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-pink-600/40 border border-pink-400/50 flex items-center justify-center text-lg">
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
