import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Flame, Percent } from 'lucide-react';

interface MobileCategoryStoriesProps {
  onNavigate: (path: string) => void;
  activeCategory?: string;
}

export const MobileCategoryStories: React.FC<MobileCategoryStoriesProps> = ({
  onNavigate,
  activeCategory,
}) => {
  const { categories } = useStore();

  const specialItems = [
    {
      id: 'offers',
      name: 'Deals & Offers',
      shortName: 'Offers',
      path: '/offers',
      isSpecial: true,
      badge: '20% Off',
      icon: Percent,
      gradient: 'from-amber-500 to-[#E87244]',
    },
    {
      id: 'bestsellers',
      name: 'Best Sellers',
      shortName: 'Top Hits',
      path: '/best-sellers',
      isSpecial: true,
      badge: 'Hot',
      icon: Flame,
      gradient: 'from-[#E87244] to-red-500',
    },
    {
      id: 'new',
      name: 'New Arrivals',
      shortName: 'Fresh',
      path: '/new-arrivals',
      isSpecial: true,
      badge: 'New',
      icon: Sparkles,
      gradient: 'from-emerald-500 to-[#257335]',
    },
  ];

  return (
    <div className="lg:hidden w-full bg-white border-b border-gray-100 py-2.5">
      <div className="flex items-center gap-3.5 px-3 overflow-x-auto no-scrollbar scroll-smooth">
        {/* Special Deal Stories */}
        {specialItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.path)}
              className="flex flex-col items-center flex-shrink-0 group cursor-pointer focus:outline-none"
            >
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-orange-400 via-rose-500 to-emerald-500">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-xs p-1`}>
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                {item.badge && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-black text-white text-[8px] font-extrabold uppercase rounded-full shadow-xs whitespace-nowrap">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-semibold text-gray-800 mt-1.5 text-center truncate max-w-[62px]">
                {item.shortName}
              </span>
            </button>
          );
        })}

        {/* Regular Categories with Real Images */}
        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => onNavigate(`/category/${cat.slug}`)}
              className="flex flex-col items-center flex-shrink-0 group cursor-pointer focus:outline-none"
            >
              <div
                className={`p-0.5 rounded-full transition-all ${
                  isActive
                    ? 'ring-2 ring-[#257335] bg-emerald-100'
                    : 'bg-gradient-to-tr from-[#257335]/40 to-[#E87244]/40 hover:from-[#257335] hover:to-[#E87244]'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-14 h-14 rounded-full object-cover bg-gray-100 p-0.5"
                />
              </div>
              <span className="text-[11px] font-semibold text-gray-800 mt-1.5 text-center truncate max-w-[64px]">
                {cat.name.replace(/ Mats| and Rugs/gi, '')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
