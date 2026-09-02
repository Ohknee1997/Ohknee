import React, { useState } from 'react';
import { Mail, X, CheckCheck, Sparkles, Gift, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface InboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreOffers?: () => void;
  onClearNotifications?: () => void;
}

interface InboxMessage {
  id: string;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  type: 'bonus' | 'alert' | 'reward';
}

const INITIAL_MESSAGES: InboxMessage[] = [
  {
    id: 'msg-welcome-bonus',
    title: 'Welcome Bonus Stack Available',
    body: 'Your starter stack worth up to $150 in verified instant bonuses and zero-fee cashouts is ready to claim in Fast Offers.',
    time: '12m ago',
    isRead: false,
    type: 'bonus',
  },
  {
    id: 'msg-sc-daily',
    title: 'Daily Sweepstakes Coins Refreshed',
    body: 'Daily SC claims are now open for Stake.us, High 5 Casino, and Pulsz. Claim your daily free entries without a deposit.',
    time: '1h ago',
    isRead: false,
    type: 'reward',
  },
  {
    id: 'msg-security-tip',
    title: 'Security Notice: Beware of Impersonators',
    body: 'OHKNEE never requests your passwords, verification codes, or upfront cash deposits. All legitimate offers link directly to official verified portals.',
    time: 'Today',
    isRead: false,
    type: 'alert',
  },
];

export const InboxModal: React.FC<InboxModalProps> = ({
  isOpen,
  onClose,
  onExploreOffers,
  onClearNotifications,
}) => {
  const [messages, setMessages] = useState<InboxMessage[]>(INITIAL_MESSAGES);

  if (!isOpen) return null;

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const handleMarkAllRead = () => {
    setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
    if (onClearNotifications) {
      onClearNotifications();
    }
  };

  const handleItemClick = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
  };

  return (
    <div
      id="inbox-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="inbox-modal-content"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#E03B24] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-white">
              <Mail size={20} className="fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">Your Inbox</h2>
                {unreadCount > 0 && (
                  <span className="text-[11px] font-bold bg-white text-[#E03B24] px-2 py-0.5 rounded-full">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-white/80 font-medium">
                Verified rewards, updates, and community alerts
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
            aria-label="Close inbox"
          >
            <X size={18} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>{messages.length} total messages</span>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 font-bold text-slate-700 hover:text-[#E03B24] transition-colors cursor-pointer"
            >
              <CheckCheck size={14} />
              Mark all as read
            </button>
          )}
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 sm:p-3 space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleItemClick(msg.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                msg.isRead
                  ? 'bg-slate-50/60 border-slate-200 text-slate-700'
                  : 'bg-red-50/40 border-red-200 text-slate-900 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 p-1.5 rounded-lg bg-white border border-slate-200 shrink-0">
                  {msg.type === 'bonus' && <Gift size={16} className="text-amber-600" />}
                  {msg.type === 'reward' && <Sparkles size={16} className="text-purple-600" />}
                  {msg.type === 'alert' && <ShieldAlert size={16} className="text-red-600" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs sm:text-sm font-bold truncate">
                      {msg.title}
                    </h3>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {msg.time}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {msg.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          {onExploreOffers && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onExploreOffers();
              }}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Verified Offers</span>
              <ArrowUpRight size={14} />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="ml-auto px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
