import React, { useState, useEffect } from 'react';
import { Github, CheckCircle2, AlertCircle, Loader2, ExternalLink, X } from 'lucide-react';

interface PushEventDetail {
  status: 'idle' | 'pushing' | 'success' | 'error';
  message: string;
  commitSha?: string;
  commitUrl?: string;
}

interface GitHubPushToastProps {
  onOpenSettings?: () => void;
}

export const GitHubPushToast: React.FC<GitHubPushToastProps> = ({ onOpenSettings }) => {
  const [toast, setToast] = useState<PushEventDetail | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleStatusEvent = (e: any) => {
      const detail: PushEventDetail = e.detail;
      if (!detail || detail.status === 'idle') {
        setIsVisible(false);
        return;
      }

      setToast(detail);
      setIsVisible(true);

      if (detail.status === 'success') {
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 5500);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('ohknee:github-push-status', handleStatusEvent);
    return () => window.removeEventListener('ohknee:github-push-status', handleStatusEvent);
  }, []);

  if (!isVisible || !toast) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-200">
      <div
        className={`p-3.5 rounded-2xl border shadow-2xl backdrop-blur-md flex items-start gap-3 text-xs ${
          toast.status === 'pushing'
            ? 'bg-[#121624]/95 border-purple-500/50 text-purple-200'
            : toast.status === 'success'
            ? 'bg-[#0f1f18]/95 border-emerald-500/50 text-emerald-200'
            : 'bg-[#221318]/95 border-rose-500/50 text-rose-200'
        }`}
      >
        <div className="mt-0.5 flex-shrink-0">
          {toast.status === 'pushing' && (
            <Loader2 size={18} className="animate-spin text-purple-400" />
          )}
          {toast.status === 'success' && (
            <CheckCircle2 size={18} className="text-emerald-400" />
          )}
          {toast.status === 'error' && (
            <AlertCircle size={18} className="text-rose-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 font-bold text-white mb-0.5">
            <Github size={13} />
            <span>
              {toast.status === 'pushing' && 'Pushing to GitHub...'}
              {toast.status === 'success' && 'GitHub Push Successful!'}
              {toast.status === 'error' && 'GitHub Push Alert'}
            </span>
          </div>
          <p className="text-[11px] leading-tight opacity-90">{toast.message}</p>

          <div className="mt-2 flex items-center gap-2">
            {toast.commitUrl && (
              <a
                href={toast.commitUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 hover:text-white underline underline-offset-2"
              >
                <span>View Commit on GitHub</span>
                <ExternalLink size={10} />
              </a>
            )}

            {toast.status === 'error' && onOpenSettings && (
              <button
                type="button"
                onClick={() => {
                  setIsVisible(false);
                  onOpenSettings();
                }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-900/60 hover:bg-purple-800 text-[10px] font-black text-purple-200 border border-purple-500/40"
              >
                Configure GitHub Sync
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
