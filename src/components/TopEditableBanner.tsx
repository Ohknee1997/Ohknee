import React, { useState, useEffect } from 'react';
import { Edit3, Check, X, Lock, RotateCcw } from 'lucide-react';

const STORAGE_KEY_MAIN = 'ohk_top_banner_main_text';
const STORAGE_KEY_SUB = 'ohk_top_banner_sub_text';
const AUTH_KEY = 'ohk_text_editor_auth';

const DEFAULT_MAIN_TEXT = 'TOP 10 VERIFIED HIGH-PAYOUT OFFERS';
const DEFAULT_SUB_TEXT = 'Instant Payouts • Highest Verified Bonuses • 100% Free to Join';

export const TopEditableBanner: React.FC = () => {
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

  // Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form input states
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [editMainText, setEditMainText] = useState(mainText);
  const [editSubText, setEditSubText] = useState(subText);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Check if already authenticated in this session
  const isAuthenticated = () => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  };

  const handleEditorButtonClick = () => {
    if (isAuthenticated()) {
      setEditMainText(mainText);
      setEditSubText(subText);
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

    // Authenticate with onib and onib1127! (case-insensitive for convenience)
    if (u === 'onib' && (p === 'onib1127!' || p === 'Onib1127!')) {
      try {
        sessionStorage.setItem(AUTH_KEY, 'true');
      } catch {}
      setIsAuthModalOpen(false);
      setEditMainText(mainText);
      setEditSubText(subText);
      setIsEditModalOpen(true);
      setAuthError(null);
    } else {
      setAuthError('Access Denied: Invalid username or password.');
    }
  };

  const handleSaveText = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMain = editMainText.trim() || DEFAULT_MAIN_TEXT;
    const trimmedSub = editSubText.trim();

    setMainText(trimmedMain);
    setSubText(trimmedSub);

    try {
      localStorage.setItem(STORAGE_KEY_MAIN, trimmedMain);
      localStorage.setItem(STORAGE_KEY_SUB, trimmedSub);
    } catch {}

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsEditModalOpen(false);
    }, 800);
  };

  const handleResetDefault = () => {
    setEditMainText(DEFAULT_MAIN_TEXT);
    setEditSubText(DEFAULT_SUB_TEXT);
    setMainText(DEFAULT_MAIN_TEXT);
    setSubText(DEFAULT_SUB_TEXT);
    try {
      localStorage.removeItem(STORAGE_KEY_MAIN);
      localStorage.removeItem(STORAGE_KEY_SUB);
    } catch {}
  };

  return (
    <div className="w-full mb-3 sm:mb-4">
      {/* 1. SPOT AT THE TOP DISPLAYING THE TEXT & SMALL DESKTOP-ONLY EDITOR BUTTON */}
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 px-1 py-1 sm:py-2">
        {/* The Text Spot (Larger, High-Contrast Typography) */}
        <div className="flex-1 min-w-0">
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-white tracking-wide uppercase drop-shadow-xs">
            {mainText}
          </h2>
          {subText && (
            <p className="text-xs sm:text-sm font-semibold text-purple-300/90 mt-0.5 tracking-tight truncate">
              {subText}
            </p>
          )}
        </div>

        {/* Small Editor Button: ONLY VISIBLE ON DESKTOP (hidden md:inline-flex) */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleEditorButtonClick}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#161a27] hover:bg-[#20273a] text-purple-300 hover:text-white border border-[#2b334a] hover:border-purple-500/50 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Edit top banner text (Desktop Admin Only)"
          >
            <Edit3 size={13} className="text-purple-400" />
            <span>Edit Text</span>
          </button>
        </div>
      </div>

      {/* 2. AUTHENTICATION MODAL FOR EDITOR (onib / onib1127!) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-[#121622] border border-[#262f44] p-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-[#20283a]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Lock size={15} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Text Editor Access</h3>
                  <p className="text-[11px] text-slate-400">Desktop Authorization</p>
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
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full rounded-xl bg-[#0c0e16] border border-[#262f44] px-3 py-2 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Password
                </label>
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
                  Unlock Editor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. TEXT EDITING MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-[#121622] border border-[#262f44] p-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-[#20283a]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Edit3 size={15} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Change Top Banner Text</h3>
                  <p className="text-[11px] text-slate-400">Updates the text spot at the top live</p>
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

            <form onSubmit={handleSaveText} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Main Headline Text
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

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Sub-headline / Tagline (Optional)
                </label>
                <input
                  type="text"
                  value={editSubText}
                  onChange={(e) => setEditSubText(e.target.value)}
                  placeholder="e.g. Instant Payouts • Highest Verified Bonuses"
                  className="w-full rounded-xl bg-[#0c0e16] border border-[#262f44] px-3 py-2 text-xs text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              {/* Live Preview Box */}
              <div className="p-3 rounded-xl bg-[#0a0c12] border border-[#1e2536]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Live Preview:
                </span>
                <p className="text-sm font-black text-white uppercase tracking-wide truncate">
                  {editMainText || DEFAULT_MAIN_TEXT}
                </p>
                {editSubText && (
                  <p className="text-xs font-semibold text-purple-300 truncate mt-0.5">
                    {editSubText}
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
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
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-black text-white transition-colors shadow-md shadow-purple-900/40"
                  >
                    {savedSuccess ? (
                      <>
                        <Check size={14} className="text-emerald-300" />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <span>Save Text</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
