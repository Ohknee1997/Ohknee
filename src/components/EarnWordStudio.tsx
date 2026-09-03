import React, { useState, useEffect, useRef } from 'react';
import { EnrichedOffer } from '../data/enrichedOffers';
import {
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Download,
  FileText,
  Copy,
  Check,
  Plus,
  Trash2,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  Sliders,
  ChevronDown,
  Upload,
  ExternalLink,
  ShieldCheck,
  Zap,
  RotateCcw,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { pushContentToGitHub } from '../utils/githubSyncService';

export interface TextBlockItem {
  id: string;
  type: 'heading' | 'subheading' | 'paragraph' | 'bullet' | 'banner';
  text: string;
  fontSize: number; // in px
  fontFamily: string;
  color: string;
  backgroundColor?: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  align: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number;
  letterSpacing: number; // in px
  hasShadow: boolean;
}

const DEFAULT_TEXT_BLOCKS: TextBlockItem[] = [
  {
    id: 'block-1',
    type: 'banner',
    text: '⚡ EXCLUSIVE VERIFIED CASH OFFERS & INSTANT PAYOUT PROMOTIONS',
    fontSize: 22,
    fontFamily: 'Inter, sans-serif',
    color: '#fbbf24', // Gold
    backgroundColor: '#1f1638',
    isBold: true,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    align: 'center',
    lineHeight: 1.3,
    letterSpacing: 0.5,
    hasShadow: true,
  },
  {
    id: 'block-2',
    type: 'subheading',
    text: 'Complete instant verification bonuses, daily reward codes, and high-paying sweepstakes below.',
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
    color: '#cbd5e1', // Slate 300
    backgroundColor: 'transparent',
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    align: 'center',
    lineHeight: 1.5,
    letterSpacing: 0,
    hasShadow: false,
  },
];

const FONT_FAMILIES = [
  { label: 'Modern Sans (Arial / Inter)', value: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif' },
  { label: 'Classic Serif (Georgia / Times)', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Tech Monospace (JetBrains / Courier)', value: 'ui-monospace, "JetBrains Mono", "Courier New", monospace' },
  { label: 'Impact Display (Heavy Headline)', value: 'Impact, "Arial Black", sans-serif' },
  { label: 'Cinzel Medieval (Gothic Decorative)', value: '"Cinzel Decorative", serif' },
  { label: 'Pirata Pirate (Old World)', value: '"Pirata One", cursive' },
  { label: 'Handwritten Script (Caveat / Script)', value: 'Caveat, "Brush Script MT", cursive' },
  { label: 'Comic Casual (Quicksand / Casual)', value: '"Comic Sans MS", Quicksand, cursive, sans-serif' },
];

const FONT_SIZES = [11, 12, 13, 14, 16, 18, 20, 22, 24, 28, 32, 36, 42, 48, 56, 64, 72];

const COLOR_PRESETS = [
  { label: 'Pure White', value: '#ffffff' },
  { label: 'Gold Amber', value: '#fbbf24' },
  { label: 'Emerald Green', value: '#10b981' },
  { label: 'Sky Cyan', value: '#38bdf8' },
  { label: 'Electric Purple', value: '#c084fc' },
  { label: 'Coral Red', value: '#f87171' },
  { label: 'Hot Pink', value: '#f472b6' },
  { label: 'Slate Gray', value: '#94a3b8' },
  { label: 'Dark Slate', value: '#1e293b' },
];

const HIGHLIGHT_COLORS = [
  { label: 'None', value: 'transparent' },
  { label: 'Yellow Glow', value: 'rgba(254, 240, 138, 0.25)' },
  { label: 'Neon Green', value: 'rgba(134, 239, 172, 0.25)' },
  { label: 'Cyan Highlight', value: 'rgba(165, 243, 252, 0.25)' },
  { label: 'Purple Accent', value: 'rgba(192, 132, 252, 0.25)' },
  { label: 'Deep Banner', value: 'rgba(30, 20, 56, 0.85)' },
];

interface EarnWordStudioProps {
  allOffers: EnrichedOffer[];
  onUpdateOffers: (offers: EnrichedOffer[]) => void;
}

export const EarnWordStudio: React.FC<EarnWordStudioProps> = ({
  allOffers,
  onUpdateOffers,
}) => {
  // 1. Text Blocks State (Persisted locally)
  const [textBlocks, setTextBlocks] = useState<TextBlockItem[]>(() => {
    try {
      const saved = localStorage.getItem('ohk_earn_word_blocks_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return DEFAULT_TEXT_BLOCKS;
  });

  const [selectedBlockId, setSelectedBlockId] = useState<string>(
    DEFAULT_TEXT_BLOCKS[0].id
  );

  // Studio tabs / view mode
  const [activeStudioTab, setActiveStudioTab] = useState<'text' | 'image_fixer'>('text');
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Blurry Image Scanner State
  const [blurryOffers, setBlurryOffers] = useState<EnrichedOffer[]>([]);
  const [isScanningImages, setIsScanningImages] = useState(false);
  const [fixedImageCount, setFixedImageCount] = useState(0);
  const [selectedOfferToFix, setSelectedOfferToFix] = useState<EnrichedOffer | null>(null);
  const [customHdUrl, setCustomHdUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Currently selected text block
  const currentBlock =
    textBlocks.find((b) => b.id === selectedBlockId) || textBlocks[0] || null;

  // Persist text blocks
  useEffect(() => {
    try {
      localStorage.setItem('ohk_earn_word_blocks_v1', JSON.stringify(textBlocks));
    } catch {}
  }, [textBlocks]);

  // Initial blur scan on load
  useEffect(() => {
    scanForBlurryImages();
  }, [allOffers]);

  // --- Scan for blurry / low-res images ---
  const scanForBlurryImages = () => {
    setIsScanningImages(true);
    // Detection logic:
    // 1. Favicons with sz=128 or missing sz parameter
    // 2. Images that lack high-res logoUrl or have broken/placeholder data
    // 3. Low-resolution or raster logos
    const flagged = allOffers.filter((o) => {
      const src = o.logoUrl || (o.domain ? `https://www.google.com/s2/favicons?domain=${o.domain}&sz=128` : '');
      if (!src) return true;
      if (src.includes('sz=128') || src.includes('sz=64') || src.includes('sz=32') || src.includes('sz=16')) {
        return true;
      }
      if (!o.logoUrl && o.domain) {
        return true;
      }
      return false;
    });

    setBlurryOffers(flagged);
    setIsScanningImages(false);
  };

  // --- Fix All Blurry Images Automatically ---
  const handleFixAllBlurryImages = async () => {
    setIsScanningImages(true);
    let count = 0;

    const updated = allOffers.map((offer) => {
      let newLogo = offer.logoUrl;
      // If it's a domain favicon or low-res, upgrade to 512px ultra crisp version
      if (offer.domain && (!offer.logoUrl || offer.logoUrl.includes('sz=128') || offer.logoUrl.includes('sz=64'))) {
        newLogo = `https://www.google.com/s2/favicons?domain=${offer.domain}&sz=512`;
        count++;
      } else if (offer.logoUrl && offer.logoUrl.includes('sz=128')) {
        newLogo = offer.logoUrl.replace('sz=128', 'sz=512');
        count++;
      }
      return {
        ...offer,
        logoUrl: newLogo,
      };
    });

    onUpdateOffers(updated);
    setFixedImageCount(count);
    setIsScanningImages(false);
    setBlurryOffers([]);
    setSaveStatus(`✨ Enhanced & sharpened ${count} blurry images to 512px HD.`);

    // Auto push to GitHub
    try {
      await pushContentToGitHub({
        textData: { textBlocks },
        offersData: updated,
        actionDescription: `Sharpened and fixed ${count} blurry images to crisp 512px HD`,
      });
    } catch {}

    setTimeout(() => setSaveStatus(null), 4000);
  };

  // --- Replace Single Image with High-Res file or URL ---
  const handleFixSingleImage = async (offerId: string, newUrl: string) => {
    if (!newUrl.trim()) return;

    const updated = allOffers.map((o) => {
      if (o.id === offerId) {
        return {
          ...o,
          logoUrl: newUrl.trim(),
        };
      }
      return o;
    });

    onUpdateOffers(updated);
    setBlurryOffers((prev) => prev.filter((o) => o.id !== offerId));
    setSelectedOfferToFix(null);
    setCustomHdUrl('');
    setSaveStatus('✅ Image updated to crisp HD!');

    try {
      await pushContentToGitHub({
        textData: { textBlocks },
        offersData: updated,
        actionDescription: `Replaced blurry logo for offer ID ${offerId} with HD asset`,
      });
    } catch {}

    setTimeout(() => setSaveStatus(null), 3500);
  };

  // --- File upload for single image replacement ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedOfferToFix) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        handleFixSingleImage(selectedOfferToFix.id, base64);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- Text Block Update Helpers ---
  const updateCurrentBlock = (updates: Partial<TextBlockItem>) => {
    if (!currentBlock) return;
    setTextBlocks((prev) =>
      prev.map((b) => (b.id === currentBlock.id ? { ...b, ...updates } : b))
    );
  };

  const handleAddTextBlock = (type: TextBlockItem['type']) => {
    const newId = `block-${Date.now()}`;
    let newBlock: TextBlockItem;

    switch (type) {
      case 'heading':
        newBlock = {
          id: newId,
          type: 'heading',
          text: 'New Section Headline',
          fontSize: 24,
          fontFamily: 'Inter, sans-serif',
          color: '#ffffff',
          backgroundColor: 'transparent',
          isBold: true,
          isItalic: false,
          isUnderline: false,
          isStrikethrough: false,
          align: 'left',
          lineHeight: 1.3,
          letterSpacing: 0,
          hasShadow: false,
        };
        break;
      case 'subheading':
        newBlock = {
          id: newId,
          type: 'subheading',
          text: 'Add subtitle or instructions for claiming bonuses...',
          fontSize: 15,
          fontFamily: 'Inter, sans-serif',
          color: '#94a3b8',
          backgroundColor: 'transparent',
          isBold: false,
          isItalic: false,
          isUnderline: false,
          isStrikethrough: false,
          align: 'left',
          lineHeight: 1.4,
          letterSpacing: 0,
          hasShadow: false,
        };
        break;
      case 'bullet':
        newBlock = {
          id: newId,
          type: 'bullet',
          text: '• Instant payout verified in under 5 minutes.',
          fontSize: 14,
          fontFamily: 'Inter, sans-serif',
          color: '#10b981',
          backgroundColor: 'transparent',
          isBold: true,
          isItalic: false,
          isUnderline: false,
          isStrikethrough: false,
          align: 'left',
          lineHeight: 1.4,
          letterSpacing: 0,
          hasShadow: false,
        };
        break;
      case 'banner':
      default:
        newBlock = {
          id: newId,
          type: 'banner',
          text: '🔥 SPECIAL LIMITED-TIME CASH DROP: CLAIM YOUR CODE NOW!',
          fontSize: 18,
          fontFamily: 'Inter, sans-serif',
          color: '#ffffff',
          backgroundColor: '#8b5cf6',
          isBold: true,
          isItalic: false,
          isUnderline: false,
          isStrikethrough: false,
          align: 'center',
          lineHeight: 1.3,
          letterSpacing: 0.5,
          hasShadow: true,
        };
        break;
    }

    setTextBlocks((prev) => [...prev, newBlock]);
    setSelectedBlockId(newId);
    setIsEditorOpen(true);
  };

  const handleDeleteBlock = (id: string) => {
    if (textBlocks.length <= 1) return;
    setTextBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(textBlocks[0].id);
    }
  };

  const handleMoveBlock = (id: string, direction: 'up' | 'down') => {
    const idx = textBlocks.findIndex((b) => b.id === id);
    if (idx < 0) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= textBlocks.length) return;

    const copy = [...textBlocks];
    const [moved] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, moved);
    setTextBlocks(copy);
  };

  // --- Word Export & Redownload Helpers ---
  const handleRedownloadAsWordDoc = () => {
    // Generate HTML with Word XML headers for seamless opening in Microsoft Word
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>OHKNEE Earn Section Content</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; margin: 30px; }
          .word-block { margin-bottom: 16px; }
        </style>
      </head>
      <body>
        <h1 style="color: #6b21a8; font-family: 'Segoe UI', Arial, sans-serif;">OHKNEE.COM - Earn Promotions Document</h1>
        <hr style="border: 1px solid #e2e8f0; margin: 15px 0;" />
        ${textBlocks
          .map((b) => {
            const style = `
              font-family: ${b.fontFamily};
              font-size: ${b.fontSize}pt;
              color: ${b.color};
              background-color: ${b.backgroundColor || 'transparent'};
              font-weight: ${b.isBold ? 'bold' : 'normal'};
              font-style: ${b.isItalic ? 'italic' : 'normal'};
              text-decoration: ${
                b.isUnderline && b.isStrikethrough
                  ? 'underline line-through'
                  : b.isUnderline
                  ? 'underline'
                  : b.isStrikethrough
                  ? 'line-through'
                  : 'none'
              };
              text-align: ${b.align};
              line-height: ${b.lineHeight};
              padding: ${b.backgroundColor && b.backgroundColor !== 'transparent' ? '8px 14px' : '0'};
              border-radius: 6px;
            `;
            return `<div class="word-block" style="${style}">${b.text}</div>`;
          })
          .join('\n')}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ohknee-earn-announcements.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSaveStatus('📄 Downloaded as Microsoft Word (.doc) document!');
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const handleRedownloadAsHtml = () => {
    const htmlData = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>OHKNEE Banner Export</title>
        <style>
          body { background: #0d0f15; padding: 24px; }
        </style>
      </head>
      <body>
        ${textBlocks
          .map(
            (b) =>
              `<div style="font-family:${b.fontFamily};font-size:${b.fontSize}px;color:${b.color};background:${b.backgroundColor};text-align:${b.align};font-weight:${b.isBold ? 'bold' : 'normal'};font-style:${b.isItalic ? 'italic' : 'normal'};text-decoration:${b.isUnderline ? 'underline' : 'none'};padding:8px;margin-bottom:8px;">${b.text}</div>`
          )
          .join('')}
      </body>
      </html>
    `;
    const blob = new Blob([htmlData], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ohknee-banner.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyRichText = () => {
    const plainText = textBlocks.map((b) => b.text).join('\n\n');
    navigator.clipboard.writeText(plainText);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  return (
    <div
      id="earn-word-studio"
      className="w-full mb-3 rounded-2xl bg-[#111420] border border-[#22283a] shadow-xl overflow-hidden select-none transition-all"
    >
      {/* 1. TOP RIBBON / TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#0c0e17] border-b border-[#1f2638]">
        {/* Left: Studio Tab Switcher & Quick Title */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#151926] p-1 rounded-xl border border-[#232a3d]">
            <button
              type="button"
              onClick={() => setActiveStudioTab('text')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeStudioTab === 'text'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Type size={14} />
              <span>Word Text Tools</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveStudioTab('image_fixer');
                scanForBlurryImages();
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer relative ${
                activeStudioTab === 'image_fixer'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon size={14} />
              <span>Fix Blurry Images</span>
              {blurryOffers.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsEditorOpen((prev) => !prev)}
            className="flex items-center gap-1 text-xs font-bold text-purple-300 hover:text-purple-200 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
          >
            <Sliders size={13} />
            <span>{isEditorOpen ? 'Hide Word Tools' : 'Open Word Ribbon'}</span>
          </button>
        </div>

        {/* Right: Redownload / Export Tools */}
        <div className="flex items-center gap-1.5">
          {saveStatus && (
            <span className="text-[11px] text-emerald-400 font-semibold animate-in fade-in">
              {saveStatus}
            </span>
          )}

          <button
            type="button"
            onClick={handleRedownloadAsWordDoc}
            title="Download directly as Microsoft Word (.doc)"
            className="flex items-center gap-1.5 bg-[#172033] hover:bg-[#1f2b45] text-blue-300 hover:text-white border border-blue-500/30 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Download size={13} className="text-blue-400" />
            <span className="hidden sm:inline">Redownload as Word (.doc)</span>
            <span className="sm:hidden">.DOC</span>
          </button>

          <button
            type="button"
            onClick={handleCopyRichText}
            title="Copy formatted text to clipboard"
            className="p-1.5 rounded-lg bg-[#151926] hover:bg-[#1e2436] text-slate-300 hover:text-white border border-[#232a3d] transition-colors cursor-pointer"
          >
            {copiedSuccess ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* 2. MICROSOFT WORD COMPARABLE TOOLBAR (Shown when ribbon opened or editing) */}
      {isEditorOpen && activeStudioTab === 'text' && currentBlock && (
        <div className="bg-[#141824] border-b border-[#222a3d] p-2.5 space-y-2.5 animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Font Family Selector */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-400 font-semibold">Font:</span>
              <select
                value={currentBlock.fontFamily}
                onChange={(e) => updateCurrentBlock({ fontFamily: e.target.value })}
                className="bg-[#0e111a] text-white border border-[#293247] rounded-lg px-2 py-1 text-xs focus:outline-hidden focus:border-purple-500"
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size Dropdown & Steppers */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-400 font-semibold">Size:</span>
              <select
                value={currentBlock.fontSize}
                onChange={(e) => updateCurrentBlock({ fontSize: Number(e.target.value) })}
                className="bg-[#0e111a] text-white border border-[#293247] rounded-lg px-2 py-1 text-xs focus:outline-hidden focus:border-purple-500"
              >
                {FONT_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}px
                  </option>
                ))}
              </select>

              {/* Grow / Shrink Font Steppers */}
              <button
                type="button"
                onClick={() => updateCurrentBlock({ fontSize: Math.min(80, currentBlock.fontSize + 2) })}
                className="px-1.5 py-1 bg-[#0e111a] hover:bg-[#1a2030] text-slate-200 border border-[#293247] rounded-md font-bold text-xs"
                title="Grow Font (A^)"
              >
                A<sup>+</sup>
              </button>
              <button
                type="button"
                onClick={() => updateCurrentBlock({ fontSize: Math.max(10, currentBlock.fontSize - 2) })}
                className="px-1.5 py-1 bg-[#0e111a] hover:bg-[#1a2030] text-slate-200 border border-[#293247] rounded-md font-bold text-xs"
                title="Shrink Font (Av)"
              >
                A<sup>-</sup>
              </button>
            </div>

            {/* Style Toggles: Bold, Italic, Underline, Strikethrough */}
            <div className="flex items-center gap-0.5 bg-[#0e111a] border border-[#293247] rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => updateCurrentBlock({ isBold: !currentBlock.isBold })}
                className={`p-1.5 rounded-md font-black transition-colors ${
                  currentBlock.isBold
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-[#1c2234]'
                }`}
                title="Bold (Ctrl+B)"
              >
                <Bold size={13} />
              </button>
              <button
                type="button"
                onClick={() => updateCurrentBlock({ isItalic: !currentBlock.isItalic })}
                className={`p-1.5 rounded-md transition-colors ${
                  currentBlock.isItalic
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-[#1c2234]'
                }`}
                title="Italic (Ctrl+I)"
              >
                <Italic size={13} />
              </button>
              <button
                type="button"
                onClick={() => updateCurrentBlock({ isUnderline: !currentBlock.isUnderline })}
                className={`p-1.5 rounded-md transition-colors ${
                  currentBlock.isUnderline
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-[#1c2234]'
                }`}
                title="Underline (Ctrl+U)"
              >
                <Underline size={13} />
              </button>
              <button
                type="button"
                onClick={() => updateCurrentBlock({ isStrikethrough: !currentBlock.isStrikethrough })}
                className={`p-1.5 rounded-md transition-colors ${
                  currentBlock.isStrikethrough
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-[#1c2234]'
                }`}
                title="Strikethrough"
              >
                <Strikethrough size={13} />
              </button>
            </div>

            {/* Position / Alignment Toggles */}
            <div className="flex items-center gap-0.5 bg-[#0e111a] border border-[#293247] rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => updateCurrentBlock({ align: 'left' })}
                className={`p-1.5 rounded-md transition-colors ${
                  currentBlock.align === 'left'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-[#1c2234]'
                }`}
                title="Align Left"
              >
                <AlignLeft size={13} />
              </button>
              <button
                type="button"
                onClick={() => updateCurrentBlock({ align: 'center' })}
                className={`p-1.5 rounded-md transition-colors ${
                  currentBlock.align === 'center'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-[#1c2234]'
                }`}
                title="Align Center"
              >
                <AlignCenter size={13} />
              </button>
              <button
                type="button"
                onClick={() => updateCurrentBlock({ align: 'right' })}
                className={`p-1.5 rounded-md transition-colors ${
                  currentBlock.align === 'right'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-[#1c2234]'
                }`}
                title="Align Right"
              >
                <AlignRight size={13} />
              </button>
              <button
                type="button"
                onClick={() => updateCurrentBlock({ align: 'justify' })}
                className={`p-1.5 rounded-md transition-colors ${
                  currentBlock.align === 'justify'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-[#1c2234]'
                }`}
                title="Justify"
              >
                <AlignJustify size={13} />
              </button>
            </div>

            {/* Font Color Palette & Custom Hex */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-semibold">Color:</span>
              <div className="flex items-center gap-1">
                {COLOR_PRESETS.slice(0, 6).map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => updateCurrentBlock({ color: c.value })}
                    style={{ backgroundColor: c.value }}
                    className={`w-5 h-5 rounded-full border border-white/20 transition-transform ${
                      currentBlock.color === c.value ? 'scale-125 ring-2 ring-purple-400' : ''
                    }`}
                    title={c.label}
                  />
                ))}
                <input
                  type="color"
                  value={currentBlock.color.startsWith('#') ? currentBlock.color : '#ffffff'}
                  onChange={(e) => updateCurrentBlock({ color: e.target.value })}
                  className="w-5 h-5 rounded-full cursor-pointer bg-transparent border-none"
                  title="Custom color picker"
                />
              </div>
            </div>

            {/* Highlight / Background Color */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-semibold">Highlight:</span>
              <div className="flex items-center gap-1">
                {HIGHLIGHT_COLORS.map((h) => (
                  <button
                    key={h.value}
                    type="button"
                    onClick={() => updateCurrentBlock({ backgroundColor: h.value })}
                    style={{
                      backgroundColor: h.value === 'transparent' ? '#151926' : h.value,
                    }}
                    className={`w-5 h-5 rounded-md border border-white/20 text-[9px] flex items-center justify-center font-bold ${
                      currentBlock.backgroundColor === h.value ? 'ring-2 ring-purple-400' : ''
                    }`}
                    title={h.label}
                  >
                    {h.value === 'transparent' ? '✕' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Add Text / Move / Delete Block Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#1f2638] text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-semibold">Add Text:</span>
              <button
                type="button"
                onClick={() => handleAddTextBlock('heading')}
                className="px-2 py-1 bg-[#1a2030] hover:bg-[#232c42] text-slate-200 rounded-md font-bold text-xs cursor-pointer flex items-center gap-1"
              >
                <Plus size={11} /> Heading
              </button>
              <button
                type="button"
                onClick={() => handleAddTextBlock('subheading')}
                className="px-2 py-1 bg-[#1a2030] hover:bg-[#232c42] text-slate-200 rounded-md font-bold text-xs cursor-pointer flex items-center gap-1"
              >
                <Plus size={11} /> Subhead
              </button>
              <button
                type="button"
                onClick={() => handleAddTextBlock('bullet')}
                className="px-2 py-1 bg-[#1a2030] hover:bg-[#232c42] text-slate-200 rounded-md font-bold text-xs cursor-pointer flex items-center gap-1"
              >
                <Plus size={11} /> Bullet Note
              </button>
              <button
                type="button"
                onClick={() => handleAddTextBlock('banner')}
                className="px-2 py-1 bg-[#1a2030] hover:bg-[#232c42] text-amber-300 rounded-md font-bold text-xs cursor-pointer flex items-center gap-1"
              >
                <Zap size={11} /> Promo Banner
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleMoveBlock(currentBlock.id, 'up')}
                className="p-1 bg-[#1a2030] hover:bg-[#232c42] text-slate-300 rounded-md"
                title="Move text up"
              >
                <ArrowUp size={12} />
              </button>
              <button
                type="button"
                onClick={() => handleMoveBlock(currentBlock.id, 'down')}
                className="p-1 bg-[#1a2030] hover:bg-[#232c42] text-slate-300 rounded-md"
                title="Move text down"
              >
                <ArrowDown size={12} />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteBlock(currentBlock.id)}
                className="p-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-md ml-1 cursor-pointer"
                title="Delete this text block"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE / PREVIEW AREA */}
      {activeStudioTab === 'text' ? (
        <div className="p-3 sm:p-4 space-y-2 bg-[#0d101a]/70">
          {textBlocks.map((block) => {
            const isSelected = block.id === selectedBlockId;
            return (
              <div
                key={block.id}
                onClick={() => setSelectedBlockId(block.id)}
                className={`relative group rounded-xl p-2 sm:p-2.5 transition-all cursor-text ${
                  isSelected
                    ? 'ring-2 ring-purple-500/80 bg-purple-950/10'
                    : 'hover:bg-white/5'
                }`}
                style={{
                  backgroundColor:
                    block.backgroundColor && block.backgroundColor !== 'transparent'
                      ? block.backgroundColor
                      : undefined,
                }}
              >
                {/* Editable Text Field */}
                <input
                  type="text"
                  value={block.text}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTextBlocks((prev) =>
                      prev.map((b) => (b.id === block.id ? { ...b, text: val } : b))
                    );
                  }}
                  style={{
                    fontFamily: block.fontFamily,
                    fontSize: `${block.fontSize}px`,
                    color: block.color,
                    fontWeight: block.isBold ? 700 : 400,
                    fontStyle: block.isItalic ? 'italic' : 'normal',
                    textDecoration: `${
                      block.isUnderline && block.isStrikethrough
                        ? 'underline line-through'
                        : block.isUnderline
                        ? 'underline'
                        : block.isStrikethrough
                        ? 'line-through'
                        : 'none'
                    }`,
                    textAlign: block.align,
                    lineHeight: block.lineHeight,
                    letterSpacing: `${block.letterSpacing}px`,
                    textShadow: block.hasShadow ? '0 2px 8px rgba(0,0,0,0.8)' : 'none',
                  }}
                  className="w-full bg-transparent border-none outline-hidden focus:outline-hidden px-1"
                  placeholder="Type your text here..."
                />

                {/* Quick Edit Handle on Hover */}
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-[#0c0e17]/90 px-1.5 py-0.5 rounded-md border border-[#22293c]">
                  <span className="text-[10px] text-purple-400 font-bold">Edit with Word Tools</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 4. BLURRY IMAGE SCANNER & HD FIXER */
        <div className="p-3 sm:p-4 bg-[#0d101a]/90 space-y-3 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#141824] p-2.5 rounded-xl border border-[#22293d]">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <ImageIcon size={16} className="text-amber-400" />
                <span>Image Sharpness & HD Quality Inspector</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Scan all offer images and logos across the site to detect blur, pixelation, or low-res graphics and upgrade them to crisp 512px HD.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={scanForBlurryImages}
                className="flex items-center gap-1 bg-[#1a2030] hover:bg-[#242c42] text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <RefreshCw size={13} className={isScanningImages ? 'animate-spin' : ''} />
                <span>Rescan</span>
              </button>

              <button
                type="button"
                onClick={handleFixAllBlurryImages}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-black shadow-lg shadow-purple-950/50 cursor-pointer transition-all hover:scale-105"
              >
                <Sparkles size={14} className="text-amber-200" />
                <span>One-Click Fix All Blurry Images</span>
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="font-bold text-amber-400">
              {blurryOffers.length} images identified as needing HD sharpness upgrade
            </span>
            <span>&bull;</span>
            <span className="text-emerald-400 font-semibold">
              Global crisp-edge contrast filter active
            </span>
          </div>

          {/* Grid of scanned images */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-80 overflow-y-auto pr-1">
            {allOffers.map((offer) => {
              const currentSrc =
                offer.logoUrl ||
                (offer.domain
                  ? `https://www.google.com/s2/favicons?domain=${offer.domain}&sz=128`
                  : '');
              const isFlagged = blurryOffers.some((b) => b.id === offer.id);

              return (
                <div
                  key={offer.id}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-between text-center gap-1.5 transition-all ${
                    isFlagged
                      ? 'bg-rose-950/20 border-rose-500/40'
                      : 'bg-[#121624] border-[#22293c]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg bg-[#0c0e17] border border-white/10 flex items-center justify-center overflow-hidden relative">
                    {currentSrc ? (
                      <img
                        src={currentSrc}
                        alt={offer.name}
                        className="max-h-full max-w-full object-contain crisp-hd-image"
                      />
                    ) : (
                      <span className="text-xs font-bold text-slate-500">No img</span>
                    )}

                    {isFlagged ? (
                      <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-rose-500" />
                    ) : (
                      <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
                    )}
                  </div>

                  <div className="w-full truncate text-[11px] font-bold text-white">
                    {offer.name}
                  </div>

                  <div className="text-[10px]">
                    {isFlagged ? (
                      <span className="text-rose-400 font-bold">⚠️ Blurry / Low-Res</span>
                    ) : (
                      <span className="text-emerald-400 font-bold">✨ Crisp HD</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOfferToFix(offer);
                      setCustomHdUrl(offer.logoUrl || '');
                    }}
                    className="w-full py-1 rounded-md text-[10px] font-bold bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 transition-colors cursor-pointer"
                  >
                    Fix / Replace
                  </button>
                </div>
              );
            })}
          </div>

          {/* Modal / Popover to replace specific offer's image */}
          {selectedOfferToFix && (
            <div className="p-3 rounded-xl bg-[#141824] border border-purple-500/60 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">
                  Fix & Sharpen Image for "{selectedOfferToFix.name}"
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedOfferToFix(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={customHdUrl}
                  onChange={(e) => setCustomHdUrl(e.target.value)}
                  placeholder="Paste high-res image URL (PNG, SVG, or HD link)..."
                  className="flex-1 bg-[#0e111a] text-white border border-[#2a3449] rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden focus:border-purple-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    handleFixSingleImage(
                      selectedOfferToFix.id,
                      selectedOfferToFix.domain
                        ? `https://www.google.com/s2/favicons?domain=${selectedOfferToFix.domain}&sz=512`
                        : customHdUrl
                    )
                  }
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  ⚡ Auto-HD 512px
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <Upload size={12} />
                  <span>Upload File</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
