import React from 'react';
import { Star, Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../../types';
import { formatUZS } from '../../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  isWishlisted: boolean;
  isInCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  isInCart = false,
}) => {
  return (
    <div
      onClick={() => onSelect(product.id)}
      className="group relative bg-white rounded-2xl border border-neutral-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top Image area */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-50 p-4 flex items-center justify-center">
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          {product.discountPercent ? (
            <span className="bg-rose-500 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-lg shadow-sm">
              -{product.discountPercent}%
            </span>
          ) : null}
          {product.isDealOfTheDay && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
              Kun taklifi
            </span>
          )}
          {product.isNew && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
              Yangi
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => onToggleWishlist(product.id, e)}
          className="absolute top-2.5 right-2.5 z-10 p-2 rounded-xl bg-white/80 backdrop-blur hover:bg-white text-neutral-400 hover:text-rose-500 shadow-sm transition"
          title="Saralanganlarga saqlash"
        >
          <Heart
            className={`w-4 h-4 transition ${
              isWishlisted ? 'text-rose-500 fill-rose-500' : 'text-neutral-500'
            }`}
          />
        </button>

        {/* Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Product Information */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Rating and Reviews */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
            <div className="flex items-center text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
              <span>{product.rating}</span>
            </div>
            <span>•</span>
            <span className="text-[11px] text-neutral-400">{product.reviewsCount} ta baho</span>
          </div>

          {/* Title */}
          <h4 className="text-xs sm:text-sm font-semibold text-neutral-800 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h4>
        </div>

        <div>
          {/* Monthly installment badge */}
          {product.monthlyInstallment && (
            <div className="mb-2">
              <span className="inline-block bg-amber-50 text-amber-900 border border-amber-200/80 text-[11px] font-bold px-2 py-0.5 rounded-lg">
                {formatUZS(product.monthlyInstallment)} / oy
              </span>
            </div>
          )}

          {/* Price & Action row */}
          <div className="flex items-end justify-between gap-2 pt-1 border-t border-neutral-100">
            <div className="flex flex-col">
              {product.oldPrice && (
                <span className="text-[11px] text-neutral-400 line-through">
                  {formatUZS(product.oldPrice)}
                </span>
              )}
              <span className="text-sm sm:text-base font-extrabold text-neutral-950 tracking-tight">
                {formatUZS(product.price)}
              </span>
            </div>

            {/* Quick add to cart */}
            <button
              onClick={(e) => onAddToCart(product, e)}
              className={`p-2.5 rounded-xl font-bold transition-all flex items-center justify-center ${
                isInCart
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white shadow-sm'
              }`}
              title={isInCart ? 'Savatda mavjud' : 'Savatga qo\'shish'}
            >
              {isInCart ? (
                <Check className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <ShoppingBag className="w-4 h-4 stroke-[2]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
