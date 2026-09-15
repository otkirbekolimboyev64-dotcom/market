import { Product, Category, Order, User, AdminStats } from '../../src/types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_ORDERS, INITIAL_USER } from '../../src/data/seedData';

class StoreDatabase {
  private products: Product[] = [...INITIAL_PRODUCTS];
  private categories: Category[] = [...INITIAL_CATEGORIES];
  private orders: Order[] = [...INITIAL_ORDERS];
  private user: User = { ...INITIAL_USER };

  // Products
  getProducts(filters?: { category?: string; search?: string; minPrice?: number; maxPrice?: number; sort?: string }): Product[] {
    let result = [...this.products];

    if (filters?.category && filters.category !== 'all') {
      result = result.filter(p => p.categoryId === filters.category || p.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    }

    if (filters?.minPrice !== undefined) {
      result = result.filter(p => p.price >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters?.sort) {
      switch (filters.sort) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'popular':
        default:
          result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
          break;
      }
    }

    return result;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  addProduct(productData: Omit<Product, 'id'>): Product {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + (Date.now()),
      rating: productData.rating || 5.0,
      reviewsCount: productData.reviewsCount || 0
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    return this.products.length < initialLen;
  }

  // Categories
  getCategories(): Category[] {
    return this.categories;
  }

  // Orders
  getOrders(): Order[] {
    return this.orders;
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find(o => o.id === id);
  }

  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'trackingNumber'>): Order {
    const newOrder: Order = {
      ...orderData,
      id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
      createdAt: new Date().toISOString(),
      trackingNumber: 'UZM-' + Math.floor(10000000 + Math.random() * 90000000)
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  updateOrderStatus(id: string, status: Order['status']): Order | null {
    const order = this.orders.find(o => o.id === id);
    if (!order) return null;
    order.status = status;
    return order;
  }

  // User
  getUser(): User {
    return this.user;
  }

  updateUser(updates: Partial<User>): User {
    this.user = { ...this.user, ...updates };
    return this.user;
  }

  toggleWishlist(productId: string): string[] {
    if (this.user.wishlist.includes(productId)) {
      this.user.wishlist = this.user.wishlist.filter(id => id !== productId);
    } else {
      this.user.wishlist.push(productId);
    }
    return this.user.wishlist;
  }

  // Stats
  getStats(): AdminStats {
    const totalRevenue = this.orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingOrders = this.orders.filter(o => o.status === 'yangi' || o.status === 'qabul_qilindi').length;
    return {
      totalRevenue,
      totalOrders: this.orders.length,
      totalProducts: this.products.length,
      totalCustomers: 142, // active store customers
      pendingOrders
    };
  }
}

export const db = new StoreDatabase();
