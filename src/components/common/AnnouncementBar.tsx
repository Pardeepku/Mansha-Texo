import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, ArrowRight } from 'lucide-react';

interface AnnouncementBarProps {
  onNavigate?: (path: string) => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onNavigate }) => {
  const { settings } = useStore();

  if (!settings.announcementActive || !settings.announcementText) {
    return null;
  }

  return (
    <aside aria-label="Announcement" className="bg-[#257335] text-white text-xs font-medium py-2 px-4 relative z-40 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center">
        <Sparkles className="w-3.5 h-3.5 text-[#EB7344] animate-pulse flex-shrink-0" />
        <span>{settings.announcementText}</span>
        {onNavigate && (
          <button
            onClick={() => onNavigate('/offers')}
            className="inline-flex items-center gap-0.5 text-xs text-amber-200 underline font-semibold hover:text-white transition-colors cursor-pointer ml-1.5"
          >
            Claim Now <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </aside>
  );
};
