import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CategoryGridProps {
  onNavigate: (path: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onNavigate }) => {
  const { categories } = useStore();

  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#257335] mb-2">
              <Sparkles className="w-4 h-4 text-[#E87244]" />
              <span>Tailored For Modern Living</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              Shop By Category
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
              Explore our wide variety of plush bathroom mats, hand-braided rugs, luxury carpets, and heavy-duty entrance solutions.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/categories')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#257335] hover:text-[#1E5C2B] group cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onNavigate(`/category/${category.slug}`)}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer bg-gray-900"
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              {/* Content Box */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                      {category.itemCount} Designs Available
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
                    {category.name}
                  </h3>

                  <p className="text-xs text-gray-300 mt-1 line-clamp-2 leading-relaxed opacity-90">
                    {category.description}
                  </p>
                </div>

                {/* Explore button pill */}
                <div className="pt-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E87244] group-hover:text-white uppercase tracking-wider transition-colors">
                    Explore Collection <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
