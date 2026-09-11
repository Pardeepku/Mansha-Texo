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
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 group font-medium text-xs sm:text-sm"
      aria-label="Chat with Mansha Texo Support on WhatsApp"
    >
      <div className="relative">
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
      </div>
      <span className="font-semibold hidden sm:inline">WhatsApp Help</span>
    </a>
  );
};
