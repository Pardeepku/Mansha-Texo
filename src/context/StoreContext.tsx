import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  Coupon,
  Order,
  ProductReview,
  HeroSlide,
  PromotionalBanner,
  FAQItem,
  StoreSettings,
  UserProfile,
  Address,
  ProductCategory
} from '../types';
import { StoreService } from '../services/storeService';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface StoreContextType {
  // Products & Categories
  products: Product[];
  categories: Category[];
  refreshProducts: () => void;
  getProductBySlug: (slug: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'> & { id?: string }) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartTax: number;
  cartShipping: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number, variantId?: string, size?: string, color?: string, pattern?: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  couponDiscountAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id'> & { id?: string }) => Coupon;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;

  // Wishlist
  wishlist: string[];
  wishlistProducts: Product[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Recently Viewed
  recentlyViewedIds: string[];
  recentlyViewedProducts: Product[];
  recordProductView: (productId: string) => void;

  // User & Auth
  user: UserProfile | null;
  isAdmin: boolean;
  loginUser: (email: string, role?: 'customer' | 'admin', name?: string) => void;
  loginWithGoogle: (googleData?: { name?: string; email?: string; avatar?: string }) => void;
  logoutUser: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  saveAddress: (address: Address) => void;
  deleteAddress: (addressId: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: any) => Order;
  updateOrderStatus: (orderId: string, status: any, note?: string, courierName?: string, trackingNumber?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Reviews
  reviews: ProductReview[];
  addReview: (review: Omit<ProductReview, 'id' | 'createdAt'>) => void;
  updateReviewStatus: (reviewId: string, approved: boolean, featured?: boolean) => void;
  deleteReview: (reviewId: string) => void;

  // Banners & CMS
  heroSlides: HeroSlide[];
  updateHeroSlides: (slides: HeroSlide[]) => void;
  promoBanner: PromotionalBanner;
  updatePromoBanner: (banner: PromotionalBanner) => void;
  faqs: FAQItem[];
  updateFAQs: (faqs: FAQItem[]) => void;

  // Settings
  settings: StoreSettings;
  updateSettings: (settings: StoreSettings) => void;

  // Modals & UI States
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
  removeToast: (id: string) => void;
  resetAllData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => StoreService.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => StoreService.getCategories());
  const [cart, setCart] = useState<CartItem[]>(() => StoreService.getCart());
  const [wishlist, setWishlist] = useState<string[]>(() => StoreService.getWishlist());
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => StoreService.getRecentlyViewed());
  const [coupons, setCoupons] = useState<Coupon[]>(() => StoreService.getCoupons());
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>(() => StoreService.getOrders());
  const [reviews, setReviews] = useState<ProductReview[]>(() => StoreService.getReviews());
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => StoreService.getHeroSlides());
  const [promoBanner, setPromoBanner] = useState<PromotionalBanner>(() => StoreService.getPromoBanner());
  const [faqs, setFaqs] = useState<FAQItem[]>(() => StoreService.getFAQs());
  const [settings, setSettings] = useState<StoreSettings>(() => StoreService.getSettings());
  const [user, setUser] = useState<UserProfile | null>(() => StoreService.getUser());

  // UI state
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshProducts = () => {
    setProducts(StoreService.getProducts());
  };

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug || p.id === slug);
  };

  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = StoreService.addProduct(newProdData);
    setProducts(StoreService.getProducts());
    addToast('success', 'Product Added', `${created.name} is now available in your catalog.`);
    return created;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    StoreService.updateProduct(id, updates);
    setProducts(StoreService.getProducts());
    addToast('success', 'Product Updated', 'Changes saved successfully.');
  };

  const deleteProduct = (id: string) => {
    StoreService.deleteProduct(id);
    setProducts(StoreService.getProducts());
    addToast('info', 'Product Removed', 'The item has been deleted from your catalog.');
  };

  const addCategory = (categoryData: Omit<Category, 'id'> & { id?: string }) => {
    const created = StoreService.addCategory(categoryData);
    setCategories(StoreService.getCategories());
    addToast('success', 'Category Created', `${created.name} has been added.`);
    return created;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    StoreService.updateCategory(id, updates);
    setCategories(StoreService.getCategories());
    addToast('success', 'Category Updated', 'Category updated successfully.');
  };

  const deleteCategory = (id: string) => {
    StoreService.deleteCategory(id);
    setCategories(StoreService.getCategories());
    addToast('info', 'Category Removed', 'Category has been deleted.');
  };

  // Cart Management
  const addToCart = (
    product: Product,
    quantity = 1,
    variantId?: string,
    size?: string,
    color?: string,
    pattern?: string
  ) => {
    const itemKey = `${product.id}-${variantId || size || 'default'}-${color || 'default'}`;
    const existingIndex = cart.findIndex((item) => item.id === itemKey);

    let updatedCart: CartItem[];
    const itemPrice = variantId
      ? product.variants.find((v) => v.id === variantId)?.price || product.price
      : product.price;
    const itemMrp = variantId
      ? product.variants.find((v) => v.id === variantId)?.mrp || product.mrp
      : product.mrp;
    const maxStock = variantId
      ? product.variants.find((v) => v.id === variantId)?.stock || product.stock
      : product.stock;

    if (existingIndex > -1) {
      updatedCart = [...cart];
      const newQty = Math.min(updatedCart[existingIndex].quantity + quantity, maxStock);
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: newQty,
      };
    } else {
      const newItem: CartItem = {
        id: itemKey,
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        productImage: product.images[0],
        categoryName: product.categoryName,
        variantId,
        size: size || product.sizes[0] || 'Standard',
        color: color || product.colors[0] || 'Standard',
        pattern: pattern || (product.patterns && product.patterns[0]) || '',
        price: itemPrice,
        mrp: itemMrp,
        quantity: Math.min(quantity, maxStock || 99),
        maxStock: maxStock || 99,
      };
      updatedCart = [...cart, newItem];
    }

    setCart(updatedCart);
    StoreService.saveCart(updatedCart);
    addToast('success', 'Added to Cart', `${product.name} has been added.`);
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const updated = cart.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.min(quantity, item.maxStock || 99) }
        : item
    );
    setCart(updated);
    StoreService.saveCart(updated);
  };

  const removeFromCart = (itemId: string) => {
    const item = cart.find((i) => i.id === itemId);
    const updated = cart.filter((i) => i.id !== itemId);
    setCart(updated);
    StoreService.saveCart(updated);
    if (item) {
      addToast('info', 'Item Removed', `${item.productName} removed from cart.`);
    }
  };

  const clearCart = () => {
    setCart([]);
    StoreService.saveCart([]);
    setAppliedCoupon(null);
    setCouponDiscountAmount(0);
  };

  // Cart Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartDiscount = couponDiscountAmount;
  const cartShipping =
    cartSubtotal === 0 || cartSubtotal >= settings.freeShippingThreshold
      ? 0
      : settings.flatShippingRate;
  const cartTax = Math.round(((cartSubtotal - cartDiscount) * settings.taxRatePercent) / 100);
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping + cartTax);

  // Coupons
  const applyCoupon = (code: string) => {
    const res = StoreService.validateCoupon(code, cartSubtotal);
    if (res.valid && res.coupon) {
      setAppliedCoupon(res.coupon);
      setCouponDiscountAmount(res.discount);
      addToast('success', 'Coupon Applied', res.message);
      return { success: true, message: res.message };
    } else {
      addToast('error', 'Coupon Error', res.message);
      return { success: false, message: res.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscountAmount(0);
    addToast('info', 'Coupon Removed', 'Coupon discount has been removed.');
  };

  const addCoupon = (couponData: Omit<Coupon, 'id'> & { id?: string }) => {
    const created = StoreService.addCoupon(couponData);
    setCoupons(StoreService.getCoupons());
    addToast('success', 'Coupon Created', `Coupon code "${created.code}" is now active.`);
    return created;
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    StoreService.updateCoupon(id, updates);
    setCoupons(StoreService.getCoupons());
    addToast('success', 'Coupon Updated', 'Changes saved successfully.');
  };

  const deleteCoupon = (id: string) => {
    StoreService.deleteCoupon(id);
    setCoupons(StoreService.getCoupons());
    if (appliedCoupon?.id === id || appliedCoupon?.code.toUpperCase() === id.toUpperCase()) {
      removeCoupon();
    }
    addToast('info', 'Coupon Removed', 'Promo discount code was deleted.');
  };

  // Recalculate coupon on cart total changes
  useEffect(() => {
    if (appliedCoupon && cartSubtotal > 0) {
      const res = StoreService.validateCoupon(appliedCoupon.code, cartSubtotal);
      if (res.valid) {
        setCouponDiscountAmount(res.discount);
      } else {
        setAppliedCoupon(null);
        setCouponDiscountAmount(0);
      }
    } else if (cartSubtotal === 0) {
      setAppliedCoupon(null);
      setCouponDiscountAmount(0);
    }
  }, [cartSubtotal, appliedCoupon]);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    let updated: string[];
    const product = products.find((p) => p.id === productId);
    if (wishlist.includes(productId)) {
      updated = wishlist.filter((id) => id !== productId);
      addToast('info', 'Wishlist Updated', `${product?.name || 'Item'} removed from wishlist.`);
    } else {
      updated = [...wishlist, productId];
      addToast('success', 'Added to Wishlist', `${product?.name || 'Item'} saved to wishlist.`);
    }
    setWishlist(updated);
    StoreService.saveWishlist(updated);
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  // Recently Viewed
  const recordProductView = (productId: string) => {
    StoreService.addRecentlyViewed(productId);
    setRecentlyViewedIds(StoreService.getRecentlyViewed());
  };

  const recentlyViewedProducts = products.filter((p) => recentlyViewedIds.includes(p.id));

  // User
  const loginUser = (email: string, role: 'customer' | 'admin' = 'customer', name?: string) => {
    const newUser: UserProfile = {
      uid: `user-${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      phone: '+91 98765 43210',
      role,
      savedAddresses: [
        {
          id: 'addr-1',
          fullName: name || email.split('@')[0],
          phone: '+91 98765 43210',
          houseFlat: 'Flat 402, Green Glen',
          street: 'Outer Ring Road',
          area: 'Bellandur',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560103',
          landmark: 'Opposite Central Mall',
          isDefault: true,
        },
      ],
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    StoreService.saveUser(newUser);
    addToast('success', 'Welcome Back!', `Signed in as ${newUser.name}`);
  };

  const loginWithGoogle = (googleData?: { name?: string; email?: string; avatar?: string }) => {
    const email = googleData?.email || 'saini.pardeep45@gmail.com';
    const name = googleData?.name || 'Pardeep Saini';
    const avatar =
      googleData?.avatar ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';
    const isAdminUser =
      email.toLowerCase().includes('admin') || email.toLowerCase().includes('saini.pardeep');

    const newUser: UserProfile = {
      uid: `google-${Date.now()}`,
      name,
      email,
      phone: '+91 98123 45678',
      avatar,
      provider: 'google',
      role: isAdminUser ? 'admin' : 'customer',
      savedAddresses: [
        {
          id: 'addr-google-1',
          fullName: name,
          phone: '+91 98123 45678',
          email,
          houseFlat: 'Flat 402, Tower B, Palm Meadows',
          street: 'Golf Course Extension Road',
          area: 'Sector 65',
          city: 'Gurugram',
          state: 'Haryana',
          pincode: '122018',
          landmark: 'Near Club House',
          isDefault: true,
        },
      ],
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    StoreService.saveUser(newUser);
    addToast('success', 'Google Sign-In Successful', `Welcome ${newUser.name}! Signed in via Google.`);
  };

  const logoutUser = () => {
    setUser(null);
    StoreService.saveUser(null);
    addToast('info', 'Signed Out', 'You have been logged out securely.');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    StoreService.saveUser(updated);
    addToast('success', 'Profile Updated', 'Your profile details have been saved.');
  };

  const saveAddress = (address: Address) => {
    if (!user) return;
    const addrId = address.id || `addr-${Date.now()}`;
    const isNew = !address.id;
    let newAddresses: Address[];

    if (isNew) {
      newAddresses = [...user.savedAddresses, { ...address, id: addrId }];
    } else {
      newAddresses = user.savedAddresses.map((a) => (a.id === addrId ? { ...address, id: addrId } : a));
    }

    if (address.isDefault) {
      newAddresses = newAddresses.map((a) => ({
        ...a,
        isDefault: a.id === addrId,
      }));
    }

    updateUserProfile({ savedAddresses: newAddresses });
    addToast('success', 'Address Saved', 'Address has been saved to your account.');
  };

  const deleteAddress = (addressId: string) => {
    if (!user) return;
    const filtered = user.savedAddresses.filter((a) => a.id !== addressId);
    updateUserProfile({ savedAddresses: filtered });
    addToast('info', 'Address Removed', 'Saved address was deleted.');
  };

  // Orders
  const createOrder = (orderData: any) => {
    const newOrder = StoreService.createOrder({
      ...orderData,
      couponCode: appliedCoupon?.code,
      couponDiscount: couponDiscountAmount,
    });
    setOrders(StoreService.getOrders());
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: any,
    note?: string,
    courierName?: string,
    trackingNumber?: string
  ) => {
    StoreService.updateOrderStatus(orderId, status, note, courierName, trackingNumber);
    setOrders(StoreService.getOrders());
    addToast('success', 'Order Updated', `Order status changed to ${status}`);
  };

  const getOrderById = (orderId: string) => {
    return orders.find(
      (o) => o.id === orderId || o.orderNumber.toLowerCase() === orderId.toLowerCase()
    );
  };

  // Reviews
  const addReview = (reviewData: Omit<ProductReview, 'id' | 'createdAt'>) => {
    const created = StoreService.addReview(reviewData);
    setReviews(StoreService.getReviews());
    refreshProducts();
    addToast('success', 'Review Submitted', 'Thank you! Your review is awaiting approval.');
  };

  const updateReviewStatus = (reviewId: string, approved: boolean, featured?: boolean) => {
    const current = StoreService.getReviews();
    const updated = current.map((r) =>
      r.id === reviewId ? { ...r, isApproved: approved, isFeatured: featured ?? r.isFeatured } : r
    );
    StoreService.saveReviews(updated);
    setReviews(updated);
    refreshProducts();
    addToast('success', 'Review Updated', 'Review status updated.');
  };

  const deleteReview = (reviewId: string) => {
    const current = StoreService.getReviews();
    const filtered = current.filter((r) => r.id !== reviewId);
    StoreService.saveReviews(filtered);
    setReviews(filtered);
    refreshProducts();
    addToast('info', 'Review Deleted', 'Review removed.');
  };

  // Banners & Content
  const updateHeroSlides = (slides: HeroSlide[]) => {
    StoreService.saveHeroSlides(slides);
    setHeroSlides(slides);
    addToast('success', 'Hero Banners Saved', 'Homepage hero slider updated.');
  };

  const updatePromoBanner = (banner: PromotionalBanner) => {
    StoreService.savePromoBanner(banner);
    setPromoBanner(banner);
    addToast('success', 'Promotional Banner Saved', 'Promo banner updated.');
  };

  const updateFAQs = (newFaqs: FAQItem[]) => {
    StoreService.saveFAQs(newFaqs);
    setFaqs(newFaqs);
    addToast('success', 'FAQs Updated', 'FAQ items saved successfully.');
  };

  // Settings
  const updateSettings = (newSettings: StoreSettings) => {
    StoreService.saveSettings(newSettings);
    setSettings(newSettings);
    addToast('success', 'Settings Saved', 'Store preferences and business details updated.');
  };

  const resetAllData = () => {
    StoreService.resetToDefaults();
    setProducts(StoreService.getProducts());
    setCategories(StoreService.getCategories());
    setCart(StoreService.getCart());
    setWishlist(StoreService.getWishlist());
    setOrders(StoreService.getOrders());
    setReviews(StoreService.getReviews());
    setHeroSlides(StoreService.getHeroSlides());
    setPromoBanner(StoreService.getPromoBanner());
    setFaqs(StoreService.getFAQs());
    setSettings(StoreService.getSettings());
    setUser(StoreService.getUser());
    addToast('info', 'Data Reset', 'Restored default Mansha Texo catalog and demo data.');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        refreshProducts,
        getProductBySlug,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartTax,
        cartShipping,
        cartTotal,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        coupons,
        appliedCoupon,
        couponDiscountAmount,
        applyCoupon,
        removeCoupon,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        wishlist,
        wishlistProducts,
        toggleWishlist,
        isInWishlist,
        recentlyViewedIds,
        recentlyViewedProducts,
        recordProductView,
        user,
        isAdmin,
        loginUser,
        loginWithGoogle,
        logoutUser,
        updateUserProfile,
        saveAddress,
        deleteAddress,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        reviews,
        addReview,
        updateReviewStatus,
        deleteReview,
        heroSlides,
        updateHeroSlides,
        promoBanner,
        updatePromoBanner,
        faqs,
        updateFAQs,
        settings,
        updateSettings,
        quickViewProduct,
        setQuickViewProduct,
        isSearchOpen,
        setIsSearchOpen,
        toasts,
        addToast,
        removeToast,
        resetAllData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
