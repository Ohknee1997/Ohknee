import React from 'react';
import { MW2TenthPrestigeIcon } from './MW2TenthPrestigeIcon';
import { PixelSnakeLIcon } from './PixelSnakeLIcon';

export type MobileTab = 'top-10' | 'earn' | 'hero' | 'blank';

interface MobileBottomNavProps {
  currentTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  savedCount?: number;
  isDarkTheme?: boolean;
}

/**
 * Pixel-art Minecraft square grass block icon
 * Crisp 16x16 pixel layout with vibrant green grass on top and textured dirt below
 */
const MinecraftGrassBlockIcon: React.FC<{ size?: number; isActive?: boolean }> = ({
  size = 22,
  isActive = false,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block select-none transition-transform duration-100 ${
      isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(34,197,94,0.7)]' : 'opacity-85 hover:opacity-100'
    }`}
    style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
  >
    {/* Dirt base (textured brown) */}
    <rect x="0" y="0" width="16" height="16" fill="#866043" rx="1.5" />
    
    {/* Dirt darker flecks */}
    <rect x="2" y="7" width="2" height="2" fill="#573d26" />
    <rect x="7" y="10" width="2" height="2" fill="#573d26" />
    <rect x="12" y="7" width="2" height="2" fill="#573d26" />
    <rect x="3" y="12" width="2" height="2" fill="#573d26" />
    <rect x="10" y="13" width="2" height="2" fill="#573d26" />

    {/* Dirt lighter highlights */}
    <rect x="13" y="11" width="2" height="2" fill="#9c724e" />
    <rect x="5" y="8" width="2" height="2" fill="#9c724e" />
    <rect x="1" y="11" width="2" height="2" fill="#9c724e" />
    <rect x="9" y="7" width="2" height="2" fill="#9c724e" />

    {/* Top Grass Solid Layer (vibrant green) */}
    <rect x="0" y="0" width="16" height="5" fill="#5c8e32" rx="1.5" />
    <rect x="1" y="0" width="14" height="2" fill="#78b83e" />
    <rect x="3" y="2" width="3" height="2" fill="#78b83e" />
    <rect x="9" y="1" width="4" height="2" fill="#78b83e" />

    {/* Grass drips / pixel hangings */}
    <rect x="1" y="5" width="2" height="2" fill="#5c8e32" />
    <rect x="1" y="7" width="2" height="1" fill="#466f24" />
    
    <rect x="4" y="5" width="2" height="3" fill="#5c8e32" />
    <rect x="4" y="8" width="2" height="1" fill="#466f24" />

    <rect x="7" y="5" width="2" height="1" fill="#5c8e32" />

    <rect x="10" y="5" width="2" height="3" fill="#5c8e32" />
    <rect x="10" y="8" width="2" height="1" fill="#466f24" />

    <rect x="13" y="5" width="2" height="2" fill="#5c8e32" />

    {/* Dark crisp block border */}
    <rect x="0.5" y="0.5" width="15" height="15" fill="none" stroke="#2a1c11" strokeWidth="1" rx="1" />
  </svg>
);

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  isDarkTheme = true,
}) => {
  return (
    <nav
      id="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        willChange: 'transform',
      }}
      className={`select-none transition-colors duration-300 ${
        isDarkTheme
          ? 'bg-black/95 border-t border-neutral-800/90 shadow-[0_-4px_25px_rgba(0,0,0,0.85)]'
          : 'bg-white/95 border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]'
      } backdrop-blur-xl px-4 pt-1.5 pb-safe`}
    >
      <div className="flex items-center justify-around h-14 max-w-md mx-auto">
        {/* 1. CASUAL (FAR LEFT) - Minecraft Grass Block Icon - Emerald/Green Theme */}
        <button
          id="bottom-nav-tab-casual"
          type="button"
          onClick={() => onSelectTab('earn')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all cursor-pointer relative py-1 ${
            currentTab === 'earn'
              ? 'text-emerald-400 font-black'
              : isDarkTheme
              ? 'text-slate-400 hover:text-emerald-300 font-medium'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
          aria-label="Casual"
        >
          <MinecraftGrassBlockIcon size={22} isActive={currentTab === 'earn'} />
          <span className="text-xs tracking-tight whitespace-nowrap leading-none font-bold">Casual</span>
          {currentTab === 'earn' && (
            <span
              className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
            />
          )}
        </button>

        {/* 2. RANKED (MIDDLE) - Modern Warfare 2 (MW2) 10th Prestige Golden Skull Emblem */}
        <button
          id="bottom-nav-tab-ranked"
          type="button"
          onClick={() => onSelectTab('top-10')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all cursor-pointer relative py-1 ${
            currentTab === 'top-10'
              ? 'text-amber-400 font-black'
              : isDarkTheme
              ? 'text-slate-400 hover:text-amber-300 font-medium'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
          aria-label="RANKED"
        >
          <MW2TenthPrestigeIcon size={24} isActive={currentTab === 'top-10'} />
          <span className="text-xs tracking-tight whitespace-nowrap leading-none font-bold">RANKED</span>
          {currentTab === 'top-10' && (
            <span
              className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]"
            />
          )}
        </button>

        {/* 3. SKILL ISSUE (FAR RIGHT) - Pixel Style Snake in Capital 'L' Shape */}
        <button
          id="bottom-nav-tab-skillissue"
          type="button"
          onClick={() => onSelectTab('blank')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all cursor-pointer relative py-1 ${
            currentTab === 'blank'
              ? 'text-emerald-400 font-black'
              : isDarkTheme
              ? 'text-slate-400 hover:text-emerald-300 font-medium'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
          aria-label="Skill Issue"
        >
          <PixelSnakeLIcon size={22} isActive={currentTab === 'blank'} />
          <span className="text-xs tracking-tight whitespace-nowrap leading-none font-bold">skill issue</span>
          {currentTab === 'blank' && (
            <span
              className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
            />
          )}
        </button>
      </div>
    </nav>
  );
};
