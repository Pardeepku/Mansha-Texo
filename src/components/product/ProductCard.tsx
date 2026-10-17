import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onNavigate,
  layout = 'grid',
}) => {
  const { isInWishlist, toggleWishlist, addToCart, setQuickViewProduct } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const primaryImg = product.images[0] || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80';
  const secondaryImg = product.images[1] || primaryImg;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'BEST SELLER':
        return 'bg-[#257335] text-white';
      case 'NEW':
        return 'bg-[#E87244] text-white';
      case 'SALE':
        return 'bg-red-600 text-white';
      case 'LIMITED STOCK':
        return 'bg-amber-600 text-white';
      case 'OUT OF STOCK':
        return 'bg-gray-800 text-white';
      default:
        return 'bg-[#257335] text-white';
    }
  };

  if (layout === 'list') {
    return (
      <div
        onClick={() => onNavigate(`/product/${product.slug}`)}
        className="group flex flex-col sm:flex-row bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer p-4 gap-4"
      >
        {/* Image Box */}
        <div className="relative w-full sm:w-56 h-52 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
          <img
            src={isHovered ? secondaryImg : primaryImg}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
          {product.badge && (
            <span
              className={`absolute top-2.5 left-2.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm ${getBadgeStyle(
                product.badge
              )}`}
            >
              {product.badge}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#257335]">
                {product.categoryName}
              </span>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-700 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-gray-400 text-[10px]">({product.reviewCount})</span>
              </div>
            </div>

            <h3 className="text-base font-bold text-gray-900 mt-1.5 group-hover:text-[#257335] transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                Material: {product.material}
              </span>
              {product.sizes[0] && (
                <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  Size: {product.sizes[0]}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-gray-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-gray-400 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-[#E87244]">
                ({product.discountPercentage}% OFF)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`p-2 rounded-full border transition-colors cursor-pointer ${
                  inWishlist
                    ? 'border-[#E87244] bg-orange-50 text-[#E87244]'
                    : 'border-gray-200 text-gray-500 hover:text-[#E87244]'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
              <button
                type="button"
                onClick={handleQuickView}
                className="p-2 rounded-full border border-gray-200 text-gray-500 hover:text-[#257335] hover:bg-emerald-50 transition-colors cursor-pointer"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onNavigate(`/product/${product.slug}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col justify-between cursor-pointer active:scale-[0.99]"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
        <img
          src={isHovered ? secondaryImg : primaryImg}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Official Badge */}
        {product.badge && (
          <span
            className={`absolute top-2 left-2 sm:top-3 sm:left-3 text-[9px] sm:text-[10px] font-extrabold uppercase px-1.5 sm:px-2.5 py-0.5 rounded shadow-xs tracking-wide ${getBadgeStyle(
              product.badge
            )}`}
          >
            {product.badge}
          </span>
        )}

        {/* Quick Action floating buttons (Wishlist & Quick View) */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all active:scale-90 cursor-pointer ${
              inWishlist
                ? 'bg-[#E87244] text-white'
                : 'bg-white/90 text-gray-600 hover:text-[#E87244] hover:bg-white'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleQuickView}
            className="hidden sm:flex w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-[#257335] items-center justify-center backdrop-blur-md shadow-sm transition-all cursor-pointer"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Overlay on bottom of image for Desktop */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-2.5 bg-white/95 hover:bg-[#257335] text-gray-900 hover:text-white text-xs font-bold rounded-xl shadow-lg backdrop-blur-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 group-hover:text-white" /> Added to Cart!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#257335] group-hover:text-white" /> Quick Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-1">
            <span className="font-semibold uppercase tracking-wider text-[#257335] truncate max-w-[90px] sm:max-w-none">
              {product.categoryName}
            </span>
            <div className="flex items-center gap-0.5 text-amber-500 font-bold flex-shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-gray-400 font-normal hidden sm:inline">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#257335] transition-colors">
            {product.name}
          </h3>

          {/* Material & Size Specs Preview */}
          <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5 sm:mt-1 line-clamp-1">
            {product.material} {product.sizes[0] ? `• ${product.sizes[0]}` : ''}
          </p>
        </div>

        {/* Pricing & Mobile Add to Cart */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-50 flex items-center justify-between gap-1">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1 truncate">
              <span className="text-sm sm:text-base font-extrabold text-gray-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.discountPercentage > 0 && (
              <span className="text-[9px] sm:text-[10px] font-bold text-[#E87244] block">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Mobile CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="sm:hidden p-2 rounded-lg bg-[#257335] active:bg-[#1E5C2B] text-white transition-colors cursor-pointer flex-shrink-0"
            aria-label="Add to Cart"
          >
            {addedAnimation ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
