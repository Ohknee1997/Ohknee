import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MobileTab } from './MobileBottomNav';

interface PageTransitionWrapperProps {
  currentTab: MobileTab;
  isInitialBreakaway?: boolean;
  slideDirection?: number; // 1 for forward (Home -> Top 10 -> Earn), -1 for backward
  children: React.ReactNode;
}

export const PageTransitionWrapper: React.FC<PageTransitionWrapperProps> = ({
  currentTab,
  isInitialBreakaway = false,
  slideDirection = 1,
  children,
}) => {
  // If this is the one-time initial entry breakaway animation
  const getVariants = () => {
    if (isInitialBreakaway) {
      switch (currentTab) {
        case 'hero':
        case 'home' as any:
          // Split & Dissolve Breakaway:
          // Scaled up smoothly from 96% to 100% opacity, exit dissolves cleanly
          return {
            initial: { opacity: 0, scale: 0.96 },
            animate: { opacity: 1, scale: 1 },
            exit: {
              opacity: 0,
              scale: 1.02,
            },
            transition: { duration: 0.28, ease: 'easeOut' as const },
          };

        case 'top-10':
          // Rapid slide-in with clean opacity fade
          return {
            initial: { x: '30%', opacity: 0 },
            animate: { x: 0, opacity: 1 },
            exit: {
              x: '-100%',
              opacity: 0,
            },
            transition: { duration: 0.24, ease: 'easeOut' as const },
          };

        case 'earn':
          // Clean 2D drop-in glide
          return {
            initial: {
              opacity: 0,
              y: -24,
            },
            animate: {
              opacity: 1,
              y: 0,
            },
            exit: {
              y: 24,
              opacity: 0,
            },
            transition: { duration: 0.26, ease: 'easeOut' as const },
          };

      }
    }

    // SUBSEQUENT TAB TRANSITIONS:
    // Unified, continuous lightweight horizontal glide system (200ms–250ms)
    // Moving forward (Home -> Top 10 -> Earn): slide out left (-100%), slide in right (100% -> 0)
    // Moving backward (Earn -> Top 10 -> Home): slide out right (100%), slide in left (-100% -> 0)
    if (slideDirection >= 0) {
      return {
        initial: { x: '100%', opacity: 1 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '-100%', opacity: 0.98 },
        transition: { duration: 0.22, ease: 'easeInOut' as const },
      };
    } else {
      return {
        initial: { x: '-100%', opacity: 1 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '100%', opacity: 0.98 },
        transition: { duration: 0.22, ease: 'easeInOut' as const },
      };
    }
  };

  const variants = getVariants();

  return (
    <div className="relative w-full flex-1 flex flex-col overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentTab}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={variants.transition}
          className="w-full flex-1 flex flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
