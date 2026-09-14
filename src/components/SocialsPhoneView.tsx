import React from 'react';
import { ExternalLink } from 'lucide-react';
import { recordDeviceClick } from '../utils/deviceAnalytics';

export interface SocialMediaItem {
  id: string;
  name: string;
  handle: string;
  url: string;
  brandColor: string;
  accentRgb: string;
  badge?: string;
  renderIcon: (className?: string) => React.ReactNode;
}

export const SOCIAL_MEDIA_LINKS: SocialMediaItem[] = [
  {
    id: 'x',
    name: 'X',
    handle: '@OHKNEEdotCOM',
    url: 'https://x.com/OHKNEEdotCOM',
    brandColor: '#ffffff',
    accentRgb: '255, 255, 255',
    renderIcon: (className = 'w-7 h-7 text-white') => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@oh_knee97',
    url: 'https://www.instagram.com/oh_knee97?stkn=ZW9iNzdubDdxdW1o',
    brandColor: '#E1306C',
    accentRgb: '225, 48, 108',
    renderIcon: (className = 'w-7 h-7 text-white') => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5.5" ry="5.5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'threads',
    name: 'Threads',
    handle: '@oh_knee97',
    url: 'https://www.threads.com/@oh_knee97',
    brandColor: '#ffffff',
    accentRgb: '255, 255, 255',
    renderIcon: (className = 'w-7 h-7 text-white') => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12.002 0C5.374 0 0 5.372 0 12c0 6.626 5.374 12 12.002 12 6.628 0 11.998-5.374 11.998-12 0-6.628-5.37-12-11.998-12zm4.846 14.123c-.156 2.378-1.488 3.882-3.856 3.882-1.413 0-2.582-.572-3.174-1.558l1.32-.93c.365.61 1.037.988 1.854.988 1.365 0 2.156-.848 2.274-2.28a4.954 4.954 0 0 1-1.916.376c-2.382 0-3.896-1.306-3.896-3.36 0-2.074 1.574-3.52 3.82-3.52 2.348 0 3.864 1.516 3.864 3.984 0 .867-.188 1.76-.29 2.418zm-2.096-3.54c0-1.436-.882-2.34-2.216-2.34-1.282 0-2.128.892-2.128 2.12 0 1.18.814 2.062 2.198 2.062.774 0 1.516-.27 2.146-.778v-1.064z"/>
      </svg>
    ),
  },
  {
    id: 'discord',
    name: 'Discord',
    handle: 'Community',
    url: 'https://discord.gg/wBM83fCN5',
    brandColor: '#5865F2',
    accentRgb: '88, 101, 242',
    renderIcon: (className = 'w-7 h-7 text-white') => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    handle: 'Group Chat',
    url: 'https://chat.whatsapp.com/IFCAHhs4NVN3vf1QiOsLJc',
    brandColor: '#25D366',
    accentRgb: '37, 211, 102',
    badge: '18+',
    renderIcon: (className = 'w-7 h-7 text-white') => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12.004 0C5.372 0 0 5.372 0 12.004c0 2.115.553 4.184 1.606 6.008L.062 24l6.173-1.618a11.96 11.96 0 0 0 5.769 1.48h.005c6.627 0 12-5.373 12-12.004A12.008 12.008 0 0 0 12.004 0zm0 21.84a9.83 9.83 0 0 1-5.01-1.373l-.36-.214-3.722.976.994-3.629-.234-.374a9.82 9.82 0 0 1-1.507-5.226c0-5.424 4.41-9.835 9.839-9.835a9.78 9.78 0 0 1 6.96 2.883 9.77 9.77 0 0 1 2.879 6.953c0 5.426-4.411 9.839-9.839 9.839zm5.385-7.362c-.295-.148-1.748-.862-2.019-.96-.27-.099-.467-.148-.664.148-.197.295-.764.96-.936 1.157-.173.197-.345.222-.64.074s-1.248-.46-2.378-1.468c-.88-.784-1.474-1.753-1.646-2.049-.172-.296-.018-.456.13-.603.133-.133.295-.345.443-.518.148-.172.197-.295.295-.492.099-.197.049-.37-.025-.518-.074-.148-.665-1.603-.911-2.196-.24-.577-.484-.499-.665-.508-.172-.008-.37-.008-.567-.008s-.517.074-.788.37c-.27.296-1.034 1.011-1.034 2.466 0 1.455 1.059 2.86 1.207 3.057.148.197 2.085 3.184 5.052 4.467.706.305 1.257.488 1.687.624.71.226 1.356.194 1.867.118.57-.086 1.748-.714 1.995-1.405.246-.69.246-1.282.172-.148-.074-.123-.27-.197-.566-.345z"/>
      </svg>
    ),
  },
  {
    id: 'youtube',
    name: 'YouTube',
    handle: '@oh_knee7173',
    url: 'https://youtube.com/@oh_knee7173?si=YFfodqNbJcRwj775',
    brandColor: '#FF0000',
    accentRgb: '255, 0, 0',
    renderIcon: (className = 'w-7 h-7 text-white') => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

export const SocialsPhoneView: React.FC = () => {
  const handleOpenLink = (social: SocialMediaItem) => {
    // Record click for device analytics
    recordDeviceClick({
      targetId: `social-btn-${social.id}`,
      targetTag: 'button',
      text: `Social: ${social.name} (${social.handle})`,
      context: 'socials_tab',
    });
    window.open(social.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id="socials-clean-container"
      className="w-full min-h-[calc(100dvh-130px)] flex flex-col items-center justify-center px-4 sm:px-6 py-8 select-none"
    >
      {/* LINED UP IN THE MIDDLE OF THE SCREEN: OPAQUE BOXES (CARDS) */}
      <div className="w-full max-w-4xl flex flex-col items-center justify-center">
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 w-full justify-items-center items-stretch">
          {SOCIAL_MEDIA_LINKS.map((item) => (
            <button
              key={item.id}
              type="button"
              id={`social-box-${item.id}`}
              onClick={() => handleOpenLink(item)}
              style={{
                backgroundColor: `rgba(${item.accentRgb}, 0.12)`,
                borderColor: `rgba(${item.accentRgb}, 0.35)`,
              }}
              className="group relative w-full h-[155px] sm:h-[175px] rounded-2xl border p-4 flex flex-col items-center justify-between text-center transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl hover:brightness-110 active:scale-95 cursor-pointer backdrop-blur-md"
            >
              {/* Opaque Inner Icon Box matching middle category cards */}
              <div
                style={{
                  backgroundColor: `rgba(${item.accentRgb}, 0.18)`,
                  borderColor: `rgba(${item.accentRgb}, 0.45)`,
                }}
                className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-xl border flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-md"
              >
                {item.renderIcon('w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow')}

                {/* 18+ Warning Badge */}
                {item.badge && (
                  <span
                    id={`badge-${item.id}`}
                    title="18+ Warning"
                    className="absolute -top-1.5 -right-2 px-1.5 py-0.5 rounded-full bg-red-600 border border-white/90 text-white text-[9px] font-black tracking-tight uppercase shadow-[0_2px_8px_rgba(220,38,38,0.9)] flex items-center justify-center leading-none select-none z-10"
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Title & Handle */}
              <div className="w-full flex flex-col items-center justify-center">
                <span className="text-sm sm:text-base font-bold text-white tracking-wide leading-tight">
                  {item.name}
                </span>
                <span className="text-[11px] sm:text-xs font-mono text-slate-300 truncate max-w-full mt-0.5 opacity-90">
                  {item.handle}
                </span>
              </div>

              {/* Minimalist open cue indicator */}
              <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 group-hover:text-white transition-colors">
                <span>Visit</span>
                <ExternalLink size={10} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
