import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Clock, 
  RotateCcw,
  Tag
} from 'lucide-react';
import { Category, Product } from '../../../types';
import { CategoryList } from '../components/CategoryList';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  categories: Category[];
  products: Product[];
  onNavigate: (page: string, params?: { id?: string; categoryId?: string; search?: string }) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  wishlist: string[];
  cartProductIds: string[];
}

export const HomePage: React.FC<HomePageProps> = ({
  categories,
  products,
  onNavigate,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  cartProductIds,
}) => {
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const deals = products.filter(p => p.isDealOfTheDay || (p.discountPercent && p.discountPercent > 10));
  const popular = products.filter(p => p.isPopular);

  const banners = [
    {
      id: 1,
      title: "Yangi iPhone 15 Pro Max",
      subtitle: "Titan korpus va A17 Pro qudrati. Rasmiy kafolat bilan hoziroq buyurtma qiling.",
      badge: "Katta Chegirma",
      bgGradient: "from-neutral-900 via-indigo-950 to-slate-900",
      textColor: "text-white",
      buttonText: "Batafsil ko'rish",
      productId: 'prod-1',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      title: "Zamonaviy Gadjetlar va Texnika",
      subtitle: "Barcha texnikalarga 12 oygacha 0% boshlang'ich to'lovsiz muddatli to'lov.",
      badge: "0% Muddatli to'lov",
      bgGradient: "from-indigo-900 via-violet-900 to-purple-900",
      textColor: "text-white",
      buttonText: "Katalogga o'tish",
      targetCategory: 'cat-1',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white shadow-xl">
        <div className={`p-6 sm:p-10 lg:p-12 bg-gradient-to-r ${banners[activeBannerIndex].bgGradient} transition-all duration-700`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{banners[activeBannerIndex].badge}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                {banners[activeBannerIndex].title}
              </h1>
              <p className="text-neutral-300 text-sm sm:text-base max-w-lg leading-relaxed">
                {banners[activeBannerIndex].subtitle}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    const b = banners[activeBannerIndex];
                    if (b.productId) {
                      onNavigate('product', { id: b.productId });
                    } else if (b.targetCategory) {
                      onNavigate('catalog', { categoryId: b.targetCategory });
                    } else {
                      onNavigate('catalog');
                    }
                  }}
                  className="px-6 py-3 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 font-bold text-sm shadow-lg flex items-center gap-2 transition hover:scale-105 active:scale-95"
                >
                  <span>{banners[activeBannerIndex].buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm backdrop-blur transition"
                >
                  Barcha takliflar
                </button>
              </div>
            </div>

            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur flex items-center justify-center p-4">
                <img
                  src={banners[activeBannerIndex].image}
                  alt={banners[activeBannerIndex].title}
                  className="w-full h-full object-contain rounded-xl drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Carousel indicators */}
        <div className="absolute bottom-4 left-6 flex items-center gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveBannerIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === activeBannerIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Trust & Service Highlights */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">Tezkor yetkazish</h4>
            <p className="text-[11px] text-neutral-500">1 kunda butun O'zbekiston bo'ylab</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">100% Kafolat</h4>
            <p className="text-[11px] text-neutral-500">Faqat original mahsulotlar</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">0% Muddatli to'lov</h4>
            <p className="text-[11px] text-neutral-500">Ortiqcha to'lovlarsiz xarid</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">Oson qaytarish</h4>
            <p className="text-[11px] text-neutral-500">10 kun ichida bepul qaytarish</p>
          </div>
        </div>
      </section>

      {/* Category List Bar */}
      <section className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-sm">
        <CategoryList
          categories={categories}
          onSelectCategory={(catId) => onNavigate('catalog', { categoryId: catId })}
        />
      </section>

      {/* Flash Deals / Kun Taklifi */}
      {deals.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
                  <span>Kunning eng yaxshi takliflari</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                    Faqat bugun
                  </span>
                </h3>
                <p className="text-xs text-neutral-500">Maxsus chegirmali narxlarda cheklangan miqdorda</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('catalog')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Hammasini ko'rish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {deals.map(product => (
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
        </section>
      )}

      {/* Popular Products */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight">
              Ommabop mahsulotlar
            </h3>
            <p className="text-xs text-neutral-500">Xaridorlar tomonidan eng ko'p tanlangan mahsulotlar</p>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>Katalogga o'tish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {popular.map(product => (
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
      </section>

      {/* Special Promo callout */}
      <section className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
            Maxsus Taklif
          </span>
          <h3 className="text-xl sm:text-2xl font-black">
            Ilovamizda birinchi xaridingiz uchun 50 000 so'm chegirma!
          </h3>
          <p className="text-indigo-100 text-xs sm:text-sm">
            Promokod: <span className="font-mono font-black bg-white/20 px-2 py-0.5 rounded text-white">MARKET50</span> to'lov paytida kiriting.
          </p>
        </div>
        <button
          onClick={() => onNavigate('catalog')}
          className="px-6 py-3 rounded-xl bg-white text-indigo-900 font-extrabold text-sm shadow-md hover:bg-indigo-50 transition flex-shrink-0"
        >
          Xaridni boshlash
        </button>
      </section>
    </div>
  );
};
