import React from 'react';
import { Award, Feather, HeartHandshake, ShieldCheck, Sparkles, Layers } from 'lucide-react';

export const WhyChooseSection: React.FC = () => {
  const points = [
    {
      icon: Award,
      title: 'Premium Quality Materials',
      description: 'Crafted with premium virgin cotton, anti-microbial microfiber, and organic jute fibers engineered for long-lasting performance.',
      color: 'bg-emerald-500/10 text-[#257335]',
    },
    {
      icon: Sparkles,
      title: 'Modern & Traditional Styles',
      description: 'Contemporary Scandinavian neutrals to timeless Persian floral motifs designed to complement any interior.',
      color: 'bg-orange-500/10 text-[#E87244]',
    },
    {
      icon: Feather,
      title: 'Comfort & Functionality',
      description: 'High-density memory foam cushioning, high-absorbency piles, and TPR anti-skid rubber backings for zero slips.',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      icon: ShieldCheck,
      title: 'Safe & Secure Shopping',
      description: 'End-to-end encrypted payments, verified delivery tracking, and a 7-day hassle-free doorstep replacement guarantee.',
      color: 'bg-amber-500/10 text-amber-600',
    },
    {
      icon: Layers,
      title: 'Wide Range of Collections',
      description: 'From compact 40x60cm bath mats to grand 5x7ft living room rugs, find exact sizes for every doorway, hallway and room.',
      color: 'bg-teal-500/10 text-teal-600',
    },
  ];

  return (
    <section className="py-8 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-emerald-50 rounded-full text-[#257335] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>The Mansha Texo Difference</span>
          </div>
          <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            Why Choose Mansha Texo?
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Every thread we weave is an uncompromising promise of luxury, durability, and Indian artisanal craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          {points.map((point, index) => {
            const Icon = point.icon;
            const isLastOdd = index === points.length - 1 && points.length % 2 !== 0;
            return (
              <div
                key={index}
                className={`p-3.5 sm:p-6 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group ${
                  isLastOdd ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${point.color} flex items-center justify-center mb-2.5 sm:mb-4 transition-transform group-hover:scale-110`}>
                  <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">{point.title}</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed line-clamp-2 sm:line-clamp-none">{point.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
