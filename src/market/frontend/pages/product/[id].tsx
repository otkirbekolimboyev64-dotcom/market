import React, { useState } from 'react';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Plus, 
  Minus, 
  Check, 
  ChevronRight,
  Share2,
  Zap,
  Info
} from 'lucide-react';
import { Product } from '../../../../types';
import { formatUZS } from '../../../../utils/formatters';
import { ProductCard } from '../../components/ProductCard';

interface ProductDetailPageProps {
  productId: string;
  products: Product[];
  onNavigate: (page: string, params?: { id?: string; categoryId?: string; search?: string }) => void;
  onAddToCart: (product: Product, e: React.MouseEvent, quantity?: number) => void;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  onQuickBuy: (product: Product, quantity: number) => void;
  wishlist: string[];
  cartProductIds: string[];
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  products,
  onNavigate,
  onAddToCart,
  onToggleWishlist,
  onQuickBuy,
  wishlist,
  cartProductIds
}) => {
  const product = products.find(p => p.id === productId) || products[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!product) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200">
        <h2 className="text-xl font-bold text-neutral-800">Mahsulot topilmadi</h2>
        <button
          onClick={() => onNavigate('catalog')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Katalogga qaytish
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const isInCart = cartProductIds.includes(product.id);

  const relatedProducts = products
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumbs */}
      <nav className="text-xs text-neutral-500 flex items-center gap-1.5 flex-wrap">
        <button onClick={() => onNavigate('home')} className="hover:text-indigo-600">Bosh sahifa</button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <button onClick={() => onNavigate('catalog')} className="hover:text-indigo-600">Katalog</button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <button 
          onClick={() => onNavigate('catalog', { categoryId: product.categoryId })} 
          className="hover:text-indigo-600"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-neutral-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-5 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm">
        {/* Left: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl bg-neutral-50 p-6 flex items-center justify-center border border-neutral-100 overflow-hidden group">
            {product.discountPercent && (
              <span className="absolute top-4 left-4 z-10 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-md">
                -{product.discountPercent}% CHEGIRMA
              </span>
            )}
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl p-1.5 bg-neutral-50 border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-indigo-600 shadow-sm'
                      : 'border-transparent hover:border-neutral-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Buying box */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Top metadata */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">
                  {product.brand}
                </span>
                <span className="text-xs text-neutral-400">•</span>
                <span className="text-xs text-neutral-500">{product.category}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 transition relative"
                  title="Havolani ulashish"
                >
                  <Share2 className="w-4 h-4" />
                  {copiedLink && (
                    <span className="absolute -top-7 right-0 bg-neutral-900 text-white text-[10px] px-2 py-0.5 rounded shadow">
                      Nusxalandi!
                    </span>
                  )}
                </button>
                <button
                  onClick={(e) => onToggleWishlist(product.id, e)}
                  className={`p-2 rounded-xl border transition ${
                    isWishlisted 
                      ? 'bg-rose-50 border-rose-200 text-rose-600' 
                      : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                  }`}
                  title="Saralanganlarga qo'shish"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating and review stats */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-1 rounded-lg border border-amber-200 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </div>
              <span className="text-neutral-500 underline cursor-pointer" onClick={() => setActiveTab('reviews')}>
                {product.reviewsCount} ta mijoz sharhlari
              </span>
              <span className="text-neutral-300">|</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Omborda {product.stock} ta mavjud
              </span>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-neutral-950">
                  {formatUZS(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-sm sm:text-base text-neutral-400 line-through">
                    {formatUZS(product.oldPrice)}
                  </span>
                )}
              </div>

              {/* Installment pill */}
              {product.monthlyInstallment && (
                <div className="flex items-center justify-between bg-amber-100/70 border border-amber-300 text-amber-950 p-2.5 rounded-xl text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>Muddatli to'lov: <strong>oyiga {formatUZS(product.monthlyInstallment)}</strong></span>
                  </div>
                  <span className="text-[11px] text-amber-800">12 oyga 0%</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-bold text-neutral-700">Miqdor:</span>
              <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 rounded-lg hover:bg-white text-neutral-600 transition"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-1.5 rounded-lg hover:bg-white text-neutral-600 transition"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-neutral-500 font-medium">
                Jami: <strong className="text-neutral-900">{formatUZS(product.price * quantity)}</strong>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                id="add-to-cart-detail-btn"
                onClick={(e) => onAddToCart(product, e, quantity)}
                className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition ${
                  isInCart
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isInCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Savatga yana qo'shish</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Savatga qo'shish</span>
                  </>
                )}
              </button>

              <button
                id="quick-buy-btn"
                onClick={() => onQuickBuy(product, quantity)}
                className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-neutral-900 hover:bg-neutral-800 text-white transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Bir klikda xarid qilish</span>
              </button>
            </div>
          </div>

          {/* Delivery & guarantees */}
          <div className="border-t border-neutral-100 pt-4 space-y-2.5 text-xs text-neutral-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span><strong>Bepul tezkor yetkazib berish:</strong> Ertaga topshirish punktiga yetkaziladi.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span><strong>Kafolat:</strong> 12 oy davomida rasmiy servis markazi kafolati.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span><strong>10 kunlik qaytarish:</strong> Mahsulot ma'qul kelmasa osongina qaytarish mumkin.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specs, Reviews */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-4 border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 font-bold text-sm border-b-2 transition ${
              activeTab === 'desc'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Tavsif va Ma'lumot
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 font-bold text-sm border-b-2 transition ${
              activeTab === 'specs'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Xususiyatlari ({Object.keys(product.specs).length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 font-bold text-sm border-b-2 transition ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Mijozlar baholari ({product.reviewsCount})
          </button>
        </div>

        {/* Tab content */}
        <div>
          {activeTab === 'desc' && (
            <div className="space-y-4 max-w-3xl">
              <p className="text-sm text-neutral-700 leading-relaxed">
                {product.description}
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
                <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-900 leading-relaxed">
                  Har bir mahsulot sifat nazoratidan o'tgan bo'lib, original seriya raqami va plombalar bilan yetkazib beriladi. Qadoq buzilmagan taqdirda 10 kun ichida qaytarish imkoniyati mavjud.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl divide-y divide-neutral-100">
              {Object.entries(product.specs).map(([label, value], idx) => (
                <div key={idx} className="py-2.5 flex justify-between text-xs sm:text-sm">
                  <span className="text-neutral-500">{label}</span>
                  <span className="font-semibold text-neutral-900 text-right">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="text-center">
                  <div className="text-3xl font-black text-neutral-900">{product.rating}</div>
                  <div className="flex text-amber-400 justify-center my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="text-[10px] text-neutral-400">{product.reviewsCount} ta umumiy baho</div>
                </div>
                <div className="h-12 w-px bg-neutral-200" />
                <div className="flex-1 text-xs text-neutral-600">
                  Xaridorlarning 98% ushbu mahsulotni boshqalarga tavsiya etadi.
                </div>
              </div>

              {/* Sample verified reviews */}
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl border border-neutral-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-900">Jasur B.</span>
                    <span className="text-neutral-400 text-[11px]">2 kun oldin</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-700">
                    Juda zo'r mahsulot! Sifati a'lo darajada, yetkazib berish ham tez bo'ldi. Hammaga tavsiya qilaman!
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-neutral-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-900">Nodira K.</span>
                    <span className="text-neutral-400 text-[11px]">1 hafta oldin</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-700">
                    Original ekanligi bilinib turibdi. Narxi ham bozordan arzonroqqa tushdi. Rahmat Market jamoasiga!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight">
            O'xshash mahsulotlar
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={(id) => onNavigate('product', { id })}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlist.includes(p.id)}
                isInCart={cartProductIds.includes(p.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
