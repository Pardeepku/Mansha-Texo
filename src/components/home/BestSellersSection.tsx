import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { ArrowRight, Flame } from 'lucide-react';

interface BestSellersSectionProps {
  onNavigate: (path: string) => void;
}

export const BestSellersSection: React.FC<BestSellersSectionProps> = ({ onNavigate }) => {
  const { products } = useStore();
  const bestSellers = products
    .filter((p) => p.isBestSeller && p.isActive)
    .slice(0, 8);

  return (
    <section className="py-8 sm:py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-row items-end justify-between mb-5 sm:mb-10 gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#E87244] mb-1">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-serif text-xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Our Best Sellers
            </h2>
            <p className="hidden sm:block text-xs sm:text-sm text-gray-500 mt-1">
              The highest-rated floor mats, carpets and rugs beloved by thousands of Indian households.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/best-sellers')}
            className="inline-flex items-center gap-1 text-[11px] sm:text-sm font-bold text-[#257335] hover:text-[#1E5C2B] group cursor-pointer whitespace-nowrap"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 2-Column Mobile Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </section>
  );
};
