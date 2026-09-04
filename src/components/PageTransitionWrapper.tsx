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
          // Scaled up smoothly from 95% to 100% opacity, exit splits horizontally outward & dissolves
          return {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: {
              opacity: 0,
              scaleX: 1.15,
              scaleY: 0.95,
              filter: 'blur(6px)',
            },
            transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
          };

        case 'top-10':
          // Slide & Glitch Breakaway:
          // Rapid slide-out to left with 150ms digital glitch/blur-to-focus effect as Top 10 enters
          return {
            initial: { x: '55%', opacity: 0, filter: 'blur(12px) contrast(140%)' },
            animate: { x: 0, opacity: 1, filter: 'blur(0px) contrast(100%)' },
            exit: {
              x: '-100%',
              opacity: 0,
            },
            transition: { duration: 0.26, ease: [0.2, 0.9, 0.3, 1] },
          };

        case 'earn':
          // 3D Card Flip / Drop-In Breakaway:
          // Current view tilts downward off-screen, while Earn rotates into perspective from subtle 3D tilt
          return {
            initial: {
              opacity: 0,
              y: -40,
              rotateX: 18,
              transformPerspective: 1000,
            },
            animate: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              transformPerspective: 1000,
            },
            exit: {
              y: '60%',
              rotateX: -18,
              opacity: 0,
              transformPerspective: 1000,
            },
            transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
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
        transition: { duration: 0.22, ease: [0.25, 1, 0.5, 1] },
      };
    } else {
      return {
        initial: { x: '-100%', opacity: 1 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '100%', opacity: 0.98 },
        transition: { duration: 0.22, ease: [0.25, 1, 0.5, 1] },
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
