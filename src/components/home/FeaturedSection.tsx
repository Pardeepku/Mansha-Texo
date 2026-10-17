import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedSectionProps {
  onNavigate: (path: string) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ onNavigate }) => {
  const { products } = useStore();
  const featuredProducts = products.filter((p) => p.isFeatured && p.isActive).slice(0, 8);

  return (
    <section className="py-8 sm:py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-row items-end justify-between mb-5 sm:mb-10 gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#257335] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#E87244]" />
              <span>Handpicked Perfection</span>
            </div>
            <h2 className="font-serif text-xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Featured Collection
            </h2>
            <p className="hidden sm:block text-xs sm:text-sm text-gray-500 mt-1">
              Top curated picks embodying pure softness, exquisite weaves, and daily durability.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/shop')}
            className="inline-flex items-center gap-1 text-[11px] sm:text-sm font-bold text-[#257335] hover:text-[#1E5C2B] group cursor-pointer whitespace-nowrap"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 2-Column Mobile Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </section>
  );
};
