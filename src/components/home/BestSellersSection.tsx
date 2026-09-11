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
    <section className="py-16 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E87244] mb-2">
              <Flame className="w-4 h-4 fill-current" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Our Best Sellers
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              The highest-rated floor mats, carpets and rugs beloved by thousands of Indian households.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/best-sellers')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#257335] hover:text-[#1E5C2B] group cursor-pointer"
          >
            <span>View All Best Sellers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </section>
  );
};
