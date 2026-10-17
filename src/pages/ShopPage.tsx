import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import {
  SlidersHorizontal,
  Grid,
  List,
  Search,
  X,
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface ShopPageProps {
  onNavigate: (path: string) => void;
  initialCategory?: string;
  pageTitle?: string;
  filterType?: 'all' | 'new-arrivals' | 'best-sellers' | 'offers';
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onNavigate,
  initialCategory,
  pageTitle = 'Shop All Furnishings',
  filterType = 'all',
}) => {
  const { products, categories } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Extract unique materials, sizes, and colors from catalog
  const allMaterials = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.material) set.add(p.material);
    });
    return Array.from(set);
  }, [products]);

  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      p.sizes.forEach((s) => set.add(s));
    });
    return Array.from(set);
  }, [products]);

  const allColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      p.colors.forEach((c) => set.add(c));
    });
    return Array.from(set);
  }, [products]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Base type filtering
      if (filterType === 'new-arrivals' && !p.isNewArrival) return false;
      if (filterType === 'best-sellers' && !p.isBestSeller) return false;
      if (filterType === 'offers' && p.discountPercentage < 20) return false;

      // Category
      if (selectedCategory !== 'all') {
        const cat = categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory);
        if (cat && p.categoryId !== cat.id && p.categorySlug !== selectedCategory) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesTag = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesSku && !matchesTag) return false;
      }

      // Material
      if (selectedMaterial !== 'all' && p.material !== selectedMaterial) {
        return false;
      }

      // Size
      if (selectedSize !== 'all' && !p.sizes.includes(selectedSize)) {
        return false;
      }

      // Color
      if (selectedColor !== 'all' && !p.colors.includes(selectedColor)) {
        return false;
      }

      // Price Range
      if (p.price > maxPrice) {
        return false;
      }

      // Stock
      if (inStockOnly && p.stock <= 0) {
        return false;
      }

      return p.isActive;
    });
  }, [
    products,
    categories,
    filterType,
    selectedCategory,
    searchQuery,
    selectedMaterial,
    selectedSize,
    selectedColor,
    maxPrice,
    inStockOnly,
  ]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-low':
        return list.sort((a, b) => a.price - b.price);
      case 'price-high':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'discount':
        return list.sort((a, b) => b.discountPercentage - a.discountPercentage);
      case 'newest':
        return list.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'featured':
      default:
        return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedMaterial('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setMaxPrice(10000);
    setInStockOnly(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedMaterial !== 'all' ||
    selectedSize !== 'all' ||
    selectedColor !== 'all' ||
    maxPrice < 10000 ||
    inStockOnly ||
    searchQuery !== '';

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Breadcrumb & Header */}
        <div className="mb-8">
          <nav className="text-xs text-gray-500 mb-2">
            <button onClick={() => onNavigate('/')} className="hover:text-[#257335]">
              Home
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-semibold">{pageTitle}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
                {pageTitle}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Showing {sortedProducts.length} premium textile floor furnishings
              </p>
            </div>

            {/* View controls & Sorting */}
            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-sm cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#257335]" />
                <span>Filters {hasActiveFilters && '•'}</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-xs font-semibold text-gray-800 shadow-sm focus:outline-none focus:border-[#257335] cursor-pointer"
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Layout Switcher */}
              <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-xl p-0.5 shadow-sm">
                <button
                  onClick={() => setLayout('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    layout === 'grid'
                      ? 'bg-emerald-50 text-[#257335]'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                  aria-label="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLayout('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    layout === 'list'
                      ? 'bg-emerald-50 text-[#257335]'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                  aria-label="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick-Filter Horizontal Chips Bar on Mobile */}
          <div className="lg:hidden flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5 -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex-shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-[#257335] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              All Items ({products.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex-shrink-0 ${
                  selectedCategory === c.slug
                    ? 'bg-[#257335] text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-700'
                }`}
              >
                {c.name}
              </button>
            ))}
            <button
              onClick={() => setMaxPrice(maxPrice === 999 ? 10000 : 999)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex-shrink-0 ${
                maxPrice === 999
                  ? 'bg-[#E87244] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              Under ₹999 {maxPrice === 999 && '✓'}
            </button>
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex-shrink-0 ${
                inStockOnly
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              In Stock Only {inStockOnly && '✓'}
            </button>
          </div>
        </div>

        {/* Main Content Layout (Sidebar Filters + Products Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#257335]" /> Filters
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-[#E87244] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>

              {/* Keyword Search within catalog */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Search Catalog
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search keywords..."
                    className="w-full px-3 py-2 pl-8 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Category
                </label>
                <div className="space-y-1.5 text-xs">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-between ${
                      selectedCategory === 'all'
                        ? 'bg-emerald-50 text-[#257335] font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>All Products</span>
                    <span>{products.length}</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-between ${
                        selectedCategory === cat.slug
                          ? 'bg-emerald-50 text-[#257335] font-bold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-gray-400 text-[11px]">{cat.itemCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Max Price
                  </label>
                  <span className="text-xs font-extrabold text-[#257335]">
                    ₹{maxPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="10000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#257335] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>₹300</span>
                  <span>₹10,000+</span>
                </div>
              </div>

              {/* Material Filter */}
              {allMaterials.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Fabric / Material
                  </label>
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                  >
                    <option value="all">All Materials</option>
                    {allMaterials.map((mat) => (
                      <option key={mat} value={mat}>
                        {mat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Size Filter */}
              {allSizes.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Dimensions / Size
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setSelectedSize('all')}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                        selectedSize === 'all'
                          ? 'bg-[#257335] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All
                    </button>
                    {allSizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-[#257335] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Filter */}
              {allColors.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Color Palette
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setSelectedColor('all')}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                        selectedColor === 'all'
                          ? 'bg-[#257335] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All Colors
                    </button>
                    {allColors.map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                          selectedColor === col
                            ? 'bg-[#257335] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status Filter */}
              <div className="pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-[#257335] focus:ring-[#257335] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-gray-700">
                    In Stock Items Only
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid / List Display */}
          <main className="lg:col-span-3">
            {sortedProducts.length > 0 ? (
              <div
                className={
                  layout === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6'
                    : 'space-y-3 sm:space-y-4'
                }
              >
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onNavigate={onNavigate}
                    layout={layout}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto text-[#E87244] mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No products match your criteria</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                  Try adjusting your price filter, search terms, or clearing active filters to view our full collection.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 px-6 py-2.5 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Bottom Sheet */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[85vh] shadow-2xl flex flex-col justify-between overflow-hidden animate-slideUp">
            {/* Grab handle */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-2.5" />

            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">Filters</h3>
                <p className="text-[11px] text-gray-500">Refine by category, price & availability</p>
              </div>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`text-left px-3 py-2 rounded-xl border transition-colors cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'border-[#257335] bg-emerald-50 text-[#257335] font-bold'
                        : 'border-gray-200 text-gray-700 bg-white'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`text-left px-3 py-2 rounded-xl border transition-colors cursor-pointer truncate ${
                        selectedCategory === c.slug
                          ? 'border-[#257335] bg-emerald-50 text-[#257335] font-bold'
                          : 'border-gray-200 text-gray-700 bg-white'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                  <span>Max Price:</span>
                  <span className="text-[#257335]">₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="10000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#257335] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>₹300</span>
                  <span>₹10,000+</span>
                </div>
              </div>

              {/* Stock */}
              <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#257335] w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-semibold text-gray-800">Only In Stock Items</span>
              </label>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2.5 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-3 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 py-3 bg-[#257335] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                Apply Filters ({sortedProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
