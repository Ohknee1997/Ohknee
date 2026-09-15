import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Sparkles, ShieldCheck, MessageSquare, Radio } from 'lucide-react';
import { recordDeviceClick } from '../utils/deviceAnalytics';

export interface SocialMediaItem {
  id: string;
  name: string;
  handle: string;
  url: string;
  brandColor: string;
  accentRgb: string;
  categoryTag: string;
  description: string;
  badge?: string;
  renderLogo: () => React.ReactNode;
}

export const SOCIAL_MEDIA_LINKS: SocialMediaItem[] = [
  {
    id: 'x',
    name: 'X (Twitter)',
    handle: '@OHKNEEdotCOM',
    url: 'https://x.com/OHKNEEdotCOM',
    brandColor: '#ffffff',
    accentRgb: '255, 255, 255',
    categoryTag: 'Alerts & Drops',
    description: 'Instant flash bonus codes, drop alerts, and site updates.',
    renderLogo: () => (
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] sm:rounded-[16px] bg-black border border-white/20 p-2.5 sm:p-3 flex items-center justify-center shadow-lg shadow-black/80 group-hover:scale-105 transition-transform duration-300">
        <svg viewBox="0 0 24 24" fill="#ffffff" className="w-full h-full" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>
    ),
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@oh_knee97',
    url: 'https://www.instagram.com/oh_knee97?stkn=ZW9iNzdubDdxdW1o',
    brandColor: '#E1306C',
    accentRgb: '225, 48, 108',
    categoryTag: 'Proof & Lifestyle',
    description: 'Cashout screenshots, daily proof stories, and behind the scenes.',
    renderLogo: () => (
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] sm:rounded-[16px] overflow-hidden shadow-lg shadow-pink-600/30 group-hover:scale-105 transition-transform duration-300">
        {/* Authentic Instagram App Icon Gradient & Camera Mark */}
        <svg viewBox="0 0 48 48" className="w-full h-full" aria-hidden="true">
          <defs>
            <radialGradient id="igRadial" cx="20%" cy="105%" r="120%">
              <stop offset="0%" stopColor="#ffd600" />
              <stop offset="10%" stopColor="#ffab00" />
              <stop offset="50%" stopColor="#dd2a7b" />
              <stop offset="100%" stopColor="#8134af" />
            </radialGradient>
            <linearGradient id="igLinear" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#515bd4" />
              <stop offset="40%" stopColor="#dd2a7b" />
              <stop offset="80%" stopColor="#f58529" />
            </linearGradient>
          </defs>
          {/* Base Squircle */}
          <rect width="48" height="48" rx="14" fill="url(#igRadial)" />
          <rect width="48" height="48" rx="14" fill="url(#igLinear)" opacity="0.3" />
          {/* Outer Camera Body */}
          <rect x="10" y="10" width="28" height="28" rx="8" fill="none" stroke="#ffffff" strokeWidth="3" />
          {/* Center Lens */}
          <circle cx="24" cy="24" r="6.5" fill="none" stroke="#ffffff" strokeWidth="3" />
          {/* Flash Dot */}
          <circle cx="31.5" cy="16.5" r="1.8" fill="#ffffff" />
        </svg>
      </div>
    ),
  },
  {
    id: 'threads',
    name: 'Threads',
    handle: '@oh_knee97',
    url: 'https://www.threads.com/@oh_knee97',
    brandColor: '#ffffff',
    accentRgb: '255, 255, 255',
    categoryTag: 'Daily Takes',
    description: 'Quick thoughts, real talks, and instant community answers.',
    renderLogo: () => (
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] sm:rounded-[16px] bg-[#101010] border border-white/15 p-2.5 sm:p-3 flex items-center justify-center shadow-lg shadow-black/80 group-hover:scale-105 transition-transform duration-300">
        <svg viewBox="0 0 24 24" fill="#ffffff" className="w-full h-full" aria-hidden="true">
          <path d="M12.002 0C5.374 0 0 5.372 0 12c0 6.626 5.374 12 12.002 12 6.628 0 11.998-5.374 11.998-12 0-6.628-5.37-12-11.998-12zm4.846 14.123c-.156 2.378-1.488 3.882-3.856 3.882-1.413 0-2.582-.572-3.174-1.558l1.32-.93c.365.61 1.037.988 1.854.988 1.365 0 2.156-.848 2.274-2.28a4.954 4.954 0 0 1-1.916.376c-2.382 0-3.896-1.306-3.896-3.36 0-2.074 1.574-3.52 3.82-3.52 2.348 0 3.864 1.516 3.864 3.984 0 .867-.188 1.76-.29 2.418zm-2.096-3.54c0-1.436-.882-2.34-2.216-2.34-1.282 0-2.128.892-2.128 2.12 0 1.18.814 2.062 2.198 2.062.774 0 1.516-.27 2.146-.778v-1.064z"/>
        </svg>
      </div>
    ),
  },
  {
    id: 'discord',
    name: 'Discord',
    handle: 'Community',
    url: 'https://discord.gg/wBM83fCN5',
    brandColor: '#5865F2',
    accentRgb: '88, 101, 242',
    categoryTag: 'VIP Community',
    description: 'Active discussion channels, member giveaways, and bot drops.',
    renderLogo: () => (
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] sm:rounded-[16px] bg-[#5865F2] p-2.5 sm:p-3 flex items-center justify-center shadow-lg shadow-[#5865F2]/40 group-hover:scale-105 transition-transform duration-300">
        <svg viewBox="0 0 24 24" fill="#ffffff" className="w-full h-full" aria-hidden="true">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      </div>
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
    categoryTag: 'Priority Group (18+)',
    description: 'Direct group channel for real-time questions & priority support.',
    renderLogo: () => (
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] sm:rounded-[16px] bg-[#25D366] p-2.5 sm:p-3 flex items-center justify-center shadow-lg shadow-[#25D366]/40 group-hover:scale-105 transition-transform duration-300">
        <svg viewBox="0 0 24 24" fill="#ffffff" className="w-full h-full" aria-hidden="true">
          <path d="M12.004 0C5.372 0 0 5.372 0 12.004c0 2.115.553 4.184 1.606 6.008L.062 24l6.173-1.618a11.96 11.96 0 0 0 5.769 1.48h.005c6.627 0 12-5.373 12-12.004A12.008 12.008 0 0 0 12.004 0zm0 21.84a9.83 9.83 0 0 1-5.01-1.373l-.36-.214-3.722.976.994-3.629-.234-.374a9.82 9.82 0 0 1-1.507-5.226c0-5.424 4.41-9.835 9.839-9.835a9.78 9.78 0 0 1 6.96 2.883 9.77 9.77 0 0 1 2.879 6.953c0 5.426-4.411 9.839-9.839 9.839zm5.385-7.362c-.295-.148-1.748-.862-2.019-.96-.27-.099-.467-.148-.664.148-.197.295-.764.96-.936 1.157-.173.197-.345.222-.64.074s-1.248-.46-2.378-1.468c-.88-.784-1.474-1.753-1.646-2.049-.172-.296-.018-.456.13-.603.133-.133.295-.345.443-.518.148-.172.197-.295.295-.492.099-.197.049-.37-.025-.518-.074-.148-.665-1.603-.911-2.196-.24-.577-.484-.499-.665-.508-.172-.008-.37-.008-.567-.008s-.517.074-.788.37c-.27.296-1.034 1.011-1.034 2.466 0 1.455 1.059 2.86 1.207 3.057.148.197 2.085 3.184 5.052 4.467.706.305 1.257.488 1.687.624.71.226 1.356.194 1.867.118.57-.086 1.748-.714 1.995-1.405.246-.69.246-1.282.172-.148-.074-.123-.27-.197-.566-.345z"/>
        </svg>
      </div>
    ),
  },
  {
    id: 'youtube',
    name: 'YouTube',
    handle: '@oh_knee7173',
    url: 'https://youtube.com/@oh_knee7173?si=YFfodqNbJcRwj775',
    brandColor: '#FF0000',
    accentRgb: '255, 0, 0',
    categoryTag: 'Video Guides',
    description: 'Detailed step-by-step cashout tutorials and speedrun guides.',
    renderLogo: () => (
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] sm:rounded-[16px] bg-[#FF0000] p-2.5 sm:p-3 flex items-center justify-center shadow-lg shadow-[#FF0000]/40 group-hover:scale-105 transition-transform duration-300">
        <svg viewBox="0 0 24 24" fill="#ffffff" className="w-full h-full" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      </div>
    ),
  },
];

