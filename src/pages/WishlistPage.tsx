import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

interface WishlistPageProps {
  onNavigate: (path: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigate }) => {
  const { wishlistProducts, addToCart, toggleWishlist } = useStore();

  const handleAddAllToCart = () => {
    wishlistProducts.forEach((product) => {
      addToCart(product, 1);
    });
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-orange-50 text-[#E87244] rounded-full flex items-center justify-center mb-4">
          <Heart className="w-10 h-10 stroke-[2]" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900">
          Your Wishlist is Empty
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-md">
          Save your favorite bath mats, designer carpets, and artisan rugs here to purchase later.
        </p>
        <button
          onClick={() => onNavigate('/shop')}
          className="mt-6 px-8 py-3.5 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
        >
          Browse Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-4 sm:py-12 pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-between mb-5 sm:mb-8 gap-2">
          <div>
            <h1 className="font-serif text-xl sm:text-3xl font-extrabold text-gray-900">
              Wishlist ({wishlistProducts.length})
            </h1>
            <p className="hidden sm:block text-xs sm:text-sm text-gray-500 mt-1">
              Your favorite home furnishings curated for quick checkout.
            </p>
          </div>

          <button
            onClick={handleAddAllToCart}
            className="px-3.5 py-2 sm:px-5 sm:py-2.5 bg-[#257335] active:bg-[#1E5C2B] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Move All to Cart
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
};
