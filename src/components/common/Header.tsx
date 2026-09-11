import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { AnnouncementBar } from './AnnouncementBar';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Shield,
  Truck,
  Sparkles,
  ArrowRight,
  LogOut,
  PackageCheck
} from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const { cartCount, wishlist, user, isAdmin, settings, setIsCartDrawerOpen, setIsSearchOpen } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const rawMenuLinks = settings.menuLinks && settings.menuLinks.length > 0
    ? settings.menuLinks
    : [
        { id: '1', label: 'Home', path: '/', isActive: true },
        { id: '2', label: 'Shop All', path: '/shop', isActive: true },
        { id: '3', label: 'Bath Mats', path: '/category/bath-mats', isActive: true },
        { id: '4', label: 'Carpets', path: '/category/carpets', isActive: true },
        { id: '5', label: 'Rugs', path: '/category/rugs', isActive: true },
        { id: '6', label: 'Door Mats', path: '/category/door-mats', isActive: true },
        { id: '7', label: 'Kitchen Mats', path: '/category/kitchen-mats', isActive: true },
        { id: '8', label: 'New Arrivals', path: '/new-arrivals', badge: 'New', isActive: true },
        { id: '9', label: 'Best Sellers', path: '/best-sellers', badge: 'Hot', isActive: true },
        { id: '10', label: 'Offers', path: '/offers', highlight: true, isActive: true },
      ];

  const activeNavLinks = rawMenuLinks.filter((l) => l.isActive !== false);

  const handleNav = (path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md transition-shadow duration-300">
      {/* Top Announcement */}
      <AnnouncementBar onNavigate={handleNav} />

      {/* Main Header Container */}
      <div
        className={`border-b border-gray-100 transition-all duration-200 ${
          isScrolled ? 'shadow-sm py-2.5' : 'py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-[#257335] rounded-lg transition-colors cursor-pointer"
            aria-label="Open mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Official Brand Logo */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
            aria-label="Mansha Texo Home"
          >
            <Logo size="md" />
          </button>

          {/* Desktop Search Bar Trigger */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100/80 border border-gray-200/80 rounded-full text-sm text-gray-400 hover:text-gray-600 transition-all shadow-inner cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-gray-400 group-hover:text-[#257335] transition-colors" />
                <span className="text-gray-500 font-normal">Search bath mats, rugs, carpets...</span>
              </div>
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-gray-400 bg-white border border-gray-200 rounded">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Action Icons (Track, Admin link, Account, Wishlist, Cart) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Quick Track Order icon link */}
            <button
              onClick={() => handleNav('/track-order')}
              title="Track Your Order"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-[#257335] hover:bg-emerald-50/60 rounded-full transition-colors cursor-pointer"
            >
              <Truck className="w-4 h-4 text-[#257335]" />
              <span className="hidden xl:inline">Track Order</span>
            </button>

            {/* Admin Dashboard Quick Link (visible or highlighted) */}
            <button
              onClick={() => handleNav('/admin')}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                currentPath.startsWith('/admin')
                  ? 'bg-[#257335] text-white shadow-sm'
                  : 'bg-emerald-50 text-[#257335] hover:bg-[#257335] hover:text-white border border-emerald-200'
              }`}
              title="Open Store Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Mobile Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 text-gray-700 hover:text-[#257335] rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => handleNav('/wishlist')}
              className="relative p-2 text-gray-700 hover:text-[#E87244] rounded-full hover:bg-orange-50 transition-colors cursor-pointer"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#E87244] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scaleIn shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-white bg-[#257335] hover:bg-[#1E5C2B] rounded-full shadow-sm transition-all cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 bg-[#E87244] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-inner">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-1.5 sm:p-2 text-gray-700 hover:text-[#257335] rounded-full hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-1.5"
                aria-label="User Account"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-[#257335]/30"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
                <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
                  {user ? (
                    <>
                      <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2.5">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#257335]"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#257335] font-bold flex items-center justify-center text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                            {user.provider === 'google' && (
                              <span className="px-1.5 py-0.2 bg-blue-50 text-blue-700 text-[9px] font-bold rounded">Google</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleNav('/account')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#257335] flex items-center gap-2"
                      >
                        <User className="w-4 h-4" /> My Profile
                      </button>
                      <button
                        onClick={() => handleNav('/account/orders')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#257335] flex items-center gap-2"
                      >
                        <PackageCheck className="w-4 h-4" /> My Orders
                      </button>
                      <button
                        onClick={() => handleNav('/track-order')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#257335] flex items-center gap-2"
                      >
                        <Truck className="w-4 h-4" /> Track Order
                      </button>
                      <button
                        onClick={() => handleNav('/admin')}
                        className="w-full text-left px-4 py-2 text-sm text-emerald-800 font-medium hover:bg-emerald-100/60 flex items-center gap-2 border-t border-gray-50 mt-1"
                      >
                        <Shield className="w-4 h-4 text-[#257335]" /> Admin Dashboard
                      </button>
                      <button
                        onClick={() => handleNav('/account')}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100 mt-1"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2">
                        <p className="text-sm font-semibold text-gray-900">Welcome to {settings.storeName}</p>
                        <p className="text-xs text-gray-500">Sign in for saved orders & wishlist</p>
                      </div>
                      <div className="px-3 py-1.5">
                        <button
                          onClick={() => handleNav('/account')}
                          className="w-full py-2 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors text-center"
                        >
                          Sign In / Register
                        </button>
                      </div>
                      <button
                        onClick={() => handleNav('/admin')}
                        className="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-emerald-50 hover:text-[#257335] flex items-center gap-2 border-t border-gray-100 mt-1"
                      >
                        <Shield className="w-3.5 h-3.5" /> Admin Portal
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Secondary Category Navigation Bar */}
      <nav className="hidden lg:block bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-between gap-1 py-2 overflow-x-auto no-scrollbar text-xs font-medium uppercase tracking-wider text-gray-700">
            {activeNavLinks.map((link) => {
              const isActive =
                currentPath === link.path ||
                (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <li key={link.id || link.path}>
                  <button
                    onClick={() => handleNav(link.path)}
                    className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'text-[#257335] font-bold bg-emerald-50/70 border-b-2 border-[#257335]'
                        : link.highlight
                        ? 'text-[#E87244] font-bold hover:bg-orange-50'
                        : 'hover:text-[#257335] hover:bg-gray-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded bg-[#E87244] text-white">
                        {link.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Content panel */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <Logo size="sm" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-2">
                  Navigation
                </p>
                <div className="space-y-1">
                  {activeNavLinks.map((link) => (
                    <button
                      key={link.id || link.path}
                      onClick={() => handleNav(link.path)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${
                        currentPath === link.path
                          ? 'bg-emerald-50 text-[#257335] font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-[#E87244] text-white">
                          {link.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-100">
                <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-2">
                  Support & Account
                </p>
                <div className="space-y-1 text-sm">
                  <button
                    onClick={() => handleNav('/track-order')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-left"
                  >
                    <Truck className="w-4 h-4 text-[#257335]" /> Track Order
                  </button>
                  <button
                    onClick={() => handleNav('/account')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-left"
                  >
                    <User className="w-4 h-4 text-[#257335]" /> My Account
                  </button>
                  <button
                    onClick={() => handleNav('/about')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-left"
                  >
                    About {settings.storeName}
                  </button>
                  <button
                    onClick={() => handleNav('/contact')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-left"
                  >
                    Contact Support
                  </button>
                  <button
                    onClick={() => handleNav('/admin')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-emerald-800 bg-emerald-50 rounded-lg text-left font-medium"
                  >
                    <Shield className="w-4 h-4 text-[#257335]" /> Admin Dashboard
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
              <p className="font-semibold text-gray-800">{settings.storeName}</p>
              <p className="mt-0.5">{settings.cityState || settings.address}</p>
              <p className="mt-0.5 font-medium text-[#257335]">{settings.email}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
