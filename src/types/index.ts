export type ProductCategory = 
  | 'bath-mats'
  | 'carpets'
  | 'rugs'
  | 'floor-mats'
  | 'door-mats'
  | 'kitchen-mats'
  | 'runner-mats'
  | string;

export type ProductBadge = 'NEW' | 'BEST SELLER' | 'SALE' | 'LIMITED STOCK' | 'OUT OF STOCK';

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  colorHex?: string;
  pattern?: string;
  price: number;
  mrp: number;
  stock: number;
  image?: string;
  weight?: string;
  dimensions?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  productName?: string;
  customerName: string;
  customerEmail?: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  isFeatured?: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  categoryId: ProductCategory;
  categoryName: string;
  subcategoryId?: string;
  images: string[];
  price: number;
  mrp: number;
  discountPercentage: number;
  sku: string;
  brand: string;
  material: string;
  colors: string[];
  sizes: string[];
  patterns: string[];
  variants: ProductVariant[];
  stock: number;
  lowStockThreshold: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  badge?: ProductBadge;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  isActive: boolean;
  careInstructions?: string[];
  specifications?: Record<string, string>;
  shippingInfo?: string;
  returnInfo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: ProductCategory;
  name: string;
  slug: string;
  description: string;
  image: string;
  bannerImage?: string;
  itemCount: number;
  featured: boolean;
}

export interface CartItem {
  id: string; // unique item entry id (productId + variantId)
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  categoryName: string;
  variantId?: string;
  size?: string;
  color?: string;
  pattern?: string;
  price: number;
  mrp: number;
  quantity: number;
  maxStock: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 10 for 10% or 200 for ₹200
  discountPercent?: number; // alias for percentage
  discountAmount?: number; // alias for fixed discount
  minOrderValue: number;
  minOrderAmount?: number; // alias for minOrderValue
  maxDiscount?: number;
  applicableCategory?: ProductCategory | 'all' | string;
  expiryDate: string;
  usageLimit?: number;
  usedCount?: number;
  isActive: boolean;
  description?: string;
}

export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  PROCESSING = 'Processing',
  PACKED = 'Packed',
  SHIPPED = 'Shipped',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
  RETURNED = 'Returned',
  REFUNDED = 'Refunded',
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  email?: string;
  houseFlat: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  variantId?: string;
  size?: string;
  color?: string;
  pattern?: string;
  price: number;
  mrp: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  location?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  email: string;
  phone: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  discount: number;
  couponCode?: string;
  couponDiscount: number;
  tax: number;
  shippingCharge: number;
  codFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  orderStatus: OrderStatus;
  status?: OrderStatus;
  customerPhone?: string;
  statusHistory: OrderStatusHistory[];
  trackingNumber?: string;
  courierName?: string;
  estimatedDeliveryDate?: string;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  provider?: 'email' | 'google';
  role: 'customer' | 'admin';
  savedAddresses: Address[];
  createdAt: string;
}

export interface NavigationLink {
  id: string;
  label: string;
  path: string;
  badge?: string;
  highlight?: boolean;
  isActive?: boolean;
}

export interface FooterLink {
  id: string;
  label: string;
  path: string;
}

export interface FooterValueProp {
  id: string;
  title: string;
  description: string;
  icon: 'truck' | 'rotate-ccw' | 'shield' | 'credit-card' | 'heart' | 'sparkles' | 'phone';
}

export interface FooterSectionConfig {
  aboutTitle: string;
  aboutText: string;
  newsletterHeading: string;
  newsletterSubtext: string;
  copyrightText: string;
  showPaymentBadges: boolean;
  paymentBadgesText: string;
  shopLinks: FooterLink[];
  customerCareLinks: FooterLink[];
  valueProps: FooterValueProp[];
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
  isActive: boolean;
}

export interface PromotionalBanner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
  bgColor?: string;
  isActive: boolean;
}

export interface FAQItem {
  id: string;
  category: 'General' | 'Orders & Shipping' | 'Returns & Refunds' | 'Products & Care' | 'Payments';
  question: string;
  answer: string;
}

export interface StoreSettings {
  storeName: string;
  brandHighlightText?: string;
  brandTagline: string;
  logoUrl?: string;
  showLogoImage?: boolean;
  showLogoText?: boolean;
  announcementText: string;
  announcementActive: boolean;
  phone: string;
  secondaryPhone?: string;
  email: string;
  supportEmail?: string;
  address: string;
  cityState?: string;
  businessHours: string;
  whatsappNumber: string;
  whatsappMessage: string;
  whatsappEnabled: boolean;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  flatShippingRate: number;
  shippingFee?: number; // alias
  taxRatePercent: number; // GST %
  codAvailable: boolean;
  codFee: number;
  minCodOrder: number;
  maxCodOrder: number;
  storeNotice?: string;
  socials: {
    instagram: string;
    facebook: string;
    youtube: string;
    pinterest: string;
    twitter?: string;
  };
  seo: {
    defaultTitle: string;
    metaDescription: string;
    keywords: string;
  };
  menuLinks: NavigationLink[];
  footer: FooterSectionConfig;
}

export interface FilterState {
  category?: ProductCategory | 'all';
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
  materials: string[];
  patterns: string[];
  ratings: number | null;
  inStockOnly: boolean;
  discountOnly: boolean;
  searchQuery: string;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'best-selling' | 'highest-rated' | 'discount';
}
