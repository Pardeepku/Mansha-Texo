import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuickViewModalProps {
  onNavigate: (path: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ onNavigate }) => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    isInWishlist,
    toggleWishlist,
  } = useStore();

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImgIndex(0);
      setSelectedSize(quickViewProduct.sizes[0] || '');
      setSelectedColor(quickViewProduct.colors[0] || '');
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const inWishlist = isInWishlist(quickViewProduct.id);

  // Variant matching
  const matchingVariant = quickViewProduct.variants.find(
    (v) =>
      (!selectedSize || v.size === selectedSize) &&
      (!selectedColor || v.color === selectedColor)
  );

  const activePrice = matchingVariant?.price || quickViewProduct.price;
  const activeMrp = matchingVariant?.mrp || quickViewProduct.mrp;
  const activeStock = matchingVariant?.stock ?? quickViewProduct.stock;

  const handleAddToCart = () => {
    addToCart(
      quickViewProduct,
      quantity,
      matchingVariant?.id,
      selectedSize,
      selectedColor
    );
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleViewDetails = () => {
    const slug = quickViewProduct.slug;
    setQuickViewProduct(null);
    onNavigate(`/product/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8"
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 text-gray-400 hover:text-gray-700 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Images Gallery */}
          <div className="p-6 bg-gray-50 flex flex-col justify-between">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-inner mb-4">
              <img
                src={quickViewProduct.images[selectedImgIndex] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
              {quickViewProduct.badge && (
                <span className="absolute top-3 left-3 bg-[#257335] text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded shadow">
                  {quickViewProduct.badge}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {quickViewProduct.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                      selectedImgIndex === idx
                        ? 'border-[#257335] scale-105 shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Controls */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#257335]">
                  {quickViewProduct.categoryName}
                </span>
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-800 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{quickViewProduct.rating}</span>
                  <span className="text-gray-400 font-normal">({quickViewProduct.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-extrabold text-gray-900 leading-snug">
                {quickViewProduct.name}
              </h2>

              <p className="text-xs text-gray-400 mt-1 font-mono">
                SKU: {matchingVariant?.sku || quickViewProduct.sku}
              </p>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl font-black text-gray-900">
                  ₹{activePrice.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{activeMrp.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-[#E87244] bg-orange-50 px-2 py-0.5 rounded-full">
                  {quickViewProduct.discountPercentage}% OFF
                </span>
              </div>

              {/* Short Description */}
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                {quickViewProduct.shortDescription}
              </p>

              {/* Sizes Selection */}
              {quickViewProduct.sizes.length > 0 && (
                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                    Size: <span className="text-[#257335] normal-case font-semibold">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 text-xs rounded-lg font-semibold border transition-all cursor-pointer ${
                          selectedSize === s
                            ? 'border-[#257335] bg-emerald-50 text-[#257335] shadow-xs'
                            : 'border-gray-200 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors Selection */}
              {quickViewProduct.colors.length > 0 && (
                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                    Color: <span className="text-[#257335] normal-case font-semibold">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 text-xs rounded-lg font-semibold border transition-all cursor-pointer ${
                          selectedColor === c
                            ? 'border-[#257335] bg-emerald-50 text-[#257335]'
                            : 'border-gray-200 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status Indicator */}
              <div className="mt-4 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${activeStock > 5 ? 'bg-emerald-500' : activeStock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                <span className="text-xs font-medium text-gray-700">
                  {activeStock > 5 ? (
                    <span className="text-emerald-700 font-semibold">In Stock — Ready to ship</span>
                  ) : activeStock > 0 ? (
                    <span className="text-amber-700 font-semibold">Only {activeStock} units left in stock!</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Temporarily Out of Stock</span>
                  )}
                </span>
              </div>
            </div>

            {/* Actions & Quantity */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-bold text-gray-900 w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(activeStock, q + 1))}
                    disabled={quantity >= activeStock}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={activeStock <= 0}
                  className="flex-1 py-3 px-4 bg-[#257335] hover:bg-[#1E5C2B] disabled:bg-gray-300 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
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

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                    inWishlist
                      ? 'border-[#E87244] bg-orange-50 text-[#E87244]'
                      : 'border-gray-200 text-gray-500 hover:text-[#E87244]'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Full Details link */}
              <button
                onClick={handleViewDetails}
                className="w-full text-center text-xs font-bold text-[#257335] hover:underline mt-3 flex items-center justify-center gap-1 cursor-pointer"
              >
                View Complete Product Details & Specifications <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
