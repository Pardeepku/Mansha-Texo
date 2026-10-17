import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user already dismissed recently
    try {
      const dismissed = localStorage.getItem('mansha_pwa_dismissed');
      if (dismissed && Date.now() - Number(dismissed) < 7 * 24 * 60 * 60 * 1000) {
        setIsDismissed(true);
      }
    } catch (e) {
      // Ignored
    }

    // Check if already installed
    if (typeof window !== 'undefined') {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsInstalled(isStandalone);

      // Detect iOS
      const ua = window.navigator.userAgent.toLowerCase();
      const isIOSDevice = /iphone|ipad|ipod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
      setIsIOS(isIOSDevice);

      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      };

      const handleAppInstalled = () => {
        setIsInstalled(true);
        setDeferredPrompt(null);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('mansha_pwa_dismissed', Date.now().toString());
    } catch (e) {
      // Ignored
    }
  };

  if (isInstalled || isDismissed) {
    return null;
  }

  return (
    <>
      {/* Mobile App Install Card / Banner */}
      <aside
        aria-label="App download prompt"
        className="lg:hidden mx-3 my-2.5 bg-gradient-to-r from-[#18241F] via-[#203627] to-[#18241F] text-white p-3 rounded-2xl shadow-md border border-emerald-500/20 flex items-center justify-between gap-2.5 animate-fadeIn"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex-shrink-0 flex items-center justify-center shadow-xs">
            <img src="/logo.svg" alt="Mansha Texo" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white truncate">Mansha Texo App</span>
              <span className="px-1.5 py-0.2 bg-[#E87244] text-[9px] font-extrabold uppercase rounded-full">
                Fast
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/90 truncate">
              {isIOS ? 'Install on iPhone for 1-tap shopping' : 'Install for instant orders & app deals'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-[#257335] hover:bg-[#1E5C2B] text-white text-[11px] font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* iOS Installation Instructions Bottom Sheet / Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-3">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-slideUp">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#257335] flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Install Mansha Texo</h3>
                  <p className="text-[11px] text-gray-500">Add to your iPhone Home Screen</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="w-5 h-5 rounded-full bg-[#257335] text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                  1
                </span>
                <p>
                  Tap the <strong className="text-gray-900">Share</strong> icon (square with arrow pointing up) at the bottom of Safari.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="w-5 h-5 rounded-full bg-[#257335] text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                  2
                </span>
                <p>
                  Scroll down the menu and tap <strong className="text-gray-900">Add to Home Screen</strong>.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="w-5 h-5 rounded-full bg-[#257335] text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                  3
                </span>
                <p>
                  Tap <strong className="text-[#257335]">Add</strong> in the top-right corner to launch Mansha Texo as a native app anytime!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
