import React, { useState } from 'react';
import { 
  Package, 
  Heart, 
  MapPin, 
  User as UserIcon, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Trash2, 
  ShoppingBag, 
  Save, 
  Plus,
  ShieldCheck
} from 'lucide-react';
import { Order, Product, User } from '../../../types';
import { formatDate, formatUZS } from '../../../utils/formatters';

interface ProfilePageProps {
  user: User;
  orders: Order[];
  products: Product[];
  onUpdateUser: (updated: Partial<User>) => void;
  onNavigate: (page: string, params?: { id?: string; categoryId?: string; search?: string }) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  orders,
  products,
  onUpdateUser,
  onNavigate,
  onAddToCart,
  onToggleWishlist,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'settings'>('orders');

  // Edit profile state
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [city, setCity] = useState(user.city);
  const [newAddressInput, setNewAddressInput] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const wishlistedProducts = products.filter(p => user.wishlist.includes(p.id));

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updates = { fullName, phone, email, city };
    onUpdateUser(updates);

    try {
      await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      setSaveMessage('Profil muvaffaqiyatli yangilandi!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAddress = () => {
    if (!newAddressInput.trim()) return;
    const updated = [...user.savedAddresses, newAddressInput.trim()];
    onUpdateUser({ savedAddresses: updated });
    setNewAddressInput('');
  };

  const handleRemoveAddress = (index: number) => {
    const updated = user.savedAddresses.filter((_, i) => i !== index);
    onUpdateUser({ savedAddresses: updated });
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'yetkazildi':
        return (
          <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Yetkazib berildi
          </span>
        );
      case 'yetkazilmoqda':
        return (
          <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-bold">
            <Truck className="w-3.5 h-3.5" /> Kuryer yetkazmoqda
          </span>
        );
      case 'qabul_qilindi':
        return (
          <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold">
            <Clock className="w-3.5 h-3.5" /> Qabul qilindi
          </span>
        );
      case 'yangi':
      default:
        return (
          <span className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full text-xs font-bold">
            <Clock className="w-3.5 h-3.5" /> Yangi buyurtma
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Profile Header Hero */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900">{user.fullName}</h1>
            <p className="text-xs text-neutral-500">{user.phone} • {user.email}</p>
            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                Doimiy xaridor (VIP)
              </span>
              <span className="text-[11px] text-neutral-400">
                {orders.length} ta xarid
              </span>
            </div>
          </div>
        </div>

        {/* Quick info stat */}
        <div className="flex items-center gap-3">
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-3 text-center min-w-24 sm:min-w-28">
            <div className="text-xs text-neutral-500 font-medium">Saralanganlar</div>
            <div className="text-lg font-black text-neutral-900">{user.wishlist.length} ta</div>
          </div>
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-3 text-center min-w-24 sm:min-w-28">
            <div className="text-xs text-neutral-500 font-medium">Buyurtmalar</div>
            <div className="text-lg font-black text-indigo-600">{orders.length} ta</div>
          </div>
          <button
            onClick={() => onNavigate('admin')}
            className="flex flex-col items-center justify-center bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl p-3 min-w-24 sm:min-w-28 text-center transition shadow-sm"
            title="Do'kon boshqaruv paneliga o'tish"
          >
            <ShieldCheck className="w-5 h-5 text-indigo-400 mb-0.5" />
            <span className="text-[11px] font-bold">Admin Panel</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'bg-white text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Mening buyurtmalarim ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'wishlist'
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'bg-white text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500" />
          <span>Saralanganlar ({user.wishlist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'addresses'
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'bg-white text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Yetkazish manzillari ({user.savedAddresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'bg-white text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Sozlamalar</span>
        </button>
      </div>

      {/* Tab 1: Orders History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-neutral-200 p-5 sm:p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-neutral-900">#{order.id}</span>
                    <span className="text-xs text-neutral-400">•</span>
                    <span className="text-xs text-neutral-500">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <span className="text-xs font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                      {order.trackingNumber}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="divide-y divide-neutral-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-12 h-12 rounded-xl object-contain bg-neutral-50 border border-neutral-100 p-1"
                        />
                        <div>
                          <div className="text-xs font-bold text-neutral-900 line-clamp-1">{item.productName}</div>
                          <div className="text-[11px] text-neutral-400">{item.quantity} dona × {formatUZS(item.price)}</div>
                        </div>
                      </div>
                      <div className="text-xs font-black text-neutral-900">
                        {formatUZS(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-neutral-100 text-xs text-neutral-500 gap-2">
                  <div>
                    Manzil: <strong className="text-neutral-800">{order.shippingAddress.address}, {order.shippingAddress.city}</strong>
                  </div>
                  <div className="text-sm font-black text-neutral-950">
                    Jami: <span className="text-indigo-600 font-black">{formatUZS(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl border border-neutral-200 p-10 text-center space-y-3">
              <Package className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="font-bold text-neutral-800">Sizda hali buyurtmalar yo'q</h3>
              <p className="text-xs text-neutral-500">Katalogdan yoqqan mahsulotlarni tanlang va birinchi buyurtmani bering.</p>
              <button
                onClick={() => onNavigate('catalog')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Katalogga o'tish
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistedProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-neutral-200 p-4 flex gap-4 items-center justify-between"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-contain bg-neutral-50 rounded-xl p-1 border border-neutral-100 cursor-pointer"
                    onClick={() => onNavigate('product', { id: product.id })}
                  />
                  <div className="flex-1 min-w-0">
                    <h4
                      onClick={() => onNavigate('product', { id: product.id })}
                      className="text-xs font-bold text-neutral-900 truncate cursor-pointer hover:text-indigo-600"
                    >
                      {product.name}
                    </h4>
                    <div className="text-xs font-black text-indigo-600 mt-1">
                      {formatUZS(product.price)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={(e) => onAddToCart(product, e)}
                      className="p-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl transition"
                      title="Savatga qo'shish"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => onToggleWishlist(product.id, e)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                      title="Saralanganlardan o'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-neutral-200 p-10 text-center space-y-3">
              <Heart className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="font-bold text-neutral-800">Saralangan mahsulotlar ro'yxati bo'sh</h3>
              <p className="text-xs text-neutral-500">Mahsulot kartalaridagi yurakcha belgisini bosib sevimli narsalaringizni saqlang.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Addresses */}
      {activeTab === 'addresses' && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 space-y-6">
          <h3 className="font-extrabold text-base text-neutral-900">Saqlangan yetkazish manzillari</h3>

          <div className="space-y-3">
            {user.savedAddresses.map((addr, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-neutral-200 flex items-center justify-between gap-4 bg-neutral-50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-neutral-800">{addr}</span>
                </div>
                <button
                  onClick={() => handleRemoveAddress(idx)}
                  className="text-neutral-400 hover:text-rose-500 p-1.5 transition"
                  title="O'chirish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new address */}
          <div className="pt-4 border-t border-neutral-100 flex gap-2">
            <input
              type="text"
              placeholder="Yangi manzil (masalan: Toshkent sh., Chilonzor tumani...)"
              value={newAddressInput}
              onChange={(e) => setNewAddressInput(e.target.value)}
              className="flex-1 text-xs p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleAddAddress}
              className="px-4 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-neutral-800 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Qo'shish</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Profile Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 space-y-6 max-w-2xl">
          <h3 className="font-extrabold text-base text-neutral-900">Shaxsiy ma'lumotlarni tahrirlash</h3>

          {saveMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{saveMessage}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">To'liq ism (F.I.SH):</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">Telefon raqam:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">Email manzili:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">Shahar / Viloyat:</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition"
            >
              <Save className="w-4 h-4" />
              <span>O'zgarishlarni saqlash</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
