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
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#257335] mb-2">
              <Sparkles className="w-4 h-4 text-[#E87244]" />
              <span>Handpicked Perfection</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Featured Collection
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Top curated picks embodying pure softness, exquisite weaves, and daily durability.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/shop')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#257335] hover:text-[#1E5C2B] group cursor-pointer"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </section>
  );
};