export const SocialsPhoneView: React.FC = () => {
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);

  const handleOpenLink = (social: SocialMediaItem) => {
    recordDeviceClick({
      targetId: `social-btn-${social.id}`,
      targetTag: 'social_card',
      text: `Social Link: ${social.name} (${social.handle})`,
      context: 'socials_tab_redesign',
    });
    window.open(social.url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyHandle = (e: React.MouseEvent, handle: string, socialName: string) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(handle);
      setCopiedHandle(handle);
      recordDeviceClick({
        targetId: `copy-handle-${socialName.toLowerCase()}`,
        targetTag: 'button',
        text: `Copied: ${handle}`,
        context: 'socials_tab_copy',
      });
      setTimeout(() => setCopiedHandle(null), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  return (
    <div
      id="socials-clean-container"
      className="w-full min-h-[calc(100dvh-130px)] flex flex-col items-center justify-start px-3.5 sm:px-6 py-4 sm:py-8 select-none max-w-5xl mx-auto"
    >
      {/* HEADER SECTION: MODERN & CLEAN COMMUNITY HUB */}
      <div className="w-full text-center mb-5 sm:mb-8 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-300 mb-2 shadow-sm">
          <Radio size={13} className="text-emerald-400 animate-pulse" />
          <span>Official Ohknee Channels</span>
          <span className="w-1 h-1 rounded-full bg-slate-500" />
          <span className="text-emerald-400 font-bold">Verified Direct Links</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
          Connect & Follow
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg leading-relaxed">
          Stay updated on flash offers, drop alerts, cashout proofs, and join the private group discussions.
        </p>
      </div>

      {/* 6 MODERN CARDS GRID WITH REAL APP LOGOS */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4.5 items-stretch">
        {SOCIAL_MEDIA_LINKS.map((item) => {
          const isCopied = copiedHandle === item.handle;
          return (
            <div
              key={item.id}
              id={`social-card-${item.id}`}
              onClick={() => handleOpenLink(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleOpenLink(item)}
              className="group relative rounded-2xl border border-slate-800/90 bg-[#0a0d16]/90 hover:bg-[#0f1422] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-slate-600 hover:shadow-2xl cursor-pointer backdrop-blur-md overflow-hidden"
              style={{
                boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5)`,
              }}
            >
              {/* Dynamic Brand Ambient Backglow */}
              <div
                className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                style={{ backgroundColor: item.brandColor }}
              />

              {/* TOP ROW: REAL APP ICON & BADGES */}
              <div className="flex items-start justify-between w-full relative z-10 mb-3">
                <div className="relative">
                  {item.renderLogo()}

                  {/* 18+ Adult Content Badge */}
                  {item.badge && (
                    <span
                      id={`badge-${item.id}`}
                      className="absolute -top-1.5 -right-2 px-1.5 py-0.5 rounded-full bg-red-600 border border-white text-white text-[9px] font-black tracking-tight uppercase shadow-md flex items-center justify-center leading-none"
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Category Purpose Tag */}
                <span
                  className="text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full border border-slate-700/80 bg-slate-900/90 text-slate-300 group-hover:border-slate-500 transition-colors"
                >
                  {item.categoryTag}
                </span>
              </div>

              {/* MIDDLE SECTION: TITLE, DESCRIPTION & HANDLE */}
              <div className="flex flex-col items-start w-full relative z-10 mb-4">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h3>
                  <ShieldCheck size={14} className="text-sky-400" />
                </div>

                <p className="text-xs text-slate-400 mt-1 leading-snug">
                  {item.description}
                </p>

                {/* Handle Chip with Copy Button */}
                <div className="mt-2.5 flex items-center gap-1.5 w-full">
                  <span className="font-mono text-xs text-slate-300 bg-black/70 px-2.5 py-1 rounded-lg border border-slate-800 truncate max-w-[200px]">
                    {item.handle}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCopyHandle(e, item.handle, item.name)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy handle"
                    aria-label={`Copy handle ${item.handle}`}
                  >
                    {isCopied ? (
                      <Check size={13} className="text-emerald-400" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                  {isCopied && (
                    <span className="text-[10px] text-emerald-400 font-bold animate-in fade-in">
                      Copied!
                    </span>
                  )}
                </div>
              </div>

              {/* BOTTOM ROW: CTA BUTTON */}
              <div className="w-full relative z-10 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Open {item.name.split(' ')[0]}</span>
                  <ExternalLink size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-slate-400 group-hover:text-white" />
                </span>

                <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-wider">
                  Connect ↗
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
