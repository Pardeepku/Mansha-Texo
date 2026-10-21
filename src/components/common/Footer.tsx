import React, { useState } from 'react';
import { Logo } from './Logo';
import { useStore } from '../../context/StoreContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Send,
  Heart,
  Sparkles,
  MessageCircle
} from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, addToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('error', 'Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    addToast('success', 'Subscribed!', `Thank you for joining the ${settings.storeName} insider club.`);
    setEmail('');
  };

  const currentYear = new Date().getFullYear();

  // Helper to render icon for value props
  const renderPropIcon = (iconName: string) => {
    switch (iconName) {
      case 'truck':
        return <Truck className="w-5 h-5" />;
      case 'rotate-ccw':
        return <RotateCcw className="w-5 h-5" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5" />;
      case 'credit-card':
        return <CreditCard className="w-5 h-5" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'phone':
        return <Phone className="w-5 h-5" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  const valueProps = settings.footer?.valueProps || [
    { id: 'vp-1', title: 'Free Doorstep Delivery', description: 'On all prepaid orders over ₹499', icon: 'truck' as const },
    { id: 'vp-2', title: '7-Day Easy Returns', description: 'Hassle-free replacement guarantee', icon: 'rotate-ccw' as const },
    { id: 'vp-3', title: '100% Authentic Quality', description: 'Direct from master Indian weavers', icon: 'shield' as const },
    { id: 'vp-4', title: 'Secure Payments', description: 'UPI, Cards, Net Banking & COD', icon: 'credit-card' as const },
  ];

  const shopLinks = settings.footer?.shopLinks || [
    { id: 'fl-1', label: 'Bath Mats & Sets', path: '/category/bath-mats' },
    { id: 'fl-2', label: 'Living Room Carpets', path: '/category/carpets' },
    { id: 'fl-3', label: 'Artisanal Rugs', path: '/category/rugs' },
    { id: 'fl-4', label: 'Anti-Skid Floor Mats', path: '/category/floor-mats' },
    { id: 'fl-5', label: 'Door & Welcome Mats', path: '/category/door-mats' },
    { id: 'fl-6', label: 'Kitchen Runners', path: '/category/kitchen-mats' },
    { id: 'fl-7', label: 'Fresh Arrivals', path: '/new-arrivals' },
    { id: 'fl-8', label: 'Best Sellers', path: '/best-sellers' },
  ];

  const customerCareLinks = settings.footer?.customerCareLinks || [
    { id: 'cc-1', label: 'Track Order', path: '/track-order' },
    { id: 'cc-2', label: 'Order History', path: '/account/orders' },
    { id: 'cc-3', label: 'Shipping Policy', path: '/shipping-policy' },
    { id: 'cc-4', label: 'Return & Refund Policy', path: '/return-refund-policy' },
    { id: 'cc-5', label: 'Frequently Asked Questions', path: '/faq' },
    { id: 'cc-6', label: 'Contact Us', path: '/contact' },
    { id: 'cc-7', label: 'Privacy Policy', path: '/privacy-policy' },
    { id: 'cc-8', label: 'Terms of Service', path: '/terms' },
  ];

  return (
    <footer className="bg-[#19221C] text-gray-300 pt-12 sm:pt-14 pb-24 lg:pb-8 border-t-4 border-[#257335] w-full max-w-full overflow-hidden">
      {/* Top Value Propositions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop, idx) => {
            const colors = [
              'bg-[#257335]/30 text-emerald-400',
              'bg-[#E87244]/20 text-[#E87244]',
              'bg-emerald-500/20 text-emerald-300',
              'bg-amber-500/20 text-amber-300',
            ];
            const colorClass = colors[idx % colors.length];
            return (
              <div key={prop.id || idx} className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className={`w-11 h-11 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
                  {renderPropIcon(prop.icon)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{prop.title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{prop.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Logo inverted={true} size="md" />
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              {settings.footer?.aboutText ||
                `${settings.storeName} is an Indian home textile and floor furnishing brand committed to redefining comfort, aesthetics, and hygiene across modern homes with artisanal mats, carpets, and rugs.`}
            </p>
            {/* Newsletter Subscription */}
            <div className="pt-2">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                {settings.footer?.newsletterHeading || 'Stay Inspired & Receive Offers'}
              </h5>
              <form onSubmit={handleSubscribe} className="flex max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full px-3.5 py-2.5 bg-gray-900 border border-gray-700 rounded-l-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#257335]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#257335] hover:bg-[#1E5C2B] text-white rounded-r-lg transition-colors flex items-center justify-center cursor-pointer"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[11px] text-gray-500 mt-1.5">
                {settings.footer?.newsletterSubtext || 'No spam. Only exclusive launch perks & textile tips.'}
              </p>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#E87244] pl-2">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              {shopLinks.map((link) => (
                <li key={link.id || link.path}>
                  <button
                    onClick={() => onNavigate(link.path)}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#257335] pl-2">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              {customerCareLinks.map((link) => (
                <li key={link.id || link.path}>
                  <button
                    onClick={() => onNavigate(link.path)}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#E87244] pl-2">
              Get In Touch
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E87244] flex-shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#257335] flex-shrink-0" />
                <div className="flex flex-col">
                  <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                    {settings.phone}
                  </a>
                  {settings.secondaryPhone && (
                    <a href={`tel:${settings.secondaryPhone}`} className="text-[11px] text-gray-500 hover:text-white">
                      Alt: {settings.secondaryPhone}
                    </a>
                  )}
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                    {settings.email}
                  </a>
                  {settings.supportEmail && settings.supportEmail !== settings.email && (
                    <a href={`mailto:${settings.supportEmail}`} className="text-[11px] text-gray-500 hover:text-white">
                      Support: {settings.supportEmail}
                    </a>
                  )}
                </div>
              </li>
              {settings.whatsappEnabled && settings.whatsappNumber && (
                <li className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <a
                    href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                      settings.whatsappMessage || 'Hello'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-300 transition-colors"
                  >
                    WhatsApp Chat Support
                  </a>
                </li>
              )}
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                <span>{settings.businessHours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p className="flex items-center gap-1 text-center sm:text-left">
          © {currentYear} {settings.footer?.copyrightText || `${settings.storeName}. All Rights Reserved. Crafted with care in India.`}
        </p>

        {/* Accepted Payment badges */}
        {settings.footer?.showPaymentBadges !== false && (
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
              {settings.footer?.paymentBadgesText || '100% Safe Payments:'}
            </span>
            <div className="flex items-center gap-2 text-gray-300 font-mono text-[10px] bg-white/5 px-2.5 py-1 rounded border border-white/5">
              <span className="text-[#E87244] font-bold">UPI</span> •
              <span>RuPay</span> •
              <span>Visa</span> •
              <span>Mastercard</span> •
              <span>COD</span>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};
