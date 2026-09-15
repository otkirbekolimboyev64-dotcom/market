export interface Product {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  price: number; // In Uzbek so'm (UZS)
  oldPrice?: number;
  discountPercent?: number;
  monthlyInstallment?: number; // In UZS / month
  rating: number;
  reviewsCount: number;
  images: string[];
  description: string;
  specs: Record<string, string>;
  stock: number;
  isPopular?: boolean;
  isNew?: boolean;
  isDealOfTheDay?: boolean;
  brand: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type OrderStatus = 'yangi' | 'qabul_qilindi' | 'yetkazilmoqda' | 'yetkazildi' | 'bekor_qilindi';
export type PaymentMethod = 'cash' | 'payme' | 'click' | 'uzumpay';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount?: number;
  shippingFee: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
    notes?: string;
  };
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending';
  status: OrderStatus;
  trackingNumber: string;
}

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  savedAddresses: string[];
  wishlist: string[];
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
}
