import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  ArrowLeft, 
  Search, 
  X,
  TrendingUp,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { Product, Order, Category, OrderStatus } from '../../types';
import { formatUZS, formatDate } from '../../utils/formatters';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  categories: Category[];
  onAddProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  onUpdateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onBackToStore: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onBackToStore,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');
  const [productSearch, setProductSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]?.name || 'Smartfonlar va Gadjetlar');
  const [formPrice, setFormPrice] = useState('');
  const [formOldPrice, setFormOldPrice] = useState('');
  const [formStock, setFormStock] = useState('10');
  const [formBrand, setFormBrand] = useState('');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80');
  const [formDescription, setFormDescription] = useState('');

  // Math metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'yangi' || o.status === 'qabul_qilindi').length;

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory(categories[0]?.name || '');
    setFormPrice('');
    setFormOldPrice('');
    setFormStock('10');
    setFormBrand('');
    setFormImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80');
    setFormDescription('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(p.price.toString());
    setFormOldPrice(p.oldPrice ? p.oldPrice.toString() : '');
    setFormStock(p.stock.toString());
    setFormBrand(p.brand);
    setFormImage(p.images[0] || '');
    setFormDescription(p.description);
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) return;

    const matchedCat = categories.find(c => c.name === formCategory) || categories[0];
    const priceNum = Number(formPrice);
    const oldPriceNum = formOldPrice ? Number(formOldPrice) : undefined;
    const discount = oldPriceNum && oldPriceNum > priceNum 
      ? Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100) 
      : undefined;

    const payload = {
      name: formName.trim(),
      category: formCategory,
      categoryId: matchedCat?.id || 'cat-1',
      price: priceNum,
      oldPrice: oldPriceNum,
      discountPercent: discount,
      monthlyInstallment: Math.round(priceNum / 12),
      stock: Number(formStock) || 1,
      brand: formBrand.trim() || 'Market',
      images: [formImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
      description: formDescription.trim() || 'Sifatli va qulay mahsulot.',
      specs: { 'Holati': 'Yangi', 'Kafolat': '1 yil' },
      rating: editingProduct?.rating || 5.0,
      reviewsCount: editingProduct?.reviewsCount || 0
    };

    if (editingProduct) {
      await onUpdateProduct(editingProduct.id, payload);
    } else {
      await onAddProduct(payload);
    }
    setIsAddModalOpen(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Admin Top Navigation */}
      <div className="bg-neutral-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStore}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition flex items-center gap-1.5 text-xs font-bold"
            title="Do'kon vitrinasiga qaytish"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Do'konga qaytish</span>
          </button>
          <div className="h-6 w-px bg-white/20" />
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                Admin Panel
              </span>
              <h1 className="text-base sm:text-lg font-black tracking-tight">Market Boshqaruv Tizimi</h1>
            </div>
            <p className="text-[11px] text-neutral-400">market/admin/ moduli orqali mahsulot va buyurtmalar nazorati</p>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'products' ? 'bg-indigo-600 text-white shadow' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Mahsulotlar ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'orders' ? 'bg-indigo-600 text-white shadow' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Buyurtmalar ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-neutral-500">
                <span className="text-xs font-bold uppercase tracking-wider">Jami Daromad</span>
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-neutral-900 tracking-tight">
                {formatUZS(totalRevenue)}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                ↑ +18.4% o'tgan haftaga nisbatan
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-neutral-500">
                <span className="text-xs font-bold uppercase tracking-wider">Jami Buyurtmalar</span>
                <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
                  <ShoppingCart className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-neutral-900 tracking-tight">
                {totalOrdersCount} ta
              </div>
              <div className="text-[11px] text-neutral-500">
                {pendingOrdersCount} ta yangi / ko'rib chiqilmoqda
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-neutral-500">
                <span className="text-xs font-bold uppercase tracking-wider">Mavjud Mahsulotlar</span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-neutral-900 tracking-tight">
                {products.length} xil
              </div>
              <div className="text-[11px] text-neutral-500">
                {categories.length} ta kategoriya bo'yicha
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-neutral-500">
                <span className="text-xs font-bold uppercase tracking-wider">Xaridorlar</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-neutral-900 tracking-tight">
                142 ta
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold">
                98% qoniqish ko'rsatkichi
              </div>
            </div>
          </div>

          {/* Recent Orders in Dashboard */}
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-neutral-900">So'nggi buyurtmalar ro'yxati</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Barchasini ko'rish →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Buyurtma ID</th>
                    <th className="pb-3">Xaridor</th>
                    <th className="pb-3">Sana</th>
                    <th className="pb-3">Summa</th>
                    <th className="pb-3">To'lov</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {orders.slice(0, 5).map(o => (
                    <tr key={o.id} className="hover:bg-neutral-50/80">
                      <td className="py-3 font-mono font-bold text-indigo-600">{o.id}</td>
                      <td className="py-3 font-medium text-neutral-900">{o.shippingAddress.fullName}</td>
                      <td className="py-3 text-neutral-500">{formatDate(o.createdAt)}</td>
                      <td className="py-3 font-bold text-neutral-900">{formatUZS(o.totalAmount)}</td>
                      <td className="py-3 uppercase font-semibold text-neutral-600">{o.paymentMethod}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          o.status === 'yetkazildi' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : o.status === 'yetkazilmoqda'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Products Manager */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Mahsulot nomi bo'yicha qidiruv..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-3" />
            </div>

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-100 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi mahsulot qo'shish</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Mahsulot</th>
                  <th className="pb-3">Kategoriya</th>
                  <th className="pb-3">Narx</th>
                  <th className="pb-3">Qoldiq</th>
                  <th className="pb-3">Reyting</th>
                  <th className="pb-3 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-neutral-50">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-contain bg-neutral-50 border border-neutral-100 p-0.5 flex-shrink-0"
                        />
                        <div className="max-w-xs truncate font-bold text-neutral-900">{p.name}</div>
                      </div>
                    </td>
                    <td className="py-3 text-neutral-600">{p.category}</td>
                    <td className="py-3 font-bold text-neutral-900">{formatUZS(p.price)}</td>
                    <td className="py-3">
                      <span className={`font-semibold ${p.stock < 5 ? 'text-rose-600 font-bold' : 'text-neutral-700'}`}>
                        {p.stock} dona
                      </span>
                    </td>
                    <td className="py-3 text-amber-600 font-bold">★ {p.rating}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="Tahrirlash"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Haqiqatdan ham "${p.name}" mahsulotini o'chirmoqchimisiz?`)) {
                              onDeleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Orders Manager */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-neutral-900">Buyurtmalar monitoringi va boshqaruvi</h3>
            <span className="text-xs text-neutral-500">Jami {orders.length} ta buyurtma</span>
          </div>

          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="p-4 sm:p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-2.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-indigo-600">#{order.id}</span>
                    <span className="text-xs font-semibold text-neutral-800">{order.shippingAddress.fullName}</span>
                    <span className="text-xs text-neutral-400">({order.shippingAddress.phone})</span>
                  </div>

                  {/* Status Dropdown selector */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-neutral-500 font-medium">Holat:</span>
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="bg-white border border-neutral-300 rounded-xl px-2.5 py-1 text-xs font-bold text-neutral-900 focus:outline-none focus:border-indigo-600 cursor-pointer shadow-sm"
                    >
                      <option value="yangi">Yangi</option>
                      <option value="qabul_qilindi">Qabul qilindi</option>
                      <option value="yetkazilmoqda">Yetkazilmoqda</option>
                      <option value="yetkazildi">Yetkazildi</option>
                      <option value="bekor_qilindi">Bekor qilindi</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs text-neutral-600">
                  <div className="font-semibold text-neutral-800 mb-1">Buyurtma tarkibi:</div>
                  <div className="space-y-1">
                    {order.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>• {i.productName} ({i.quantity} dona)</span>
                        <span className="font-bold text-neutral-900">{formatUZS(i.price * i.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-neutral-200 text-xs font-bold">
                  <span className="text-neutral-500">Manzil: {order.shippingAddress.address}, {order.shippingAddress.city}</span>
                  <span className="text-indigo-600 text-sm">{formatUZS(order.totalAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-extrabold text-base text-neutral-900">
                {editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Mahsulot nomi:</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Masalan: iPhone 15 Pro Max..."
                  className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Kategoriya:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Brend:</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="Apple, Samsung, LG..."
                    className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Narx (so'm):</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Eski narx (so'm):</label>
                  <input
                    type="number"
                    value={formOldPrice}
                    onChange={(e) => setFormOldPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Omborda (dona):</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Rasm havolasi (URL):</label>
                <input
                  type="url"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Tavsif:</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Mahsulot haqida qisqacha ma'lumot..."
                  className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow"
                >
                  {editingProduct ? "O'zgarishlarni saqlash" : "Mahsulotni qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
