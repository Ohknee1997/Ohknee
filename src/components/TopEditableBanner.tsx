import React, { useState, useEffect, useRef } from 'react';
import {
  Edit3,
  Check,
  X,
  Lock,
  RotateCcw,
  Image as ImageIcon,
  Upload,
  Github,
  LogOut,
  ShieldAlert,
  Sparkles,
  Link as LinkIcon,
} from 'lucide-react';
import {
  pushContentToGitHub,
  getGitHubConfig,
} from '../utils/githubSyncService';
import { GitHubSyncModal } from './GitHubSyncModal';

const STORAGE_KEY_MAIN = 'ohk_top_banner_main_text';
const STORAGE_KEY_SUB = 'ohk_top_banner_sub_text';
const STORAGE_KEY_IMG = 'ohk_top_banner_image_url';
const ADMIN_AUTH_KEY = 'ohk_admin_role_session';

const DEFAULT_MAIN_TEXT = 'TOP 10 VERIFIED HIGH-PAYOUT OFFERS';
const DEFAULT_SUB_TEXT = 'Instant Payouts • Highest Verified Bonuses • 100% Free to Join';

interface TopEditableBannerProps {
  onOpenGitHubSync?: () => void;
  isAdminLoggedIn?: boolean;
  onAdminLoginChange?: (isLoggedIn: boolean) => void;
}

