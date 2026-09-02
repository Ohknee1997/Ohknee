import React from 'react';

interface RedditNotificationBannerProps {
  onVisitInbox?: () => void;
  isDismissed?: boolean;
  isExiting?: boolean;
  onDismiss?: () => void;
}

export const RedditNotificationBanner: React.FC<RedditNotificationBannerProps> = ({
  onVisitInbox,
  isDismissed = false,
  isExiting = false,
}) => {
  if (isDismissed) return null;

  return (
    <div
      id="reddit-banned-alert-banner"
      onClick={onVisitInbox}
      className={`relative z-30 w-full bg-red-600 px-4 py-3 flex items-center justify-between cursor-pointer select-none shadow-xs transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isExiting ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      <p className="text-white font-bold text-xs sm:text-sm text-left leading-tight pr-3">
        This account has been banned permanently. Check your inbox for a message with more information.
      </p>
      <span className="text-white font-bold text-xs sm:text-sm text-right whitespace-nowrap shrink-0 hover:underline">
        Visit Inbox
      </span>
    </div>
  );
};

