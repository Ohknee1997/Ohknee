import React from 'react';

interface PixelSnakeLIconProps {
  size?: number;
  isActive?: boolean;
}

/**
 * Pixel-art Snake in the shape of a capital 'L'
 * Authentic 16x16 retro gaming pixel grid with head at the top,
 * red pixel tongue, eyes, scaled body segments, and tapered tail.
 */
export const PixelSnakeLIcon: React.FC<PixelSnakeLIconProps> = ({
  size = 22,
  isActive = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none transition-all duration-150 ${
        isActive
          ? 'scale-110 drop-shadow-[0_0_8px_rgba(74,222,128,0.85)]'
          : 'opacity-80 hover:opacity-100'
      }`}
      style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
      aria-label="Pixel Snake L Icon"
    >
      {/* Dark pixel outline / silhouette for high contrast */}
      {/* Head outline */}
      <rect x="2" y="1" width="5" height="5" fill="#052e16" rx="0.5" />
      {/* Vertical body outline */}
      <rect x="2" y="5" width="4" height="6" fill="#052e16" />
      {/* Corner outline */}
      <rect x="2" y="10" width="5" height="5" fill="#052e16" rx="0.5" />
      {/* Horizontal base outline */}
      <rect x="6" y="11" width="8" height="4" fill="#052e16" rx="0.5" />
      <rect x="14" y="12" width="2" height="2" fill="#052e16" />

      {/* Red flicking snake tongue at top of head */}
      <rect x="4" y="0" width="1" height="1" fill="#ef4444" />
      <rect x="5" y="0" width="1" height="1" fill="#ef4444" />

      {/* Primary green body fills (#22c55e) */}
      {/* Head */}
      <rect x="3" y="2" width="3" height="3" fill="#22c55e" />
      {/* Vertical stem */}
      <rect x="3" y="5" width="2" height="6" fill="#22c55e" />
      {/* Corner */}
      <rect x="3" y="11" width="3" height="3" fill="#22c55e" />
      {/* Horizontal base */}
      <rect x="6" y="12" width="7" height="2" fill="#22c55e" />
      {/* Tail tip */}
      <rect x="13" y="12" width="2" height="1" fill="#16a34a" />

      {/* Highlights (#86efac - bright lime scale reflection) */}
      <rect x="3" y="2" width="1" height="1" fill="#86efac" />
      <rect x="3" y="5" width="1" height="1" fill="#86efac" />
      <rect x="3" y="7" width="1" height="1" fill="#86efac" />
      <rect x="3" y="9" width="1" height="1" fill="#86efac" />
      <rect x="6" y="12" width="1" height="1" fill="#86efac" />
      <rect x="8" y="12" width="1" height="1" fill="#86efac" />
      <rect x="10" y="12" width="1" height="1" fill="#86efac" />
      <rect x="12" y="12" width="1" height="1" fill="#86efac" />

      {/* Deeper shadow scales (#15803d) */}
      <rect x="4" y="6" width="1" height="1" fill="#15803d" />
      <rect x="4" y="8" width="1" height="1" fill="#15803d" />
      <rect x="4" y="10" width="1" height="1" fill="#15803d" />
      <rect x="7" y="13" width="1" height="1" fill="#15803d" />
      <rect x="9" y="13" width="1" height="1" fill="#15803d" />
      <rect x="11" y="13" width="1" height="1" fill="#15803d" />

      {/* Snake Head Eyes (Classic 8-bit eyes) */}
      {/* Left eye */}
      <rect x="3" y="3" width="1" height="1" fill="#ffffff" />
      <rect x="4" y="3" width="1" height="1" fill="#000000" />
      {/* Right eye */}
      <rect x="5" y="3" width="1" height="1" fill="#ffffff" />
      <rect x="5" y="4" width="1" height="1" fill="#000000" />
    </svg>
  );
};
