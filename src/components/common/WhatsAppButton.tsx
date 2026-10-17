import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useStore();

  if (!settings?.whatsappEnabled || !settings?.whatsappNumber) {
    return null;
  }

  const cleanNumber = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(settings.whatsappMessage || 'Hello Mansha Texo, I need help with my order.');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMsg}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 lg:bottom-6 right-4 lg:left-6 lg:right-auto z-30 flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all duration-300 active:scale-95 hover:scale-105 group font-medium text-xs sm:text-sm"
      aria-label="Chat with Mansha Texo Support on WhatsApp"
    >
      <div className="relative">
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
      </div>
      <span className="font-semibold hidden sm:inline">WhatsApp Help</span>
    </a>
  );
};
