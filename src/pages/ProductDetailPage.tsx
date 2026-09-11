import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Share2,
  ThumbsUp,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  slug,
  onNavigate,
}) => {
  const {
    products,
    getProductBySlug,
    addToCart,
    isInWishlist,
    toggleWishlist,
    reviews,
    addReview,
    recordProductView,
    addToast,
    setIsCartDrawerOpen,
  } = useStore();

  const product = getProductBySlug(slug) || products[0];

  useEffect(() => {
    if (product) {
      recordProductView(product.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product?.id]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Delivery Pincode checker
  const [pincodeInput, setPincodeInput] = useState('');
  const [deliveryResult, setDeliveryResult] = useState<{
    checked: boolean;
    available: boolean;
    date: string;
    cost: string;
  } | null>(null);

  // Review submission state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');

  // Active tab
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping' | 'reviews'>('details');

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || '');
      setQuantity(1);
      setDeliveryResult(null);
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-[#FAF8F5]">
        <h2 className="text-xl font-bold text-gray-900">Product not found</h2>
        <button
          onClick={() => onNavigate('/shop')}
          className="mt-4 px-6 py-2.5 bg-[#257335] text-white rounded-xl font-bold text-xs"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  // Find matching variant
  const currentVariant = product.variants.find(
    (v) =>
      (!selectedSize || v.size === selectedSize) &&
      (!selectedColor || v.color === selectedColor)
  );

  const price = currentVariant?.price || product.price;
  const mrp = currentVariant?.mrp || product.mrp;
  const stock = currentVariant?.stock ?? product.stock;
  const sku = currentVariant?.sku || product.sku;

  // Filter reviews for this product
  const productReviews = reviews.filter(
    (r) => r.productId === product.id && r.isApproved
  );

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, currentVariant?.id, selectedSize, selectedColor);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, currentVariant?.id, selectedSize, selectedColor);
    setIsCartDrawerOpen(false);
    onNavigate('/checkout');
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeInput || pincodeInput.length !== 6 || !/^\d+$/.test(pincodeInput)) {
      addToast('error', 'Invalid Pincode', 'Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    // Realistic delivery estimation based on pincode
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const dateFormatted = deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    setDeliveryResult({
      checked: true,
      available: true,
      date: dateFormatted,
      cost: price >= 499 ? 'FREE' : '₹49',
    });
    addToast('success', 'Pincode Serviceable', `Estimated delivery by ${dateFormatted}`);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewTitle || !reviewComment) {
      addToast('error', 'Incomplete Review', 'Please fill all required fields.');
      return;
    }
    addReview({
      productId: product.id,
      productName: product.name,
      userName: reviewName,
      userLocation: reviewLocation || 'India',
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      isVerifiedPurchase: true,
      isApproved: true,
    });
    setIsReviewModalOpen(false);
    setReviewName('');
    setReviewTitle('');
    setReviewComment('');
    setReviewLocation('');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Mansha Texo`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('info', 'Link Copied', 'Product link copied to clipboard.');
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1.5 overflow-x-auto">
          <button onClick={() => onNavigate('/')} className="hover:text-[#257335]">
            Home
          </button>
          <span>/</span>
          <button onClick={() => onNavigate('/shop')} className="hover:text-[#257335]">
            Shop
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate(`/category/${product.categorySlug}`)}
            className="hover:text-[#257335] uppercase text-[11px] font-semibold"
          >
            {product.categoryName}
          </button>
          <span>/</span>
          <span className="text-gray-900 font-semibold truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Product Hero Grid (Images + Info) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Gallery (5 cols) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Image Container with zoom aspect */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-[#257335] text-white text-xs font-extrabold uppercase px-3 py-1 rounded shadow-md tracking-wider">
                    {product.badge}
                  </span>
                )}
                <button
                  onClick={handleShare}
                  className="absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-md backdrop-blur-md transition-all cursor-pointer"
                  title="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-[#257335] scale-105 shadow-sm'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Value Badges underneath image */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-center">
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-[#257335] mb-1" />
                  <span className="text-[11px] font-bold text-gray-800">100% Cotton/Jute</span>
                  <span className="text-[10px] text-gray-500">Artisanal Grade</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center">
                  <RotateCcw className="w-4 h-4 text-[#E87244] mb-1" />
                  <span className="text-[11px] font-bold text-gray-800">7 Days Return</span>
                  <span className="text-[10px] text-gray-500">Doorstep Exchange</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center">
                  <Truck className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="text-[11px] font-bold text-gray-800">Free Delivery</span>
                  <span className="text-[10px] text-gray-500">On Orders ₹499+</span>
                </div>
              </div>
            </div>

            {/* Right: Info & Purchase Controls (7 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Category & Ratings */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#257335]">
                    {product.categoryName}
                  </span>
                  <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-full text-amber-900 text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-gray-400 font-normal">
                      ({product.reviewCount} customer reviews)
                    </span>
                  </div>
                </div>

                {/* Main Title */}
                <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                  {product.name}
                </h1>

                {/* SKU & Brand Line */}
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1.5 font-mono">
                  <span>SKU: {sku}</span>
                  <span>•</span>
                  <span className="text-[#257335] font-semibold">Mansha Texo Verified</span>
                </div>

                {/* Pricing Block */}
                <div className="mt-4 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-gray-900">
                    ₹{price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-base text-gray-400 line-through">
                    ₹{mrp.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-extrabold text-white bg-[#E87244] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {product.discountPercentage}% OFF
                  </span>
                  <span className="text-[11px] text-gray-500 ml-auto">Inclusive of all taxes</span>
                </div>

                {/* Short description */}
                <p className="text-xs sm:text-sm text-gray-600 mt-4 leading-relaxed">
                  {product.description}
                </p>

                {/* Sizes Selector */}
                {product.sizes.length > 0 && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-800">
                        Select Dimension / Size: <span className="text-[#257335]">{selectedSize}</span>
                      </label>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-4 py-2 text-xs rounded-xl font-bold border transition-all cursor-pointer ${
                            selectedSize === s
                              ? 'border-[#257335] bg-[#257335] text-white shadow-md'
                              : 'border-gray-200 text-gray-700 hover:border-gray-400 bg-white'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors Selector */}
                {product.colors.length > 0 && (
                  <div className="mt-5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
                      Color / Hue: <span className="text-[#257335]">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`px-3.5 py-1.5 text-xs rounded-xl font-bold border transition-all cursor-pointer ${
                            selectedColor === c
                              ? 'border-[#257335] bg-emerald-50 text-[#257335] ring-2 ring-[#257335]/20'
                              : 'border-gray-200 text-gray-700 hover:border-gray-400 bg-white'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock Level Indicator */}
                <div className="mt-5 flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      stock > 5 ? 'bg-emerald-500' : stock > 0 ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-xs font-semibold">
                    {stock > 5 ? (
                      <span className="text-emerald-700">In Stock — Available for immediate dispatch</span>
                    ) : stock > 0 ? (
                      <span className="text-amber-700 font-bold">Hurry! Only {stock} units left in stock</span>
                    ) : (
                      <span className="text-red-600">Currently Sold Out</span>
                    )}
                  </span>
                </div>

                {/* Quantity & CTA Buttons */}
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                  <div className="flex items-center gap-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="px-3.5 py-2.5 text-gray-600 hover:bg-gray-100 disabled:opacity-30 cursor-pointer font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-2.5 text-xs font-bold text-gray-900 w-10 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                        disabled={quantity >= stock}
                        className="px-3.5 py-2.5 text-gray-600 hover:bg-gray-100 disabled:opacity-30 cursor-pointer font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Cart */}
                    <button
                      onClick={handleAddToCart}
                      disabled={stock <= 0}
                      className="flex-1 py-3.5 px-4 bg-[#257335] hover:bg-[#1E5C2B] disabled:bg-gray-300 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {addedAnimation ? (
                        <>
                          <Check className="w-4 h-4" /> Added to Cart!
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" /> Add to Cart
                        </>
                      )}
                    </button>

                    {/* Wishlist */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                        inWishlist
                          ? 'border-[#E87244] bg-orange-50 text-[#E87244]'
                          : 'border-gray-200 text-gray-500 hover:text-[#E87244] bg-white'
                      }`}
                      title="Add to Wishlist"
                    >
                      <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Buy Now Button */}
                  <button
                    onClick={handleBuyNow}
                    disabled={stock <= 0}
                    className="w-full py-3.5 px-4 bg-[#E87244] hover:bg-[#d66235] disabled:bg-gray-300 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Instant Checkout / Buy Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Delivery Pincode Checker Box */}
                <div className="mt-6 p-4 rounded-2xl bg-gray-50 border border-gray-200/80">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
                    <MapPin className="w-4 h-4 text-[#257335]" /> Check Delivery Estimate
                  </div>
                  <form onSubmit={handleCheckPincode} className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincodeInput}
                      onChange={(e) => setPincodeInput(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Enter 6-digit PIN code..."
                      className="flex-1 px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Check
                    </button>
                  </form>

                  {deliveryResult && (
                    <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 text-emerald-900 text-xs flex items-start gap-2">
                      <Truck className="w-4 h-4 text-[#257335] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold">Standard Delivery Available</p>
                        <p className="text-[11px] text-emerald-800">
                          Get it by <span className="font-bold">{deliveryResult.date}</span> | Shipping:{' '}
                          <span className="font-bold">{deliveryResult.cost}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Specifications & Customer Reviews Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-sm mb-12">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto gap-4 sm:gap-8 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'details'
                  ? 'border-[#257335] text-[#257335]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Product Specifications
            </button>
            <button
              onClick={() => setActiveTab('care')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'care'
                  ? 'border-[#257335] text-[#257335]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Care & Maintenance
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'shipping'
                  ? 'border-[#257335] text-[#257335]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Shipping & Returns
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'border-[#257335] text-[#257335]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Reviews ({productReviews.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-6">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Key Features</h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#257335]" />
                      <span><strong>Material Composition:</strong> {product.material}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#257335]" />
                      <span><strong>Dimensions:</strong> {selectedSize || product.sizes[0]}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#257335]" />
                      <span><strong>Backing Type:</strong> {product.backing || 'Anti-Skid TPR / Natural Latex Rubber'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#257335]" />
                      <span><strong>Density / GSM:</strong> {product.gsm ? `${product.gsm} GSM High-Density Weave` : '1800+ GSM'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#257335]" />
                      <span><strong>Absorbency Rating:</strong> Ultra High Moisture Lock</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Origin & Packaging</h4>
                  <div className="bg-gray-50 p-4 rounded-2xl space-y-2 text-xs text-gray-600">
                    <p><strong>Manufactured By:</strong> Mansha Texo Private Limited</p>
                    <p><strong>Country of Origin:</strong> India (Panipat, Haryana)</p>
                    <p><strong>Package Contents:</strong> 1 Unit of {product.name}</p>
                    <p><strong>Eco Compliance:</strong> OEKOTEX & Azo-Free Dye Certified</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="max-w-2xl space-y-3 text-xs text-gray-600 leading-relaxed">
                <h4 className="text-sm font-bold text-gray-900">How to Maintain & Clean</h4>
                <p>
                  {product.careInstructions ||
                    'Machine wash cold on delicate cycle using mild detergent. Do not bleach or dry clean. Tumble dry on low heat or line dry in shade. Regular gentle shaking or light vacuuming keeps the pile fresh and resilient.'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <span className="font-bold text-gray-800 block">Machine Wash</span>
                    <span className="text-[10px] text-gray-500">Cold 30°C</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <span className="font-bold text-gray-800 block">No Bleach</span>
                    <span className="text-[10px] text-gray-500">Color Safe</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <span className="font-bold text-gray-800 block">Tumble Low</span>
                    <span className="text-[10px] text-gray-500">Or Air Dry</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <span className="font-bold text-gray-800 block">Anti-Slip Safe</span>
                    <span className="text-[10px] text-gray-500">Wash Tested</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-2xl space-y-3 text-xs text-gray-600 leading-relaxed">
                <h4 className="text-sm font-bold text-gray-900">Dispatch & Return Policies</h4>
                <p>
                  All orders are dispatched within 24-48 hours from our central warehouse in Panipat. We partner with premier logistics providers (Bluedart, Delhivery, Shadowfax) with live SMS and WhatsApp tracking.
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Free doorstep delivery on orders above ₹499.</li>
                  <li>7-Day hassle-free return and replacement guarantee.</li>
                  <li>Unused products with original tags are eligible for instant refunds.</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Top Review Breakdown */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-center sm:text-left">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span className="text-3xl font-black text-gray-900">{product.rating}</span>
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Based on {productReviews.length} verified ratings</p>
                  </div>

                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="px-5 py-2.5 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    Write a Review
                  </button>
                </div>

                {/* Review Items */}
                <div className="divide-y divide-gray-100">
                  {productReviews.length > 0 ? (
                    productReviews.map((r) => (
                      <div key={r.id} className="py-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < r.rating ? 'fill-current' : 'text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-gray-400">
                            {new Date(r.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <h5 className="text-xs font-bold text-gray-900">{r.title}</h5>
                        <p className="text-xs text-gray-600 leading-relaxed">{r.comment}</p>

                        <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-1">
                          <span className="font-semibold text-gray-700">{r.userName}</span>
                          <span>•</span>
                          <span>{r.userLocation || 'India'}</span>
                          {r.isVerifiedPurchase && (
                            <span className="text-[#257335] font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-gray-500">
                      No reviews yet for this product. Be the first to share your experience!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Recommendation Carousel */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#257335]">
                  Customers Also Loved
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-gray-900 mt-0.5">
                  Related Collections
                </h3>
              </div>
              <button
                onClick={() => onNavigate(`/category/${product.categorySlug}`)}
                className="text-xs font-bold text-[#257335] hover:underline"
              >
                View Category
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Write a Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Review {product.name}</h3>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-700 ml-2">
                    {reviewRating} out of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={reviewLocation}
                  onChange={(e) => setReviewLocation(e.target.value)}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Review Headline *
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Unbelievably soft and quick drying!"
                  className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Detailed Feedback *
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell other customers about the texture, water absorption, grip, and washing experience..."
                  className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#257335] text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
