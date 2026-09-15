import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  X, 
  Search, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Category, Product } from '../../../types';
import { ProductCard } from '../components/ProductCard';
import { formatUZS } from '../../../utils/formatters';

interface CatalogPageProps {
  categories: Category[];
  products: Product[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
  onNavigate: (page: string, params?: { id?: string; categoryId?: string; search?: string }) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  wishlist: string[];
  cartProductIds: string[];
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  categories,
  products,
  selectedCategoryId,
  onSelectCategory,
  searchQuery = '',
  onClearSearch,
  onNavigate,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  cartProductIds
}) => {
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategoryId && selectedCategoryId !== 'all' && p.categoryId !== selectedCategoryId) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        if (!match) return false;
      }
      // Price filter
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;

      // Discounted
      if (onlyDiscounted && (!p.discountPercent || p.discountPercent <= 0)) return false;

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
        default:
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      }
    });
  }, [products, selectedCategoryId, searchQuery, minPrice, maxPrice, onlyDiscounted, sortBy]);

  const resetFilters = () => {
    onSelectCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setOnlyDiscounted(false);
    setSortBy('popular');
    if (onClearSearch) onClearSearch();
  };

  const activeCategory = categories.find(c => c.id === selectedCategoryId);

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb and Title bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-neutral-400 mb-1 flex items-center gap-1.5">
            <span className="cursor-pointer hover:text-indigo-600" onClick={() => onNavigate('home')}>Bosh sahifa</span>
            <span>/</span>
            <span className="text-indigo-600 font-bold">Katalog</span>
            {activeCategory && (
              <>
                <span>/</span>
                <span className="text-neutral-700">{activeCategory.name}</span>
              </>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            {activeCategory ? activeCategory.name : "Barcha mahsulotlar"}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Jami {filteredProducts.length} ta mahsulot topildi
          </p>
        </div>

        {/* Sort selector & Mobile filter trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold"
          >
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Filtrlar</span>
          </button>

          <div className="flex items-center gap-2 bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-neutral-500 hidden sm:inline">Saralash:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold text-neutral-800 focus:outline-none cursor-pointer"
            >
              <option value="popular">Ommabopligi bo'yicha</option>
              <option value="price_asc">Narx: arzondan qimmatga</option>
              <option value="price_desc">Narx: qimmatdan arzonga</option>
              <option value="rating">Reytingi yuqori</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search active notice */}
      {searchQuery && (
        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 text-indigo-900 px-4 py-2.5 rounded-xl text-xs font-medium">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-600" />
            <span>Qidiruv natijasi: <strong>"{searchQuery}"</strong></span>
          </div>
          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 underline"
            >
              Qidiruvni tozalash
            </button>
          )}
        </div>
      )}

      {/* Main layout: Sidebar filters + Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Filter Sidebar */}
        <aside className={`md:col-span-3 bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-6 ${
          isMobileFilterOpen ? 'block' : 'hidden md:block'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-600" />
              <span>Filtrlar</span>
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs text-neutral-400 hover:text-indigo-600 flex items-center gap-1 transition"
              title="Filtrlarni tozalash"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Tozalash</span>
            </button>
          </div>

          {/* Categories list filter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Kategoriyalar</h4>
            <div className="space-y-1">
              <button
                onClick={() => onSelectCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                  selectedCategoryId === 'all'
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span>Barchasi</span>
                <span className="text-[10px] text-neutral-400">{products.length}</span>
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                    selectedCategoryId === cat.id
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <span className="truncate pr-2">{cat.name}</span>
                  <span className="text-[10px] text-neutral-400">{cat.itemCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Narx (so'm)</h4>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">Dan</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">Gacha</label>
                <input
                  type="number"
                  placeholder="5 000 000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Special toggles */}
          <div className="pt-2 border-t border-neutral-100 space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-neutral-700 select-none">
              <input
                type="checkbox"
                checked={onlyDiscounted}
                onChange={(e) => setOnlyDiscounted(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-neutral-300"
              />
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                Faqat chegirmali mahsulotlar
              </span>
            </label>
          </div>
        </aside>

        {/* Product Cards Grid */}
        <main className="md:col-span-9">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(id) => onNavigate('product', { id })}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlist.includes(product.id)}
                  isInCart={cartProductIds.includes(product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-neutral-800">Hech qanday mahsulot topilmadi</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Qidiruv so'rovingizni yoki belgilangan filtrlarni o'zgartirib ko'ring
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition"
              >
                Barcha filtrlarni tozalash
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
