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
  OrderStatus
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_HERO_SLIDES,
  INITIAL_PROMOTIONAL_BANNER,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_FAQS,
  INITIAL_STORE_SETTINGS,
  INITIAL_ORDERS
} from '../data/seedData';

const STORAGE_KEYS = {
  PRODUCTS: 'mansha_texo_products_v1',
  CATEGORIES: 'mansha_texo_categories_v1',
  CART: 'mansha_texo_cart_v1',
  WISHLIST: 'mansha_texo_wishlist_v1',
  RECENTLY_VIEWED: 'mansha_texo_recent_v1',
  COUPONS: 'mansha_texo_coupons_v1',
  ORDERS: 'mansha_texo_orders_v1',
  REVIEWS: 'mansha_texo_reviews_v1',
  HERO_SLIDES: 'mansha_texo_hero_slides_v1',
  PROMO_BANNER: 'mansha_texo_promo_banner_v1',
  FAQS: 'mansha_texo_faqs_v1',
  SETTINGS: 'mansha_texo_settings_v1',
  USER: 'mansha_texo_user_v1',
  ANALYTICS: 'mansha_texo_analytics_v1',
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export class StoreService {
  // Products
  static getProducts(): Product[] {
    return getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  static saveProducts(products: Product[]): void {
    setStorage(STORAGE_KEYS.PRODUCTS, products);
  }

  static getProductBySlug(slug: string): Product | undefined {
    const products = this.getProducts();
    return products.find(p => p.slug === slug || p.id === slug);
  }

  static addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newProduct, ...products];
    this.saveProducts(updated);
    return newProduct;
  }

  static updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveProducts(products);
    return products[index];
  }

  static deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;
    this.saveProducts(filtered);
    return true;
  }

  // Categories
  static getCategories(): Category[] {
    return getStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  static saveCategories(categories: Category[]): void {
    setStorage(STORAGE_KEYS.CATEGORIES, categories);
  }

  static addCategory(category: Omit<Category, 'id'> & { id?: string }): Category {
    const categories = this.getCategories();
    const newCategory: Category = {
      ...category,
      id: category.id || `cat-${Date.now()}`,
    };
    this.saveCategories([...categories, newCategory]);
    return newCategory;
  }

  static updateCategory(id: string, updates: Partial<Category>): void {
    const categories = this.getCategories();
    const updated = categories.map(c => c.id === id ? { ...c, ...updates } : c);
    this.saveCategories(updated);
  }

  static deleteCategory(id: string): void {
    const categories = this.getCategories();
    const filtered = categories.filter(c => c.id !== id);
    this.saveCategories(filtered);
  }

  // Cart
  static getCart(): CartItem[] {
    return getStorage<CartItem[]>(STORAGE_KEYS.CART, []);
  }

  static saveCart(cart: CartItem[]): void {
    setStorage(STORAGE_KEYS.CART, cart);
  }

  // Wishlist (list of product IDs)
  static getWishlist(): string[] {
    return getStorage<string[]>(STORAGE_KEYS.WISHLIST, ['prod-bm-01', 'prod-cpt-01']);
  }

  static saveWishlist(wishlist: string[]): void {
    setStorage(STORAGE_KEYS.WISHLIST, wishlist);
  }

  // Recently Viewed
  static getRecentlyViewed(): string[] {
    return getStorage<string[]>(STORAGE_KEYS.RECENTLY_VIEWED, []);
  }

  static addRecentlyViewed(productId: string): void {
    const current = this.getRecentlyViewed();
    const filtered = current.filter(id => id !== productId);
    const updated = [productId, ...filtered].slice(0, 10);
    setStorage(STORAGE_KEYS.RECENTLY_VIEWED, updated);
  }

  // Orders
  static getOrders(): Order[] {
    return getStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  }

  static saveOrders(orders: Order[]): void {
    setStorage(STORAGE_KEYS.ORDERS, orders);
  }

  static getOrderById(orderId: string): Order | undefined {
    const orders = this.getOrders();
    return orders.find(o => o.id === orderId || o.orderNumber.toLowerCase() === orderId.toLowerCase());
  }

  static createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Order {
    const orders = this.getOrders();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MT-${new Date().getFullYear()}-${randomNum}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      statusHistory: [
        {
          status: orderData.orderStatus || OrderStatus.PENDING,
          timestamp: new Date().toISOString(),
          note: 'Order placed successfully by customer',
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newOrder, ...orders];
    this.saveOrders(updated);
    return newOrder;
  }

  static updateOrderStatus(orderId: string, status: OrderStatus, note?: string, courierName?: string, trackingNumber?: string): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId || o.orderNumber === orderId);
    if (index === -1) return null;

    const order = orders[index];
    const newHistory = [
      ...order.statusHistory,
      {
        status,
        timestamp: new Date().toISOString(),
        note: note || `Order marked as ${status}`,
      }
    ];

    orders[index] = {
      ...order,
      orderStatus: status,
      statusHistory: newHistory,
      courierName: courierName || order.courierName,
      trackingNumber: trackingNumber || order.trackingNumber,
      updatedAt: new Date().toISOString(),
    };

    this.saveOrders(orders);
    return orders[index];
  }

  // Reviews
  static getReviews(): ProductReview[] {
    return getStorage<ProductReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  static saveReviews(reviews: ProductReview[]): void {
    setStorage(STORAGE_KEYS.REVIEWS, reviews);
  }

  static addReview(review: Omit<ProductReview, 'id' | 'createdAt'>): ProductReview {
    const reviews = this.getReviews();
    const newReview: ProductReview = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newReview, ...reviews];
    this.saveReviews(updated);

    // Update product rating and review count
    const product = this.getProducts().find(p => p.id === review.productId);
    if (product) {
      const prodReviews = updated.filter(r => r.productId === review.productId && r.isApproved);
      const totalRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
      const avg = prodReviews.length ? Math.round((totalRating / prodReviews.length) * 10) / 10 : product.rating;
      this.updateProduct(product.id, {
        rating: avg,
        reviewCount: prodReviews.length,
      });
    }

    return newReview;
  }

  // Coupons
  static getCoupons(): Coupon[] {
    return getStorage<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  }

  static saveCoupons(coupons: Coupon[]): void {
    setStorage(STORAGE_KEYS.COUPONS, coupons);
  }

  static addCoupon(coupon: Omit<Coupon, 'id'> & { id?: string }): Coupon {
    const coupons = this.getCoupons();
    const discountVal = coupon.discountValue ?? coupon.discountPercent ?? coupon.discountAmount ?? 10;
    const minOrder = coupon.minOrderValue ?? coupon.minOrderAmount ?? 0;
    const newCoupon: Coupon = {
      ...coupon,
      id: coupon.id || `coup-${Date.now()}`,
      discountType: coupon.discountType || 'percentage',
      discountValue: discountVal,
      discountPercent: coupon.discountType === 'percentage' || !coupon.discountType ? discountVal : undefined,
      discountAmount: coupon.discountType === 'fixed' ? discountVal : undefined,
      minOrderValue: minOrder,
      minOrderAmount: minOrder,
      isActive: coupon.isActive ?? true,
      expiryDate: coupon.expiryDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      usedCount: coupon.usedCount || 0,
      description: coupon.description || `${discountVal}${coupon.discountType === 'fixed' ? ' ₹' : '%'} OFF`,
    };
    const updated = [newCoupon, ...coupons.filter(c => c.code.toUpperCase() !== newCoupon.code.toUpperCase())];
    this.saveCoupons(updated);
    return newCoupon;
  }

  static updateCoupon(id: string, updates: Partial<Coupon>): Coupon | null {
    const coupons = this.getCoupons();
    const index = coupons.findIndex(c => c.id === id || c.code.toUpperCase() === id.toUpperCase());
    if (index === -1) return null;
    coupons[index] = {
      ...coupons[index],
      ...updates,
    };
    this.saveCoupons(coupons);
    return coupons[index];
  }

  static deleteCoupon(id: string): void {
    const coupons = this.getCoupons();
    const filtered = coupons.filter(c => c.id !== id && c.code.toUpperCase() !== id.toUpperCase());
    this.saveCoupons(filtered);
  }

  static validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: Coupon; discount: number; message: string } {
    const coupons = this.getCoupons();
    const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);

    if (!found) {
      return { valid: false, discount: 0, message: 'Invalid or expired promo coupon code.' };
    }

    const minOrder = found.minOrderValue ?? found.minOrderAmount ?? 0;
    if (subtotal < minOrder) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order value of ₹${minOrder} required for coupon ${found.code}.`,
      };
    }

    const discountVal = found.discountValue ?? found.discountPercent ?? found.discountAmount ?? 0;
    let calculatedDiscount = 0;
    if (found.discountType === 'percentage' || (!found.discountType && found.discountPercent)) {
      calculatedDiscount = Math.round((subtotal * discountVal) / 100);
      if (found.maxDiscount && calculatedDiscount > found.maxDiscount) {
        calculatedDiscount = found.maxDiscount;
      }
    } else {
      calculatedDiscount = discountVal;
    }

    // Ensure discount doesn't exceed subtotal
    calculatedDiscount = Math.min(calculatedDiscount, subtotal);

    return {
      valid: true,
      coupon: found,
      discount: calculatedDiscount,
      message: `Coupon ${found.code} applied! Saved ₹${calculatedDiscount}.`,
    };
  }

  // Hero Slides & CMS
  static getHeroSlides(): HeroSlide[] {
    return getStorage<HeroSlide[]>(STORAGE_KEYS.HERO_SLIDES, INITIAL_HERO_SLIDES);
  }

  static saveHeroSlides(slides: HeroSlide[]): void {
    setStorage(STORAGE_KEYS.HERO_SLIDES, slides);
  }

  static getPromoBanner(): PromotionalBanner {
    return getStorage<PromotionalBanner>(STORAGE_KEYS.PROMO_BANNER, INITIAL_PROMOTIONAL_BANNER);
  }

  static savePromoBanner(banner: PromotionalBanner): void {
    setStorage(STORAGE_KEYS.PROMO_BANNER, banner);
  }

  static getFAQs(): FAQItem[] {
    return getStorage<FAQItem[]>(STORAGE_KEYS.FAQS, INITIAL_FAQS);
  }

  static saveFAQs(faqs: FAQItem[]): void {
    setStorage(STORAGE_KEYS.FAQS, faqs);
  }

  // Store Settings
  static getSettings(): StoreSettings {
    const saved = getStorage<Partial<StoreSettings>>(STORAGE_KEYS.SETTINGS, INITIAL_STORE_SETTINGS);
    return {
      ...INITIAL_STORE_SETTINGS,
      ...saved,
      socials: {
        ...INITIAL_STORE_SETTINGS.socials,
        ...(saved.socials || {}),
      },
      seo: {
        ...INITIAL_STORE_SETTINGS.seo,
        ...(saved.seo || {}),
      },
      menuLinks:
        saved.menuLinks && Array.isArray(saved.menuLinks) && saved.menuLinks.length > 0
          ? saved.menuLinks
          : INITIAL_STORE_SETTINGS.menuLinks,
      footer: {
        ...INITIAL_STORE_SETTINGS.footer,
        ...(saved.footer || {}),
        shopLinks:
          saved.footer?.shopLinks && saved.footer.shopLinks.length > 0
            ? saved.footer.shopLinks
            : INITIAL_STORE_SETTINGS.footer.shopLinks,
        customerCareLinks:
          saved.footer?.customerCareLinks && saved.footer.customerCareLinks.length > 0
            ? saved.footer.customerCareLinks
            : INITIAL_STORE_SETTINGS.footer.customerCareLinks,
        valueProps:
          saved.footer?.valueProps && saved.footer.valueProps.length > 0
            ? saved.footer.valueProps
            : INITIAL_STORE_SETTINGS.footer.valueProps,
      },
    };
  }

  static saveSettings(settings: StoreSettings): void {
    setStorage(STORAGE_KEYS.SETTINGS, settings);
  }

  // User Profile
  static getUser(): UserProfile | null {
    return getStorage<UserProfile | null>(STORAGE_KEYS.USER, {
      uid: 'user_mansha_demo',
      name: 'Pardeep Saini',
      email: 'saini.pardeep45@gmail.com',
      phone: '+91 98123 45678',
      role: 'admin',
      savedAddresses: [
        {
          id: 'addr-1',
          fullName: 'Pardeep Saini',
          phone: '+91 98123 45678',
          email: 'saini.pardeep45@gmail.com',
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
      createdAt: '2026-06-01T00:00:00.000Z',
    });
  }

  static saveUser(user: UserProfile | null): void {
    setStorage(STORAGE_KEYS.USER, user);
  }

  // Reset to default seed
  static resetToDefaults(): void {
    localStorage.clear();
    setStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    setStorage(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
    setStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    setStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    setStorage(STORAGE_KEYS.HERO_SLIDES, INITIAL_HERO_SLIDES);
    setStorage(STORAGE_KEYS.PROMO_BANNER, INITIAL_PROMOTIONAL_BANNER);
    setStorage(STORAGE_KEYS.FAQS, INITIAL_FAQS);
    setStorage(STORAGE_KEYS.SETTINGS, INITIAL_STORE_SETTINGS);
  }
}
