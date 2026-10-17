import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Home,
  LayoutGrid,
  Heart,
  User,
  ShoppingBag,
  PackageCheck
} from 'lucide-react';

interface MobileAppBottomNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const MobileAppBottomNav: React.FC<MobileAppBottomNavProps> = ({
  currentPath,
  onNavigate,
}) => {
  const { cartCount, wishlist, user, setIsCartDrawerOpen } = useStore();

  const isHome = currentPath === '/' || currentPath === '';
  const isShop = currentPath === '/shop' || currentPath.startsWith('/category/') || currentPath === '/categories';
  const isWishlist = currentPath === '/wishlist';
  const isAccount = currentPath.startsWith('/account') || currentPath === '/login' || currentPath === '/register' || currentPath === '/profile';
  const isCart = currentPath === '/cart';

  const handleNav = (path: string) => {
    onNavigate(path);
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.07)] pb-[max(0.4rem,env(safe-area-inset-bottom))]"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 h-14 max-w-md mx-auto items-center px-1">
        {/* 1. Home Tab */}
        <button
          onClick={() => handleNav('/')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-transform active:scale-90 cursor-pointer ${
            isHome ? 'text-[#257335]' : 'text-gray-500 hover:text-gray-900'
          }`}
          aria-label="Home"
        >
          <div className="relative">
            <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {isHome && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#257335] rounded-full" />
            )}
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight ${isHome ? 'font-bold' : 'font-medium'}`}>
            Home
          </span>
        </button>

        {/* 2. Shop / Categories Tab */}
        <button
          onClick={() => handleNav('/shop')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-transform active:scale-90 cursor-pointer ${
            isShop ? 'text-[#257335]' : 'text-gray-500 hover:text-gray-900'
          }`}
          aria-label="Categories"
        >
          <div className="relative">
            <LayoutGrid className={`w-5 h-5 ${isShop ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {isShop && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#257335] rounded-full" />
            )}
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight ${isShop ? 'font-bold' : 'font-medium'}`}>
            Explore
          </span>
        </button>

        {/* 3. Wishlist Tab */}
        <button
          onClick={() => handleNav('/wishlist')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] relative transition-transform active:scale-90 cursor-pointer ${
            isWishlist ? 'text-[#E87244]' : 'text-gray-500 hover:text-gray-900'
          }`}
          aria-label="Wishlist"
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${isWishlist ? 'stroke-[2.5] fill-[#E87244]' : 'stroke-[1.8]'}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 bg-[#E87244] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                {wishlist.length > 99 ? '99+' : wishlist.length}
              </span>
            )}
            {isWishlist && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#E87244] rounded-full" />
            )}
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight ${isWishlist ? 'font-bold text-[#E87244]' : 'font-medium'}`}>
            Wishlist
          </span>
        </button>

        {/* 4. Cart Tab */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] relative transition-transform active:scale-90 cursor-pointer ${
            isCart ? 'text-[#257335]' : 'text-gray-500 hover:text-gray-900'
          }`}
          aria-label="Cart"
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${isCart ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 bg-[#257335] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs animate-scaleIn">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
            {isCart && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#257335] rounded-full" />
            )}
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight ${isCart ? 'font-bold' : 'font-medium'}`}>
            Bag {cartCount > 0 ? `(${cartCount})` : ''}
          </span>
        </button>

        {/* 5. Account / Profile Tab */}
        <button
          onClick={() => handleNav('/account')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-transform active:scale-90 cursor-pointer ${
            isAccount ? 'text-[#257335]' : 'text-gray-500 hover:text-gray-900'
          }`}
          aria-label="Account"
        >
          <div className="relative">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className={`w-5 h-5 rounded-full object-cover ring-1.5 ${
                  isAccount ? 'ring-[#257335]' : 'ring-gray-300'
                }`}
              />
            ) : (
              <User className={`w-5 h-5 ${isAccount ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            )}
            {isAccount && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#257335] rounded-full" />
            )}
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight ${isAccount ? 'font-bold' : 'font-medium'}`}>
            {user ? 'Profile' : 'Sign In'}
          </span>
        </button>
      </div>
    </nav>
  );
};
