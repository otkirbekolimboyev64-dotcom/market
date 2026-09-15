import React, { useState, useEffect } from 'react';
import { 
  Product, 
  Category, 
  CartItem, 
  Order, 
  User, 
  OrderStatus 
} from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_ORDERS, 
  INITIAL_USER 
} from './data/seedData';
import { Header } from './market/frontend/components/Header';
import { HomePage } from './market/frontend/pages/index';
import { CatalogPage } from './market/frontend/pages/catalog';
import { ProductDetailPage } from './market/frontend/pages/product/[id]';
import { CartPage } from './market/frontend/pages/cart';
import { ProfilePage } from './market/frontend/pages/profile';
import { AdminPanel } from './market/admin/AdminPanel';
import { NotificationToast } from './market/components/NotificationToast';
import { PWAInstallButton } from './market/frontend/components/PWAInstallButton';
import { OfflineIndicator } from './market/frontend/components/OfflineIndicator';
import { Truck, ShieldCheck, Phone, Mail, Instagram, Send, Heart } from 'lucide-react';

export default function App() {
  // Navigation state
  const [activePage, setActivePage] = useState<'home' | 'catalog' | 'product' | 'cart' | 'profile' | 'admin'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-1');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Core data states
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Seed initial cart item
    return [{ product: INITIAL_PRODUCTS[3], quantity: 1 }];
  });
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [user, setUser] = useState<User>(INITIAL_USER);

  // UI state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with Express backend on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            setProducts(data.data);
          }
        }
      } catch (e) {
        // Fallback to initial seeds
      }

      try {
        const ordRes = await fetch('/api/orders');
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          if (ordData.data && Array.isArray(ordData.data)) {
            setOrders(ordData.data);
          }
        }
      } catch (e) {}

      try {
        const usrRes = await fetch('/api/users/profile');
        if (usrRes.ok) {
          const usrData = await usrRes.json();
          if (usrData.data) {
            setUser(usrData.data);
          }
        }
      } catch (e) {}
    }
    fetchData();
  }, []);

  const handleNavigate = (page: string, params?: { id?: string; categoryId?: string; search?: string }) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (params?.id) setSelectedProductId(params.id);
    if (params?.categoryId) setSelectedCategoryId(params.categoryId);
    if (params?.search !== undefined) setSearchQuery(params.search);

    if (page === 'home' || page === 'catalog' || page === 'product' || page === 'cart' || page === 'profile' || page === 'admin') {
      setActivePage(page);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Cart operations
  const handleAddToCart = (product: Product, e?: React.MouseEvent, quantity = 1) => {
    if (e) e.stopPropagation();
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`"${product.name.slice(0, 25)}..." savatga qo'shildi!`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(i => i.product.id !== productId));
    showToast("Mahsulot savatdan o'chirildi");
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleQuickBuy = (product: Product, quantity: number) => {
    handleAddToCart(product, undefined, quantity);
    setActivePage('cart');
  };

  // Wishlist toggle
  const handleToggleWishlist = async (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isPresent = user.wishlist.includes(productId);
    const updated = isPresent 
      ? user.wishlist.filter(id => id !== productId)
      : [...user.wishlist, productId];
    
    setUser(prev => ({ ...prev, wishlist: updated }));
    showToast(isPresent ? "Saralanganlardan chiqarildi" : "Saralanganlarga qo'shildi ❤️");

    try {
      await fetch(`/api/users/wishlist/${productId}`, { method: 'POST' });
    } catch {}
  };

  // Order created
  const handleOrderCreated = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    showToast("Buyurtmangiz muvaffaqiyatli qabul qilindi!");
  };

  // Admin handlers
  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setProducts(prev => [data.data, ...prev]);
        showToast("Yangi mahsulot muvaffaqiyatli qo'shildi!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setProducts(prev => prev.map(p => p.id === id ? data.data : p));
        showToast("Mahsulot muvaffaqiyatli yangilandi!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast("Mahsulot o'chirildi!");
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
        showToast(`Buyurtma holati "${status}" ga o'zgartirildi!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartProductIds = cartItems.map(i => i.product.id);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Header component matching: market/frontend/components/Header.js */}
      {activePage !== 'admin' && (
        <Header
          activePage={activePage}
          onNavigate={handleNavigate}
          categories={categories}
          cartCount={cartCount}
          cartTotal={cartTotal}
          user={user}
          allProducts={products}
        />
      )}

      {/* Main Content View with matching page routing */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">

        {/* Dynamic Page Rendering */}
        {activePage === 'home' && (
          <HomePage
            categories={categories}
            products={products}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlist={user.wishlist}
            cartProductIds={cartProductIds}
          />
        )}

        {activePage === 'catalog' && (
          <CatalogPage
            categories={categories}
            products={products}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlist={user.wishlist}
            cartProductIds={cartProductIds}
          />
        )}

        {activePage === 'product' && (
          <ProductDetailPage
            productId={selectedProductId}
            products={products}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            onQuickBuy={handleQuickBuy}
            wishlist={user.wishlist}
            cartProductIds={cartProductIds}
          />
        )}

        {activePage === 'cart' && (
          <CartPage
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onNavigate={handleNavigate}
            onOrderCreated={handleOrderCreated}
            user={user}
          />
        )}

        {activePage === 'profile' && (
          <ProfilePage
            user={user}
            orders={orders}
            products={products}
            onUpdateUser={(updates) => setUser(prev => ({ ...prev, ...updates }))}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {activePage === 'admin' && (
          <AdminPanel
            products={products}
            orders={orders}
            categories={categories}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onBackToStore={() => setActivePage('home')}
          />
        )}
      </main>

      {/* Footer */}
      {activePage !== 'admin' && (
        <footer className="bg-neutral-900 text-neutral-300 mt-auto border-t border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-lg">
                    M
                  </div>
                  <span className="text-xl font-black text-white tracking-tight">MARKET</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  O'zbekistondagi eng qulay va ishonchli onlayn do'kon platformasi. Original mahsulotlar va tezkor bepul yetkazib berish.
                </p>
                <div className="flex items-center gap-3 text-neutral-400 text-sm">
                  <a href="#" className="hover:text-white p-2 rounded-lg bg-neutral-800 transition"><Instagram className="w-4 h-4" /></a>
                  <a href="#" className="hover:text-white p-2 rounded-lg bg-neutral-800 transition"><Send className="w-4 h-4" /></a>
                  <a href="#" className="hover:text-white p-2 rounded-lg bg-neutral-800 transition"><Mail className="w-4 h-4" /></a>
                </div>
              </div>

              {/* Navigation links */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Bo'limlar</h4>
                <ul className="space-y-2 text-xs text-neutral-400">
                  <li><button onClick={() => handleNavigate('home')} className="hover:text-white transition">Bosh sahifa</button></li>
                  <li><button onClick={() => handleNavigate('catalog')} className="hover:text-white transition">Katalog</button></li>
                  <li><button onClick={() => handleNavigate('cart')} className="hover:text-white transition">Savat</button></li>
                  <li><button onClick={() => handleNavigate('profile')} className="hover:text-white transition">Profil va buyurtmalar</button></li>
                  <li><button onClick={() => handleNavigate('admin')} className="hover:text-amber-400 text-amber-500 font-semibold transition">Admin Panel</button></li>
                </ul>
              </div>

              {/* Customer support */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Xaridorlarga</h4>
                <ul className="space-y-2 text-xs text-neutral-400">
                  <li><span className="hover:text-white transition cursor-pointer">Yetkazib berish shartlari</span></li>
                  <li><span className="hover:text-white transition cursor-pointer">Muddatli to'lov qoidalari</span></li>
                  <li><span className="hover:text-white transition cursor-pointer">Mahsulotni qaytarish</span></li>
                  <li><span className="hover:text-white transition cursor-pointer">Maxfiylik siyosati</span></li>
                </ul>
              </div>

              {/* Contact */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Aloqa markazi</h4>
                <p className="text-xs text-neutral-400 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-400" />
                  <span>+998 71 200-00-00</span>
                </p>
                <p className="text-xs text-neutral-400 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span>info@market.uz</span>
                </p>
                <p className="text-xs text-neutral-500">
                  Ish vaqti: Har kuni 09:00 dan 21:00 gacha dam olish kunlarisiz.
                </p>
              </div>
            </div>

            <div className="border-t border-neutral-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
              <p>© 2026 PROMARKET. Barcha huquqlar himoyalangan.</p>
            </div>
          </div>
        </footer>
      )}

      {/* PWA Offline Indicator */}
      <OfflineIndicator />

      {/* Global Notification Toast */}
      <NotificationToast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
        onViewCart={activePage !== 'cart' ? () => setActivePage('cart') : undefined}
      />
    </div>
  );
}
