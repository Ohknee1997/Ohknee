import React, { useEffect, useState } from 'react';
import logoImg from '../assets/images/ohknee_bw_logo_1787987005299.jpg';

interface OhkneeLogoProps {
  className?: string;
  size?: 'normal' | 'large' | 'huge';
}

export const OhkneeLogo: React.FC<OhkneeLogoProps> = ({ className = '' }) => {
  const [whiteDataUrl, setWhiteDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = logoImg;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Process pixels: make dark logo artwork pure white with transparent background
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Calculate perceived brightness (0 to 255)
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

          if (brightness > 230) {
            // Background white -> fully transparent
            data[i + 3] = 0;
          } else {
            // Turn logo artwork to pure crisp white
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            // Anti-aliased alpha
            if (brightness > 160) {
              const factor = (230 - brightness) / 70;
              data[i + 3] = Math.round(255 * Math.max(0, Math.min(1, factor)));
            } else {
              data[i + 3] = 255;
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setWhiteDataUrl(canvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('Canvas transparency processing fallback', err);
      }
    };
  }, []);

  return (
    <div
      className={`ohk-logo-badge ${className} flex items-center justify-center`}
      id="ohknee-brand-logo-badge"
      style={{ background: 'transparent' }}
    >
      <img
        src={whiteDataUrl || logoImg}
        alt="OHKNEE White Logo"
        className="ohk-logo-img object-contain"
        id="ohknee-logo-image"
        referrerPolicy="no-referrer"
        style={{
          background: 'transparent',
          height: '100%',
          width: 'auto',
          maxHeight: 'none',
          filter: whiteDataUrl ? 'drop-shadow(0 0 1px rgba(255,255,255,0.4))' : 'brightness(0) invert(1)',
        }}
        onError={(e) => {
          (e.currentTarget as HTMLElement).style.display = 'none';
          const fallback = document.getElementById('ohknee-svg-fallback');
          if (fallback) fallback.style.display = 'block';
        }}
      />
      {/* Crisp pure white vector fallback */}
      <svg
        id="ohknee-svg-fallback"
        className="ohk-logo-svg"
        viewBox="0 0 200 130"
        style={{ display: 'none', background: 'transparent', height: '100%', width: 'auto' }}
        aria-hidden="true"
      >
        <g fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round">
          {/* Top Face */}
          <polygon points="100,10 140,28 100,46 60,28" fill="none" />
          <polygon points="100,10 120,19 100,28 80,19" fill="#ffffff" />
          <polygon points="120,19 140,28 120,37 100,28" fill="none" />
          <polygon points="80,19 100,28 80,37 60,28" fill="none" />
          <polygon points="100,28 120,37 100,46 80,37" fill="#ffffff" />

          {/* Left Face */}
          <polygon points="60,28 100,46 100,90 60,72" fill="none" />
          <polygon points="60,28 80,37 80,59 60,50" fill="#ffffff" />
          <polygon points="80,37 100,46 100,68 80,59" fill="none" />
          <polygon points="60,50 80,59 80,81 60,72" fill="none" />
          <polygon points="80,59 100,68 100,90 80,81" fill="#ffffff" />

          {/* Right Face */}
          <polygon points="100,46 140,28 140,72 100,90" fill="#ffffff" />
          <polygon points="100,46 120,37 120,59 100,68" fill="#141824" stroke="#ffffff" />
          <polygon points="120,37 140,28 140,50 120,59" fill="#ffffff" />
          <polygon points="100,68 120,59 120,81 100,90" fill="#ffffff" />
          <polygon points="120,59 140,50 140,72 120,81" fill="#141824" stroke="#ffffff" />
        </g>
        {/* OHKNEE text in pure white */}
        <text
          x="100"
          y="118"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="24"
          letterSpacing="2"
        >
          OHKNEE
        </text>
      </svg>
    </div>
  );
};
