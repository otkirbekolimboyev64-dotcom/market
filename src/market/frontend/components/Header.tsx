import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User as UserIcon, 
  LayoutGrid, 
  ShieldCheck, 
  Phone, 
  Truck, 
  Layers,
  ChevronRight,
  X
} from 'lucide-react';
import { Category, Product, User } from '../../../types';
import { formatUZS } from '../../../utils/formatters';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activePage: string;
  onNavigate: (page: string, params?: { id?: string; categoryId?: string; search?: string }) => void;
  categories: Category[];
  cartCount: number;
  cartTotal: number;
  user: User;
  allProducts: Product[];
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  categories,
  cartCount,
  cartTotal,
  user,
  allProducts,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCatalogMenuOpen, setIsCatalogMenuOpen] = useState(false);

  const searchResults = searchQuery.trim()
    ? allProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      onNavigate('catalog', { search: searchQuery.trim() });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo */}
        <button
          id="header-brand-logo"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 group text-left focus:outline-none"
        >
          <img
            src="/icon.png"
            alt="ProMarket"
            className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
          />
          <div className="hidden sm:block">
            <div className="text-xl font-extrabold tracking-tight text-neutral-900 leading-tight flex items-center gap-1.5">
              PROMARKET
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                Online
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-medium">Barcha ehtiyojlar uchun do'kon</p>
          </div>
        </button>

        {/* Catalog Button */}
        <div className="relative">
          <button
            id="catalog-toggle-btn"
            onClick={() => setIsCatalogMenuOpen(!isCatalogMenuOpen)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              isCatalogMenuOpen || activePage === 'catalog'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Katalog</span>
          </button>

          {/* Catalog Mega Dropdown */}
          {isCatalogMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-neutral-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2 border-b border-neutral-100 text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center justify-between">
                <span>Bo'limlar katalogi</span>
                <button 
                  onClick={() => setIsCatalogMenuOpen(false)}
                  className="p-1 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="py-1 max-h-80 overflow-y-auto">
                <button
                  onClick={() => {
                    setIsCatalogMenuOpen(false);
                    onNavigate('catalog', { categoryId: 'all' });
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-100 text-neutral-800 transition"
                >
                  <span>Barcha mahsulotlar</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setIsCatalogMenuOpen(false);
                      onNavigate('catalog', { categoryId: cat.id });
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50 hover:text-indigo-700 text-neutral-700 transition"
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {cat.itemCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Search Bar */}
        <div className="flex-1 max-w-xl relative">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              id="header-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Mahsulotlar va turkumlardan qidirish (masalan: iPhone, noutbuk, kitob)..."
              className="w-full bg-neutral-100 hover:bg-neutral-100/80 focus:bg-white text-sm text-neutral-900 pl-4 pr-11 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-10 text-neutral-400 hover:text-neutral-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
            <button
              type="submit"
              className="absolute right-2 text-neutral-500 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 transition"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Search Suggestions Dropdown */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-neutral-200 p-2 z-50">
              <div className="text-xs font-medium text-neutral-500 px-3 py-1.5 border-b border-neutral-100 flex justify-between items-center">
                <span>Topilgan natijalar</span>
                <span className="text-[11px] text-neutral-400">"{searchQuery}" bo'yicha</span>
              </div>
              {searchResults.length > 0 ? (
                <div className="py-1">
                  {searchResults.map(item => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        onNavigate('product', { id: item.id });
                      }}
                      className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-xl cursor-pointer transition"
                    >
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-neutral-100 border border-neutral-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-neutral-900 truncate">{item.name}</p>
                        <p className="text-xs font-bold text-indigo-600">{formatUZS(item.price)}</p>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      onNavigate('catalog', { search: searchQuery.trim() });
                    }}
                    className="w-full mt-1 text-center py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                  >
                    Barcha natijalarni ko'rish →
                  </button>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-neutral-500">
                  Ushbu so'rov bo'yicha mahsulot topilmadi
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton variant="header" />

          {/* Wishlist */}
          <button
            onClick={() => onNavigate('profile')}
            className="p-2.5 rounded-xl hover:bg-neutral-100 text-neutral-700 relative transition"
            title="Saralanganlar (Wishlist)"
          >
            <Heart className={`w-5 h-5 ${user.wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
            {user.wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {user.wishlist.length}
              </span>
            )}
          </button>

          {/* Cart button */}
          <button
            id="header-cart-btn"
            onClick={() => onNavigate('cart')}
            className={`flex items-center gap-2.5 px-3 sm:px-3.5 py-2 rounded-xl transition-all font-semibold text-sm ${
              activePage === 'cart'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
            }`}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-indigo-600" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full w-4 h-4 text-[10px] font-extrabold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-[10px] text-neutral-500 font-medium leading-none">Savat</div>
              <div className="text-xs font-bold leading-tight">{cartTotal > 0 ? formatUZS(cartTotal) : "0 so'm"}</div>
            </div>
          </button>

          {/* Profile button */}
          <button
            id="header-profile-btn"
            onClick={() => onNavigate('profile')}
            className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl transition font-semibold text-sm ${
              activePage === 'profile'
                ? 'bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500'
                : 'hover:bg-neutral-100 text-neutral-700'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              <UserIcon className="w-4 h-4" />
            </div>
            <span className="hidden md:inline text-xs font-semibold">
              {user.fullName.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
