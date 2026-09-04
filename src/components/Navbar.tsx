import React from 'react';
import { OhkneeLogo } from './OhkneeLogo';

interface NavbarProps {
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGoHome }) => {
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onGoHome) {
      onGoHome();
    }
  };

  return (
    <header
      id="main-brand-header"
      className="sticky top-0 z-40 w-full bg-[#0e111a] border-b border-[#22293c] shadow-md select-none"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Logo on Top Left */}
          <div
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group flex-shrink-0"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleLogoClick();
              }
            }}
          >
            <div className="flex items-center justify-center transition-transform group-hover:scale-105">
              <OhkneeLogo className="h-11 sm:h-14 w-auto object-contain" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              OHKNEE.COM
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
