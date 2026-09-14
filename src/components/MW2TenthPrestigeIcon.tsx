import React from 'react';

interface MW2TenthPrestigeIconProps {
  size?: number;
  isActive?: boolean;
  className?: string;
}

/**
 * Call of Duty: Modern Warfare 2 (2009) - 10th Prestige Spinning Golden Skull Emblem
 * Exact reference match:
 * - Concentric metallic gold coin rims with laurel leaf border
 * - 10 Prestige stars (5 arched on left, 5 arched on right)
 * - Embossed golden skull with 4 horizontal forehead ridges/bands, deep sunken eyes,
 *   sculpted cheekbones, and prominent upper & lower teeth rows
 * - High-specular 24K gold and antique bronze shading
 */
export const MW2TenthPrestigeIcon: React.FC<MW2TenthPrestigeIconProps> = ({
  size = 26,
  isActive = false,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none transition-transform duration-300 ${
        isActive ? 'scale-110' : 'hover:scale-105'
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${
          isActive
            ? 'drop-shadow-[0_0_12px_rgba(250,204,21,0.9)] filter'
            : 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] filter'
        }`}
        aria-label="MW2 10th Prestige Golden Skull Emblem"
      >
        <defs>
          {/* Rich Polished 24K Gold Gradient */}
          <linearGradient id="mw2GoldOuter" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFCE0" />
            <stop offset="18%" stopColor="#FDE047" />
            <stop offset="45%" stopColor="#CA8A04" />
            <stop offset="70%" stopColor="#FEF08A" />
            <stop offset="88%" stopColor="#A16207" />
            <stop offset="100%" stopColor="#543105" />
          </linearGradient>

          {/* Deep Coin Face Background */}
          <radialGradient id="mw2CoinFace" cx="50%" cy="45%" r="52%">
            <stop offset="0%" stopColor="#452A08" />
            <stop offset="45%" stopColor="#251604" />
            <stop offset="85%" stopColor="#120A02" />
            <stop offset="100%" stopColor="#050301" />
          </radialGradient>

          {/* Skull Metallic Relief Gradient */}
          <radialGradient id="mw2SkullRelief" cx="50%" cy="32%" r="58%">
            <stop offset="0%" stopColor="#FFFFF0" />
            <stop offset="25%" stopColor="#FEEF7A" />
            <stop offset="55%" stopColor="#EAB308" />
            <stop offset="82%" stopColor="#A16207" />
            <stop offset="100%" stopColor="#5B3307" />
          </radialGradient>

          {/* Forehead Ridge Band Gradient */}
          <linearGradient id="mw2RidgeGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFDE6" />
            <stop offset="40%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Star Burnished Gold */}
          <linearGradient id="mw2StarGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFEE6" />
            <stop offset="50%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
        </defs>

        {/* 1. OUTER COIN RIM WITH DOUBLE STEPPED BEVEL */}
        {/* Outermost rim */}
        <circle cx="50" cy="50" r="48" fill="url(#mw2GoldOuter)" stroke="#FEEF7A" strokeWidth="1" />
        <circle cx="50" cy="50" r="45" fill="#382105" stroke="#78350F" strokeWidth="1" />

        {/* Laurel / Coin Leaf Border Texture around perimeter */}
        <circle
          cx="50"
          cy="50"
          r="43"
          fill="none"
          stroke="url(#mw2GoldOuter)"
          strokeWidth="2.5"
          strokeDasharray="2.5 2"
        />

        {/* Inner Coin Rim */}
        <circle cx="50" cy="50" r="41" fill="#583508" stroke="#FDE047" strokeWidth="0.8" />
        {/* Dark Metallic Coin Face */}
        <circle cx="50" cy="50" r="39.5" fill="url(#mw2CoinFace)" stroke="#78350F" strokeWidth="1" />

        {/* Subtle Concentric Coin Lathe Grooves */}
        <circle cx="50" cy="50" r="34" fill="none" stroke="#CA8A04" strokeWidth="0.5" opacity="0.3" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="#CA8A04" strokeWidth="0.5" opacity="0.25" />

        {/* 2. THE 10 PRESTIGE STARS (5 ON LEFT, 5 ON RIGHT) */}
        {/* Left 5 Stars (Top to Bottom along the curve) */}
        <g fill="url(#mw2StarGold)" stroke="#451A03" strokeWidth="0.3">
          {/* Star 1 (Top Left) */}
          <polygon points="21,25 22.5,28 25.5,28.5 23,30.5 24,33.5 21,32 18,33.5 19,30.5 16.5,28.5 19.5,28" transform="scale(0.85) translate(4, 2)" />
          {/* Star 2 (Upper-Mid Left) */}
          <polygon points="17,37 18.5,40 21.5,40.5 19,42.5 20,45.5 17,44 14,45.5 15,42.5 12.5,40.5 15.5,40" transform="scale(0.85) translate(3, 4)" />
          {/* Star 3 (Center Left) */}
          <polygon points="16,50 17.5,53 20.5,53.5 18,55.5 19,58.5 16,57 13,58.5 14,55.5 11.5,53.5 14.5,53" transform="scale(0.85) translate(2, 6)" />
          {/* Star 4 (Lower-Mid Left) */}
          <polygon points="18,63 19.5,66 22.5,66.5 20,68.5 21,71.5 18,70 15,71.5 16,68.5 13.5,66.5 16.5,66" transform="scale(0.85) translate(4, 8)" />
          {/* Star 5 (Bottom Left) */}
          <polygon points="23,75 24.5,78 27.5,78.5 25,80.5 26,83.5 23,82 20,83.5 21,80.5 18.5,78.5 21.5,78" transform="scale(0.85) translate(6, 9)" />
        </g>

        {/* Right 5 Stars (Top to Bottom along the curve) */}
        <g fill="url(#mw2StarGold)" stroke="#451A03" strokeWidth="0.3">
          {/* Star 6 (Top Right) */}
          <polygon points="79,25 80.5,28 83.5,28.5 81,30.5 82,33.5 79,32 76,33.5 77,30.5 74.5,28.5 77.5,28" transform="scale(0.85) translate(14, 2)" />
          {/* Star 7 (Upper-Mid Right) */}
          <polygon points="83,37 84.5,40 87.5,40.5 85,42.5 86,45.5 83,44 80,45.5 81,42.5 78.5,40.5 81.5,40" transform="scale(0.85) translate(15, 4)" />
          {/* Star 8 (Center Right) */}
          <polygon points="84,50 85.5,53 88.5,53.5 86,55.5 87,58.5 84,57 81,58.5 82,55.5 79.5,53.5 82.5,53" transform="scale(0.85) translate(16, 6)" />
          {/* Star 9 (Lower-Mid Right) */}
          <polygon points="82,63 83.5,66 86.5,66.5 84,68.5 85,71.5 82,70 79,71.5 80,68.5 77.5,66.5 80.5,66" transform="scale(0.85) translate(14, 8)" />
          {/* Star 10 (Bottom Right) */}
          <polygon points="77,75 78.5,78 81.5,78.5 79,80.5 80,83.5 77,82 74,83.5 75,80.5 72.5,78.5 75.5,78" transform="scale(0.85) translate(12, 9)" />
        </g>

        {/* 3. EMBOSSED GOLDEN SKULL (CENTERPIECE) */}
        {/* Skull Drop Shadow on Coin Face */}
        <path
          d="M32 40 C32 23, 40 18, 50 18 C60 18, 68 23, 68 40 C68 46, 65 50, 64 54 C63 58, 61 62, 61 68 C61 74, 57 78, 50 78 C43 78, 39 74, 39 68 C39 62, 37 58, 36 54 C35 50, 32 46, 32 40 Z"
          fill="#000000"
          opacity="0.8"
          transform="translate(0, 2)"
        />

        {/* Skull Base Relief Mesh */}
        <path
          d="M32 38 C32 22, 40 17, 50 17 C60 17, 68 22, 68 38 C68 44, 65 48, 64 52 C63 56, 61 60, 61 66 C61 72, 57 76, 50 76 C43 76, 39 72, 39 66 C39 60, 37 56, 36 52 C35 48, 32 44, 32 38 Z"
          fill="url(#mw2SkullRelief)"
          stroke="#451A03"
          strokeWidth="1.2"
        />

        {/* Cranium Top Highlight Glow */}
        <ellipse cx="50" cy="22" rx="12" ry="4" fill="#FFFFF0" opacity="0.4" />

        {/* 4 HORIZONTAL FOREHEAD RIDGES/PLATES (Iconic MW2 Banded Skull Feature) */}
        {/* Ridge 1 (Upper) */}
        <path
          d="M37 24 C41 22, 46 21, 50 21 C54 21, 59 22, 63 24"
          fill="none"
          stroke="url(#mw2RidgeGold)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M37 25.5 C41 23.5, 46 22.5, 50 22.5 C54 22.5, 59 23.5, 63 25.5"
          fill="none"
          stroke="#381D03"
          strokeWidth="0.8"
        />

        {/* Ridge 2 (Mid-High) */}
        <path
          d="M35 28.5 C40 26.5, 45 25.5, 50 25.5 C55 25.5, 60 26.5, 65 28.5"
          fill="none"
          stroke="url(#mw2RidgeGold)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M35 30 C40 28, 45 27, 50 27 C55 27, 60 28, 65 30"
          fill="none"
          stroke="#381D03"
          strokeWidth="0.8"
        />

        {/* Ridge 3 (Mid) */}
        <path
          d="M34 34 C39 31.5, 45 30.5, 50 30.5 C55 30.5, 61 31.5, 66 34"
          fill="none"
          stroke="url(#mw2RidgeGold)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M34 35.5 C39 33, 45 32, 50 32 C55 32, 61 33, 66 35.5"
          fill="none"
          stroke="#381D03"
          strokeWidth="0.8"
        />

        {/* Ridge 4 / Brow Plate (Heavy Eyebrow Arch) */}
        <path
          d="M33 39 C38 36, 44 38, 50 37 C56 38, 62 36, 67 39"
          fill="none"
          stroke="#FFFDE0"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M33 40 C38 37, 44 39, 50 38 C56 39, 62 37, 67 40"
          fill="none"
          stroke="#451A03"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* DEEP MENACING EYE SOCKETS (Sunken dark voids with sharp angular slant) */}
        {/* Left Eye */}
        <path
          d="M36 42.5 C36 41, 42 42, 44 46 C44 49.5, 41 51, 38 50 C36 49, 35 44, 36 42.5 Z"
          fill="#0a0501"
          stroke="#78350F"
          strokeWidth="1"
        />
        {/* Left Eye Inner Glint */}
        <ellipse cx="40" cy="46" rx="2" ry="1.2" fill="#EAB308" opacity="0.35" />

        {/* Right Eye */}
        <path
          d="M64 42.5 C64 41, 58 42, 56 46 C56 49.5, 59 51, 62 50 C64 49, 65 44, 64 42.5 Z"
          fill="#0a0501"
          stroke="#78350F"
          strokeWidth="1"
        />
        {/* Right Eye Inner Glint */}
        <ellipse cx="60" cy="46" rx="2" ry="1.2" fill="#EAB308" opacity="0.35" />

        {/* NASAL CAVITY (Inverted triangle/pear cavity) */}
        <path
          d="M49 46.5 L51 46.5 L51.5 52 L50 54 L48.5 52 Z"
          fill="#080401"
          stroke="#542504"
          strokeWidth="0.8"
        />

        {/* CHEEKBONE CONTOURS (Zygomatic Arches) */}
        <path
          d="M33 48 C34 52, 37 54, 41 55"
          fill="none"
          stroke="#FFFBEB"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M67 48 C66 52, 63 54, 59 55"
          fill="none"
          stroke="#FFFBEB"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M32 50 C34 54, 38 56, 42 56.5"
          fill="none"
          stroke="#542504"
          strokeWidth="1.2"
        />
        <path
          d="M68 50 C66 54, 62 56, 58 56.5"
          fill="none"
          stroke="#542504"
          strokeWidth="1.2"
        />

        {/* MOUTH & COMPLETE UPPER/LOWER TEETH ROWS */}
        {/* Dark Mouth Cavity Background */}
        <path
          d="M40 59 C40 57.5, 50 57, 60 57 C60 57.5, 60 67, 50 67 C40 67, 40 57.5, 40 59 Z"
          fill="#0c0702"
          stroke="#451A03"
          strokeWidth="0.8"
        />

        {/* UPPER TEETH ROW (Gold Chiseled Teeth) */}
        <g fill="url(#mw2RidgeGold)" stroke="#381D03" strokeWidth="0.4">
          <rect x="41" y="58" width="2.6" height="4" rx="0.4" />
          <rect x="44.2" y="58" width="2.6" height="4.5" rx="0.4" />
          <rect x="47.4" y="58" width="2.5" height="4.8" rx="0.4" />
          <rect x="50.1" y="58" width="2.5" height="4.8" rx="0.4" />
          <rect x="53.2" y="58" width="2.6" height="4.5" rx="0.4" />
          <rect x="56.4" y="58" width="2.6" height="4" rx="0.4" />
        </g>

        {/* LOWER TEETH ROW (Grinning mandibular teeth) */}
        <g fill="url(#mw2RidgeGold)" stroke="#381D03" strokeWidth="0.4">
          <rect x="42.5" y="63" width="2.5" height="3.5" rx="0.3" />
          <rect x="45.5" y="63" width="2.8" height="3.8" rx="0.3" />
          <rect x="48.8" y="63" width="2.4" height="3.8" rx="0.3" />
          <rect x="51.7" y="63" width="2.8" height="3.8" rx="0.3" />
          <rect x="55" y="63" width="2.5" height="3.5" rx="0.3" />
        </g>

        {/* CHIN / MANDIBLE JAW BONE */}
        <path
          d="M43 68 C45 73, 47 75, 50 75 C53 75, 55 73, 57 68"
          fill="none"
          stroke="url(#mw2RidgeGold)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M44 69.5 C46 74, 48 75.8, 50 75.8 C52 75.8, 54 74, 56 69.5"
          fill="none"
          stroke="#FFFDE0"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
