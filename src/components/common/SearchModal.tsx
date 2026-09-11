import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, X, TrendingUp, ArrowRight, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SearchModalProps {
  onNavigate: (path: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onNavigate }) => {
  const { isSearchOpen, setIsSearchOpen, products, categories } = useStore();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Cotton Bath Mat',
    'Living Room Carpet',
    'Jute Rug',
    'Anti-Fatigue Mat',
    'Door Mat',
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Keyboard shortcut cmd+k / ctrl+k
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.material.toLowerCase().includes(q)
        );
      })
    : [];

  const handleSelectProduct = (slug: string) => {
    if (query.trim()) {
      setRecentSearches((prev) => [query.trim(), ...prev.filter((s) => s !== query.trim())].slice(0, 6));
    }
    setIsSearchOpen(false);
    onNavigate(`/product/${slug}`);
  };

  const handleSelectCategory = (slug: string) => {
    setIsSearchOpen(false);
    onNavigate(`/category/${slug}`);
  };

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setRecentSearches((prev) => [query.trim(), ...prev.filter((s) => s !== query.trim())].slice(0, 6));
    setIsSearchOpen(false);
    onNavigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        {/* Search Input Bar */}
        <form onSubmit={handleSubmitSearch} className="relative flex items-center border-b border-gray-100 px-4 py-3.5">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mats, carpets, rugs, fabrics by name, color, or material..."
            className="w-full text-base text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="px-2.5 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            ESC
          </button>
        </form>

        {/* Search Content */}
        <div className="max-h-[60vh] overflow-y-auto p-5">
          {query.trim() ? (
            <div>
              <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                <span>Products ({filteredProducts.length})</span>
                {filteredProducts.length > 0 && (
                  <button
                    onClick={handleSubmitSearch}
                    className="text-[#257335] hover:underline flex items-center gap-1 normal-case font-semibold"
                  >
                    View all results <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {filteredProducts.length > 0 ? (
                <div className="space-y-2">
                  {filteredProducts.slice(0, 6).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product.slug)}
                      className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-emerald-50/60 transition-colors cursor-pointer group"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-[#257335] uppercase tracking-wider">
                            {product.categoryName}
                          </span>
                          {product.badge && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-[#E87244] text-white font-bold rounded">
                              {product.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#257335] transition-colors">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                          <span className="text-[11px] text-gray-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] font-bold text-[#E87244]">{product.discountPercentage}% OFF</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#257335] group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm font-medium text-gray-800">No matching products found for "{query}"</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Try searching for "bath mat", "carpet", "cotton", or "jute".
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Popular Category Chips */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#257335]" /> Browse Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.slug)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-emerald-50 hover:text-[#257335] text-xs font-medium text-gray-700 rounded-full transition-colors cursor-pointer"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent & Trending Searches */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#E87244]" /> Popular Searches
                </h4>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 bg-gray-50 hover:bg-orange-50 hover:text-[#E87244] text-xs text-gray-600 rounded-lg border border-gray-200/60 transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
