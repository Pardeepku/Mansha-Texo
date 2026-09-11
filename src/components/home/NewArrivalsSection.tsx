import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

interface NewArrivalsSectionProps {
  onNavigate: (path: string) => void;
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({ onNavigate }) => {
  const { products } = useStore();
  const newArrivals = products
    .filter((p) => p.isNewArrival && p.isActive)
    .slice(0, 8);

  return (
    <section className="py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E87244] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Just Unpacked</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Fresh New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Latest weave patterns, trendsetting botanical prints, and eco-friendly natural fibers.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/new-arrivals')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#257335] hover:text-[#1E5C2B] group cursor-pointer"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </section>
  );
};
