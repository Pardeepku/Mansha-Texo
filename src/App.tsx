import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { SearchModal } from './components/common/SearchModal';
import { QuickViewModal } from './components/common/QuickViewModal';
import { CartDrawer } from './components/common/CartDrawer';
import { MobileAppBottomNav } from './components/common/MobileAppBottomNav';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';
import { FAQPage } from './pages/FAQPage';
import {
  AboutPage,
  ContactPage,
  ShippingPolicyPage,
  ReturnPolicyPage,
  PrivacyPolicyPage,
  TermsPolicyPage
} from './pages/StaticPolicyPages';
import { AdminDashboard } from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname || '/';
      const search = window.location.search || '';
      return pathname + search;
    }
    return '/';
  });

  const { isSearchOpen, setIsSearchOpen, isCartDrawerOpen, setIsCartDrawerOpen } = useStore();

  // Sync with browser history and support direct clean navigation
  const navigate = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    setCurrentPath(cleanPath);
    try {
      if (window.location.pathname + window.location.search !== cleanPath) {
        window.history.pushState({}, '', cleanPath);
      }
    } catch (e) {
      // Ignored in sandboxed iframes if restricted
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname + window.location.search;
      setCurrentPath(path || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Parse path & parameters
  const renderRoute = () => {
    const [pathOnly, searchPart] = currentPath.split('?');
    const params = new URLSearchParams(searchPart || '');

    if (pathOnly === '/' || pathOnly === '') {
      return <HomePage onNavigate={navigate} />;
    }

    if (pathOnly.startsWith('/category/')) {
      const categorySlug = pathOnly.replace('/category/', '');
      return <ShopPage initialCategory={categorySlug} onNavigate={navigate} />;
    }

    if (pathOnly === '/categories') {
      return <ShopPage onNavigate={navigate} />;
    }

    if (pathOnly.startsWith('/product/')) {
      const productSlug = pathOnly.replace('/product/', '');
      return <ProductDetailPage slug={productSlug} onNavigate={navigate} />;
    }

    if (pathOnly === '/shop') {
      const filter = params.get('filter') || undefined;
      return <ShopPage initialFilter={filter} onNavigate={navigate} />;
    }

    if (pathOnly === '/new-arrivals') {
      return <ShopPage initialFilter="new" onNavigate={navigate} />;
    }

    if (pathOnly === '/best-sellers') {
      return <ShopPage initialFilter="bestseller" onNavigate={navigate} />;
    }

    if (pathOnly === '/offers' || pathOnly === '/deals') {
      return <ShopPage initialFilter="offers" onNavigate={navigate} />;
    }

    if (pathOnly === '/cart') {
      return <CartPage onNavigate={navigate} />;
    }

    if (pathOnly === '/checkout') {
      return (
        <CheckoutPage
          onNavigate={navigate}
          onOrderPlaced={(orderId) => navigate(`/order-success/${orderId}`)}
        />
      );
    }

    if (pathOnly === '/order-success' || pathOnly.startsWith('/order-success/')) {
      let orderId = pathOnly.startsWith('/order-success/')
        ? pathOnly.replace('/order-success/', '')
        : params.get('id') || undefined;
      return <OrderSuccessPage orderId={orderId} onNavigate={navigate} />;
    }

    if (pathOnly === '/track-order' || pathOnly.startsWith('/track-order')) {
      const orderId = params.get('id') || undefined;
      return <OrderTrackingPage initialOrderId={orderId} onNavigate={navigate} />;
    }

    if (pathOnly === '/wishlist') {
      return <WishlistPage onNavigate={navigate} />;
    }

    if (pathOnly === '/account' || pathOnly === '/profile' || pathOnly === '/login' || pathOnly === '/register') {
      const tab = (params.get('tab') as 'profile' | 'orders' | 'addresses') || (pathOnly === '/login' || pathOnly === '/register' ? 'profile' : undefined);
      return <AccountPage initialTab={tab} onNavigate={navigate} />;
    }

    if (pathOnly === '/faq' || pathOnly === '/faqs' || pathOnly === '/help') {
      return <FAQPage onNavigate={navigate} />;
    }

    if (pathOnly === '/about' || pathOnly === '/about-us') {
      return <AboutPage onNavigate={navigate} />;
    }

    if (pathOnly === '/contact' || pathOnly === '/contact-us') {
      return <ContactPage onNavigate={navigate} />;
    }

    if (pathOnly === '/shipping-policy' || pathOnly === '/shipping') {
      return <ShippingPolicyPage onNavigate={navigate} />;
    }

    if (pathOnly === '/returns' || pathOnly === '/return-policy' || pathOnly === '/refund-policy') {
      return <ReturnPolicyPage onNavigate={navigate} />;
    }

    if (pathOnly === '/privacy' || pathOnly === '/privacy-policy') {
      return <PrivacyPolicyPage onNavigate={navigate} />;
    }

    if (pathOnly === '/terms' || pathOnly === '/terms-and-conditions' || pathOnly === '/terms-of-service') {
      return <TermsPolicyPage onNavigate={navigate} />;
    }

    if (pathOnly === '/admin' || pathOnly.startsWith('/admin')) {
      return <AdminDashboard onNavigate={navigate} />;
    }

    // Default fallback
    return <HomePage onNavigate={navigate} />;
  };

  const isAdminView = currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1E293B] w-full max-w-full overflow-x-hidden relative">
      {/* Show Header & Navigation when not in Admin Mode */}
      {!isAdminView && (
        <Header
          onNavigate={navigate}
          currentPath={currentPath}
        />
      )}

      {/* Main Page Body with bottom clearance on mobile for bottom navigation */}
      <main className={`flex-1 w-full max-w-full overflow-x-hidden ${!isAdminView ? 'pb-16 lg:pb-0' : ''}`}>
        {renderRoute()}
      </main>

      {/* Footer when not in Admin Mode */}
      {!isAdminView && <Footer onNavigate={navigate} />}

      {/* Native Mobile App Bottom Navigation Bar (Hidden in Admin, Checkout, and Order Confirmation) */}
      {!isAdminView &&
        !currentPath.startsWith('/checkout') &&
        !currentPath.startsWith('/order-success') && (
          <MobileAppBottomNav currentPath={currentPath} onNavigate={navigate} />
        )}

      {/* Global Modals & Overlays */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigate}
      />

      <QuickViewModal onNavigate={navigate} />

      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        onNavigate={navigate}
      />

      <ToastContainer />

      {!isAdminView && <WhatsAppButton />}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
