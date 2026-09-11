import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface PromoBannerSectionProps {
  onNavigate: (path: string) => void;
}

export const PromoBannerSection: React.FC<PromoBannerSectionProps> = ({ onNavigate }) => {
  const { promoBanner } = useStore();

  if (!promoBanner.isActive) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#1E5C2B]">
          {/* Image & Gradient */}
          <div className="absolute inset-0 z-0">
            <img
              src={promoBanner.image}
              alt={promoBanner.title}
              className="w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#173F20] via-[#1E5C2B]/90 to-[#257335]/70" />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-14 lg:p-16 max-w-2xl text-white space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-[#E87244]" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">
                {promoBanner.subtitle || 'Mansha Texo Special Offer'}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              {promoBanner.title}
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-xl">
              {promoBanner.description}
            </p>

            <div className="pt-3">
              <button
                onClick={() => onNavigate(promoBanner.ctaLink || '/shop')}
                className="px-6 py-3.5 bg-white hover:bg-emerald-50 text-[#1E5C2B] text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group cursor-pointer"
              >
                <span>{promoBanner.ctaText || 'Shop Collection'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
