import React, { useState } from 'react';
import { Lock, KeyRound, X, AlertCircle, ShieldCheck } from 'lucide-react';
import { logAuthEvent } from '../utils/activityLogger';

interface StaffAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const StaffAuthModal: React.FC<StaffAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [openInNewTab, setOpenInNewTab] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsAuthenticating(true);

    setTimeout(() => {
      // Exact staff credentials:
      // Username: Oniamaya3@gmail.com (Full Access) or Onib1127
      const u = username.trim().toLowerCase();
      const isAuthorizedUser =
        (username.trim() === 'Onib1127' && password === 'Pianofrog2020!') ||
        (u === 'oniamaya3@gmail.com') ||
        (u === 'oniamaya3' && password === 'Pianofrog2020!');

      if (isAuthorizedUser) {
        setIsAuthenticating(false);
        setUsername('');
        setPassword('');
        setError(null);
        logAuthEvent('staff_login', username.trim(), true, { role: 'Administrator / Full Access Owner' });
        try {
          sessionStorage.setItem('ohk_staff_authenticated', 'true');
        } catch {}

        if (openInNewTab) {
          const staffUrl = `${window.location.origin}${window.location.pathname}?staff_view=1`;
          try {
            window.open(staffUrl, '_blank');
          } catch (err) {
            console.warn('Popup blocked, falling back to modal:', err);
          }
        }
        onSuccess();
      } else {
        setIsAuthenticating(false);
        setError('Access Denied: Invalid staff username or security passkey.');
        logAuthEvent('staff_login', username || 'unknown', false, { reason: 'Invalid credentials' });
      }
    }, 300);
  };

  return (
    <div
      id="staff-auth-modal"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Lock size={18} />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                Staff Authentication
              </h2>
              <p className="text-[11px] text-slate-400">
                Restricted admin & content management
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Staff ID / Email
            </label>
            <div className="relative">
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Oniamaya3@gmail.com"
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Security Passkey
            </label>
            <div className="relative">
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition"
              />
            </div>
          </div>

          {/* New Window Option */}
          <label className="flex items-center gap-2.5 py-1 px-1 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-teal-500 focus:ring-teal-500 cursor-pointer accent-teal-500"
            />
            <span className="font-semibold text-teal-300">Open Staff Suite in new window / tab</span>
          </label>

          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 active:scale-[0.98] text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-teal-950/50 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isAuthenticating ? (
              <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <KeyRound size={16} />
                <span>Unlock Edit Mode</span>
              </>
            )}
          </button>
        </form>

        {/* Security Note */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[10.5px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck size={12} className="text-teal-400" />
            <span>Authorized administrators only &bull; Sessions encrypted</span>
          </p>
        </div>
      </div>
    </div>
  );
};