export const TopEditableBanner: React.FC<TopEditableBannerProps> = ({
  isAdminLoggedIn: parentIsAdmin,
  onAdminLoginChange,
}) => {
  const [mainText, setMainText] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_MAIN) || DEFAULT_MAIN_TEXT;
    } catch {
      return DEFAULT_MAIN_TEXT;
    }
  });

  const [subText, setSubText] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SUB) || DEFAULT_SUB_TEXT;
    } catch {
      return DEFAULT_SUB_TEXT;
    }
  });

  const [bannerImage, setBannerImage] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_IMG) || '';
    } catch {
      return '';
    }
  });

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof parentIsAdmin === 'boolean') return parentIsAdmin;
    try {
      return (
        sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true' ||
        sessionStorage.getItem('ohk_staff_authenticated') === 'true'
      );
    } catch {
      return false;
    }
  });

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  // Form input states
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Edit form states
  const [editMainText, setEditMainText] = useState(mainText);
  const [editSubText, setEditSubText] = useState(subText);
  const [editImageUrl, setEditImageUrl] = useState(bannerImage);
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with parent props if provided
  useEffect(() => {
    if (typeof parentIsAdmin === 'boolean') {
      setIsAdmin(parentIsAdmin);
    }
  }, [parentIsAdmin]);

  const updateAdminSession = (loggedIn: boolean) => {
    setIsAdmin(loggedIn);
    try {
      if (loggedIn) {
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
        sessionStorage.setItem('ohk_staff_authenticated', 'true');
      } else {
        sessionStorage.removeItem(ADMIN_AUTH_KEY);
        sessionStorage.removeItem('ohk_staff_authenticated');
      }
    } catch {}
    if (onAdminLoginChange) {
      onAdminLoginChange(loggedIn);
    }
  };

  const handleEditorButtonClick = () => {
    if (isAdmin) {
      setEditMainText(mainText);
      setEditSubText(subText);
      setEditImageUrl(bannerImage);
      setSaveFeedback(null);
      setIsEditModalOpen(true);
    } else {
      setInputUsername('');
      setInputPassword('');
      setAuthError(null);
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = inputUsername.trim().toLowerCase();
    const p = inputPassword.trim();

    // Authenticate admin: onib / onib1127! or oniamaya3@gmail.com / oniamaya998@gmail.com
    const isAuthorized =
      (u === 'onib' && (p === 'onib1127!' || p === 'Onib1127!')) ||
      (u === 'oniamaya3@gmail.com' && (p === 'onib1127!' || p === 'Onib1127!' || p === 'admin')) ||
      (u === 'oniamaya998@gmail.com' && (p === 'onib1127!' || p === 'Onib1127!' || p === 'admin'));

    if (isAuthorized) {
      updateAdminSession(true);
      setIsAuthModalOpen(false);
      setEditMainText(mainText);
      setEditSubText(subText);
      setEditImageUrl(bannerImage);
      setSaveFeedback(null);
      setIsEditModalOpen(true);
      setAuthError(null);
    } else {
      setAuthError('Access Denied: Invalid admin username or password.');
    }
  };

  const handleLogout = () => {
    updateAdminSession(false);
    setIsEditModalOpen(false);
  };

  // Image file upload handler (converts local image to base64 data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setEditImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  // Save Text & Image and Trigger GitHub Push
  const handleSaveTextAndImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveFeedback('Saving locally...');

    const trimmedMain = editMainText.trim() || DEFAULT_MAIN_TEXT;
    const trimmedSub = editSubText.trim();
    const finalImage = editImageUrl.trim();

    // 1. Update State & Local Storage
    setMainText(trimmedMain);
    setSubText(trimmedSub);
    setBannerImage(finalImage);

    try {
      localStorage.setItem(STORAGE_KEY_MAIN, trimmedMain);
      localStorage.setItem(STORAGE_KEY_SUB, trimmedSub);
      localStorage.setItem(STORAGE_KEY_IMG, finalImage);
    } catch {}

    // 2. Push to GitHub!
    setSaveFeedback('Pushing to GitHub...');
    try {
      const pushRes = await pushContentToGitHub({
        textData: {
          mainText: trimmedMain,
          subText: trimmedSub,
        },
        imageData: {
          bannerImageUrl: finalImage || null,
        },
        actionDescription: 'Updated top banner text and image via Admin role',
      });

      if (pushRes.success) {
        setSaveFeedback('✓ Saved & Pushed to GitHub!');
      } else if (pushRes.error === 'NO_CONFIG') {
        setSaveFeedback('Saved! Configure GitHub to auto-push.');
      } else {
        setSaveFeedback('Saved locally (GitHub push failed - check token)');
      }
    } catch (err: any) {
      setSaveFeedback('Saved locally.');
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setIsEditModalOpen(false);
        setSaveFeedback(null);
      }, 1200);
    }
  };

  const handleResetDefault = () => {
    setEditMainText(DEFAULT_MAIN_TEXT);
    setEditSubText(DEFAULT_SUB_TEXT);
    setEditImageUrl('');
    setMainText(DEFAULT_MAIN_TEXT);
    setSubText(DEFAULT_SUB_TEXT);
    setBannerImage('');
    try {
      localStorage.removeItem(STORAGE_KEY_MAIN);
      localStorage.removeItem(STORAGE_KEY_SUB);
      localStorage.removeItem(STORAGE_KEY_IMG);
    } catch {}
  };

  const ghConfig = getGitHubConfig();

  return (
    <div className="w-full mb-3 sm:mb-4 select-none">
      {/* 1. ADMIN ROLE ACTIVE STATUS BAR (Only shown when logged into Admin Role) */}
      {isAdmin && (
        <div className="mb-2 p-2 sm:p-2.5 rounded-xl bg-[#121724] border border-purple-500/40 flex flex-wrap items-center justify-between gap-2 text-xs shadow-md animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white">Admin Role:</span>
            <span className="px-1.5 py-0.5 rounded bg-purple-950 border border-purple-500/50 text-[11px] font-mono text-purple-300">
              onib
            </span>
            <span className="hidden sm:inline text-slate-400">| Full text & image edit access</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* GitHub Sync Status / Configure */}
            <button
              type="button"
              onClick={() => setIsGitHubModalOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#1a2133] hover:bg-[#232c44] text-[11px] font-bold text-purple-300 hover:text-white border border-[#2b3650] transition-colors"
              title="Configure GitHub repository push"
            >
              <Github size={12} />
              <span>{ghConfig.token ? 'GitHub: Ready' : 'Setup GitHub Sync'}</span>
            </button>

            {/* Edit Banner & Image Button */}
            <button
              type="button"
              onClick={handleEditorButtonClick}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-[11px] font-black text-white transition-colors shadow-xs"
            >
              <Edit3 size={12} />
              <span>Edit Text & Img</span>
            </button>

            {/* Logout from Admin */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#1e1a24] hover:bg-rose-950/60 text-[11px] font-semibold text-rose-300 hover:text-rose-200 border border-rose-800/40 transition-colors"
              title="Log out of Admin mode to view as regular visitor"
            >
              <LogOut size={11} />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. THE TOP BANNER SPOT (Displays headline, subtitle, and optional custom image) */}
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1 py-1 sm:py-2">
        <div className="flex items-center gap-3 min-w-0">
          {/* Optional Custom Banner Image */}
          {bannerImage && (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-[#161a28] border border-purple-500/40 flex-shrink-0 shadow-sm">
              <img
                src={bannerImage}
                alt="Banner Graphic"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Main Headline & Subtitle */}
          <div className="flex-1 min-w-0">
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-white tracking-wide uppercase drop-shadow-xs truncate">
              {mainText}
            </h2>
            {subText && (
              <p className="text-xs sm:text-sm font-semibold text-purple-300/90 mt-0.5 tracking-tight truncate">
                {subText}
              </p>
            )}
          </div>
        </div>

        {/* Small Desktop-Only Editor Button: Only visible to log in if not logged in, or to edit if logged in */}
        {!isAdmin && (
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleEditorButtonClick}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#161a27] hover:bg-[#20273a] text-purple-300 hover:text-white border border-[#2b334a] hover:border-purple-500/50 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Admin Login to edit text and images"
            >
              <Lock size={12} className="text-purple-400" />
              <span>Admin Login</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. ADMIN AUTHENTICATION MODAL (onib / onib1127!) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-[#121622] border border-[#262f44] p-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-[#20283a]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Lock size={15} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Admin Authentication</h3>
                  <p className="text-[11px] text-slate-400">Required to edit text & add images</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1a2030]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="mt-4 space-y-3">
              {authError && (
                <div className="p-2 rounded-lg bg-rose-950/70 border border-rose-600/50 text-rose-300 text-xs font-semibold">
                  {authError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  placeholder="e.g. onib"
                  className="w-full rounded-xl bg-[#0c0e16] border border-[#262f44] px-3 py-2 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-xl bg-[#0c0e16] border border-[#262f44] px-3 py-2 text-xs text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-[#181d2c] hover:bg-[#20273b] text-xs font-bold text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-black text-white transition-colors shadow-md shadow-purple-900/40"
                >
                  Log In as Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. TEXT & IMAGE EDITING MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-[#111522] border border-[#262f44] p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#20283a]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Edit3 size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Edit Banner Text & Add Image</h3>
                  <p className="text-[11px] text-slate-400">
                    Saves locally and sends an automatic push to GitHub
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1a2030]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveTextAndImage} className="mt-4 space-y-4">
              {/* Main Headline */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Headline Text
                </label>
                <input
                  type="text"
                  required
                  value={editMainText}
                  onChange={(e) => setEditMainText(e.target.value)}
                  placeholder="e.g. TOP 10 VERIFIED HIGH-PAYOUT OFFERS"
                  className="w-full rounded-xl bg-[#0c0e16] border border-[#262f44] px-3 py-2 text-xs font-semibold text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              {/* Sub-headline */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Subtitle / Highlights
                </label>
                <input
                  type="text"
                  value={editSubText}
                  onChange={(e) => setEditSubText(e.target.value)}
                  placeholder="e.g. Instant Payouts • Highest Verified Bonuses"
                  className="w-full rounded-xl bg-[#0c0e16] border border-[#262f44] px-3 py-2 text-xs text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              {/* Add / Edit Banner Image */}
              <div className="p-3 rounded-xl bg-[#161a28] border border-[#22293d] space-y-2.5">
                <label className="block text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-purple-400" />
                    <span>Add / Change Banner Image (Optional)</span>
                  </span>
                  {editImageUrl && (
                    <button
                      type="button"
                      onClick={() => setEditImageUrl('')}
                      className="text-[11px] text-rose-400 hover:text-rose-300"
                    >
                      Remove Image
                    </button>
                  )}
                </label>

                {/* Upload File or URL */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#1e2436] hover:bg-[#273046] text-xs font-bold text-purple-300 border border-purple-500/30 transition-colors"
                  >
                    <Upload size={13} />
                    <span>Upload Image File</span>
                  </button>

                  <div className="flex-1 relative">
                    <LinkIcon
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="url"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      placeholder="Or paste image URL"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0c0e16] border border-[#262f44] text-xs text-white focus:outline-hidden focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Image Preview */}
                {editImageUrl && (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-[#0d0f17] border border-[#1e2436]">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/50 border border-purple-500/40 flex-shrink-0">
                      <img
                        src={editImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-emerald-400 block">
                        Image Attached
                      </span>
                      <span className="text-[10px] text-slate-400 truncate block">
                        Will be pushed to GitHub repository
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Live Preview Box */}
              <div className="p-3 rounded-xl bg-[#0a0c12] border border-[#1e2536]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Live Preview:
                </span>
                <div className="flex items-center gap-2.5">
                  {editImageUrl && (
                    <div className="w-8 h-8 rounded-md overflow-hidden bg-black/40 border border-purple-500/40 flex-shrink-0">
                      <img src={editImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-black text-white uppercase tracking-wide truncate">
                      {editMainText || DEFAULT_MAIN_TEXT}
                    </p>
                    {editSubText && (
                      <p className="text-[11px] font-semibold text-purple-300 truncate mt-0.5">
                        {editSubText}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status feedback */}
              {saveFeedback && (
                <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-xs font-semibold text-purple-200 flex items-center gap-2">
                  <Sparkles size={14} className="text-purple-400 animate-spin" />
                  <span>{saveFeedback}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#212a3d]">
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#181d2c] hover:bg-[#20273b] text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw size={12} />
                  <span>Reset Default</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-3 py-2 rounded-xl bg-[#181d2c] hover:bg-[#20273b] text-xs font-bold text-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-black text-white transition-colors shadow-md shadow-purple-900/40 disabled:opacity-50"
                  >
                    <Check size={14} />
                    <span>{isSaving ? 'Saving & Pushing...' : 'Save & Push to GitHub'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. GITHUB SYNC MODAL */}
      <GitHubSyncModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />
    </div>
  );
};
