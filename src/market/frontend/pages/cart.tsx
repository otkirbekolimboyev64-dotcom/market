import React, { useState } from 'react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Tag, 
  ShieldCheck, 
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CartItem, Order, PaymentMethod, User } from '../../../types';
import { formatUZS } from '../../../utils/formatters';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onNavigate: (page: string, params?: { id?: string; categoryId?: string; search?: string }) => void;
  onOrderCreated: (order: Order) => void;
  user: User;
}

export const CartPage: React.FC<CartPageProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigate,
  onOrderCreated,
  user
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  // Checkout Form State
  const [fullName, setFullName] = useState(user.fullName || '');
  const [phone, setPhone] = useState(user.phone || '+998 ');
  const [city, setCity] = useState(user.city || 'Toshkent shahri');
  const [address, setAddress] = useState(user.address || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('payme');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);

  // Math calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal > 300000 ? 0 : 25000;
  const promoDiscount = appliedPromo ? appliedPromo.discount : 0;
  const totalAmount = Math.max(0, subtotal - promoDiscount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();

    if (!code) return;

    if (code === 'MARKET50') {
      setAppliedPromo({ code, discount: 50000 });
      setPromoInput('');
    } else if (code === 'PROMO10') {
      const disc = Math.round(subtotal * 0.1);
      setAppliedPromo({ code, discount: disc });
      setPromoInput('');
    } else {
      setPromoError("Yaroqsiz promokod. MARKET50 yoki PROMO10 kodini sinab ko'ring.");
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      alert("Iltimos, ism, telefon va manzilni to'ldiring!");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.images[0],
          price: item.product.price,
          quantity: item.quantity
        })),
        totalAmount,
        discountAmount: promoDiscount,
        shippingFee,
        shippingAddress: {
          fullName,
          phone,
          city,
          address
        },
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
        status: 'yangi' as const
      };

      // Call API endpoint
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (data.success) {
        setOrderSuccess(data.data);
        onOrderCreated(data.data);
        onClearCart();
      } else {
        alert("Buyurtma yaratishda xatolik yuz berdi");
      }
    } catch (err) {
      console.error(err);
      alert("Aloqa xatosi yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Success Screen
  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-8 text-center space-y-6">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200 shadow-xl space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Buyurtma muvaffaqiyatli qabul qilindi
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900">
              Xaridingiz uchun rahmat!
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
              Sizning buyurtmangiz raqami: <strong className="text-indigo-600 font-mono text-base">{orderSuccess.id}</strong>.
              Tez orada kuryerimiz siz bilan bog'lanadi.
            </p>
          </div>

          {/* Tracking badge */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-500">Kuzatuv kodi (Tracking):</span>
              <span className="font-mono font-bold text-neutral-900">{orderSuccess.trackingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">To'lov holati:</span>
              <span className="font-bold text-emerald-600 uppercase">
                {orderSuccess.paymentStatus === 'paid' ? "To'langan" : "Kuryerga to'lanadi"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Yetkazish manzili:</span>
              <span className="font-medium text-neutral-900">{orderSuccess.shippingAddress.address}, {orderSuccess.shippingAddress.city}</span>
            </div>
            <div className="flex justify-between border-t border-neutral-200 pt-2 font-bold text-sm">
              <span>Jami to'lov:</span>
              <span className="text-indigo-600">{formatUZS(orderSuccess.totalAmount)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => onNavigate('profile')}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md"
            >
              Mening buyurtmalarimga o'tish
            </button>
            <button
              onClick={() => onNavigate('catalog')}
              className="px-6 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition"
            >
              Xaridni davom ettirish
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center max-w-lg mx-auto shadow-sm space-y-6 my-6">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-neutral-900">Savatingiz hozircha bo'sh</h2>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">
            Katalogimizdagi minglab ajoyib mahsulotlardan tanlang va xarid qilishni boshlang!
          </p>
        </div>
        <button
          onClick={() => onNavigate('catalog')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-100 inline-flex items-center gap-2"
        >
          <span>Katalogga o'tish</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
            <span>Savat</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              {cartItems.reduce((sum, i) => sum + i.quantity, 0)} ta mahsulot
            </span>
          </h1>
          <p className="text-xs text-neutral-500">Tanlangan mahsulotlarni ko'rib chiqing va buyurtma bering</p>
        </div>

        <button
          onClick={onClearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 p-2 rounded-lg hover:bg-rose-50 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Savatni tozalash</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Cart Items list */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm divide-y divide-neutral-100 overflow-hidden">
            {cartItems.map((item) => (
              <div key={item.product.id} className="p-4 sm:p-5 flex gap-4 items-center">
                {/* Image */}
                <div 
                  onClick={() => onNavigate('product', { id: item.product.id })}
                  className="w-20 h-20 sm:w-24 sm:h-24 bg-neutral-50 rounded-xl p-2 flex-shrink-0 cursor-pointer border border-neutral-100 flex items-center justify-center"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    {item.product.brand}
                  </span>
                  <h4 
                    onClick={() => onNavigate('product', { id: item.product.id })}
                    className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-indigo-600 cursor-pointer line-clamp-2 leading-snug"
                  >
                    {item.product.name}
                  </h4>
                  <div className="text-xs sm:text-sm font-extrabold text-neutral-950">
                    {formatUZS(item.product.price)}
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 p-1">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 rounded hover:bg-white text-neutral-600 transition"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 rounded hover:bg-white text-neutral-600 transition"
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-neutral-400 hover:text-rose-500 p-1 transition"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery perk info banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-900 text-xs">
            <Truck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <strong>300 000 so'mdan yuqori xaridlar uchun yetkazib berish mutlaqo bepul!</strong>
              <div className="text-[11px] text-emerald-700 mt-0.5">
                {subtotal >= 300000 
                  ? "Siz bepul yetkazib berish shartiga mos keldingiz!" 
                  : `Yana ${formatUZS(300000 - subtotal)} lik mahsulot qo'shing va yetkazish bepul bo'ladi.`}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Checkout Details & Summary */}
        <div className="lg:col-span-5 space-y-6">
          {/* Order Summary Card */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-5 sm:p-6 shadow-sm space-y-5">
            <h3 className="font-extrabold text-base text-neutral-900">Buyurtma xulosasi</h3>

            {/* Promo code form */}
            <div>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promokod (masalan: MARKET50)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500 uppercase font-mono"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition"
                >
                  Qo'llash
                </button>
              </form>
              {promoError && (
                <p className="text-[11px] text-rose-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {promoError}
                </p>
              )}
              {appliedPromo && (
                <div className="mt-2 flex items-center justify-between bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-medium border border-emerald-200">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <strong>{appliedPromo.code}</strong> faollashtirildi
                  </span>
                  <span className="font-bold">-{formatUZS(appliedPromo.discount)}</span>
                </div>
              )}
            </div>

            {/* Pricing breakdown */}
            <div className="space-y-2.5 text-xs sm:text-sm border-t border-neutral-100 pt-3">
              <div className="flex justify-between text-neutral-600">
                <span>Mahsulotlar qiymati:</span>
                <span className="font-semibold text-neutral-900">{formatUZS(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Yetkazib berish:</span>
                <span className={`font-semibold ${shippingFee === 0 ? 'text-emerald-600' : 'text-neutral-900'}`}>
                  {shippingFee === 0 ? "Bepul" : formatUZS(shippingFee)}
                </span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-emerald-600">
                  <span>Promokod chegirmasi:</span>
                  <span className="font-bold">-{formatUZS(appliedPromo.discount)}</span>
                </div>
              )}
              <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline">
                <span className="font-bold text-sm text-neutral-900">Jami to'lov miqdori:</span>
                <span className="text-xl font-black text-indigo-600">{formatUZS(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Info Form */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-5 sm:p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-neutral-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>Yetkazish ma'lumotlari</span>
            </h3>

            <form onSubmit={handleCheckoutSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">To'liq ismingiz (F.I.SH):</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Masalan: O'tkirbek Olimboyev"
                  className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Telefon raqamingiz:</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Shahar / Viloyat:</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Toshkent shahri">Toshkent shahri</option>
                    <option value="Samarqand">Samarqand</option>
                    <option value="Buxoro">Buxoro</option>
                    <option value="Farg'ona">Farg'ona</option>
                    <option value="Andijon">Andijon</option>
                    <option value="Namangan">Namangan</option>
                    <option value="Xorazm">Xorazm</option>
                    <option value="Qashqadaryo">Qashqadaryo</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Aniq manzil:</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ko'cha, uy, xonadon"
                    className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="font-bold text-neutral-700 block mb-1.5">To'lov turi:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('payme')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                      paymentMethod === 'payme'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                        : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-cyan-600" />
                    <span>Payme</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('click')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                      paymentMethod === 'click'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                        : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Click</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('uzumpay')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                      paymentMethod === 'uzumpay'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                        : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-violet-600" />
                    <span>Uzum Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                      paymentMethod === 'cash'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                        : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Naqd pul</span>
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                id="place-order-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting ? (
                  <span>Rasmiylashtirilmoqda...</span>
                ) : (
                  <>
                    <span>Buyurtmani tasdiqlash ({formatUZS(totalAmount)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
