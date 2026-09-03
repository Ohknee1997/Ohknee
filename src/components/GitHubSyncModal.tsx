import React, { useState, useEffect } from 'react';
import {
  X,
  GitBranch,
  Github,
  Key,
  FolderGit2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  UploadCloud,
  FileCode,
  ShieldCheck,
} from 'lucide-react';
import {
  getGitHubConfig,
  saveGitHubConfig,
  testGitHubConnection,
  getLastSyncTime,
  GitHubConfig,
} from '../utils/githubSyncService';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onManualPush?: () => Promise<void>;
  isPushing?: boolean;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({
  isOpen,
  onClose,
  onManualPush,
  isPushing = false,
}) => {
  const [config, setConfig] = useState<GitHubConfig>(getGitHubConfig);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(getLastSyncTime);

  useEffect(() => {
    if (isOpen) {
      setConfig(getGitHubConfig());
      setLastSync(getLastSyncTime());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveGitHubConfig(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testGitHubConnection(config);
    setIsTesting(false);
    setTestResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-[#111520] border border-[#263044] p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#212a3d]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Github size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>GitHub Auto-Push Settings</span>
                <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded-md bg-purple-950 border border-purple-500/50 text-purple-300">
                  Admin Sync
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Pushes all text & image edits directly to your GitHub repository
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-[#1c2234] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sync Info / Last sync status */}
        <div className="mt-4 p-3 rounded-xl bg-[#161c2b] border border-[#242e44] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <GitBranch size={15} className="text-purple-400 flex-shrink-0" />
            <span>
              Target: <strong className="text-white">{config.repo || 'Not configured'}</strong> ({config.branch})
            </span>
          </div>
          {lastSync ? (
            <span className="text-[11px] text-emerald-400 font-medium">
              Synced: {new Date(lastSync).toLocaleTimeString()}
            </span>
          ) : (
            <span className="text-[11px] text-amber-400 font-medium">Ready to push</span>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
              <span>GitHub Repository (owner/repo)</span>
              <span className="text-[11px] text-slate-400 font-normal">e.g. oniamaya998/ohknee</span>
            </label>
            <div className="relative">
              <FolderGit2
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                required
                value={config.repo}
                onChange={(e) => setConfig({ ...config, repo: e.target.value.trim() })}
                placeholder="username/repository"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0c0e16] border border-[#262f44] text-xs font-medium text-white focus:outline-hidden focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
              <span>GitHub Personal Access Token (PAT)</span>
              <a
                href="https://github.com/settings/tokens/new?scopes=repo&description=Ohknee+Admin+Sync"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                <span>Generate Token</span>
                <ExternalLink size={10} />
              </a>
            </label>
            <div className="relative">
              <Key
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="password"
                required
                value={config.token}
                onChange={(e) => setConfig({ ...config, token: e.target.value.trim() })}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0c0e16] border border-[#262f44] text-xs font-mono text-white focus:outline-hidden focus:border-purple-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Requires a Classic or Fine-grained Personal Access Token with <code className="text-purple-300">repo</code> (or contents read/write) permissions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Branch
              </label>
              <input
                type="text"
                required
                value={config.branch}
                onChange={(e) => setConfig({ ...config, branch: e.target.value.trim() })}
                placeholder="main"
                className="w-full px-3 py-2 rounded-xl bg-[#0c0e16] border border-[#262f44] text-xs font-medium text-white focus:outline-hidden focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Storage File Path
              </label>
              <div className="relative">
                <FileCode
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  required
                  value={config.filePath}
                  onChange={(e) => setConfig({ ...config, filePath: e.target.value.trim() })}
                  placeholder="site-content.json"
                  className="w-full pl-8 pr-2 py-2 rounded-xl bg-[#0c0e16] border border-[#262f44] text-xs font-mono text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Test connection result notice */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                testResult.ok
                  ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
              }`}
            >
              {testResult.ok ? (
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertTriangle size={16} className="text-rose-400 flex-shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#212a3d]">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !config.token}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1c2333] hover:bg-[#252f44] text-xs font-bold text-slate-300 hover:text-white transition-colors disabled:opacity-50"
            >
              <ShieldCheck size={14} className="text-purple-400" />
              <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
            </button>

            <div className="flex items-center gap-2">
              {onManualPush && (
                <button
                  type="button"
                  onClick={onManualPush}
                  disabled={isPushing || !config.token}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-xs font-bold text-purple-200 hover:text-white border border-purple-500/40 transition-colors disabled:opacity-50"
                >
                  <UploadCloud size={14} />
                  <span>{isPushing ? 'Pushing...' : 'Push Now'}</span>
                </button>
              )}
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-black text-white transition-colors shadow-md shadow-purple-900/40"
              >
                {savedSuccess ? 'Saved!' : 'Save Config'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
