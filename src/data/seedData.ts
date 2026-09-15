import { Product, Category, User, Order } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Smartfonlar va Gadjetlar', slug: 'smartphones', icon: 'Smartphone', itemCount: 34 },
  { id: 'cat-2', name: 'Noutbuklar va Kompyuterlar', slug: 'laptops', icon: 'Laptop', itemCount: 28 },
  { id: 'cat-3', name: 'Maishiy Texnika', slug: 'appliances', icon: 'Tv', itemCount: 42 },
  { id: 'cat-4', name: 'Kiyim va Poyabzallar', slug: 'fashion', icon: 'Shirt', itemCount: 65 },
  { id: 'cat-5', name: 'Go\'zallik va Salomatlik', slug: 'beauty', icon: 'Sparkles', itemCount: 19 },
  { id: 'cat-6', name: 'Kitoblar va Kantselyariya', slug: 'books', icon: 'BookOpen', itemCount: 51 },
  { id: 'cat-7', name: 'Sport va Dam olish', slug: 'sports', icon: 'Dumbbell', itemCount: 22 },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
    category: 'Smartfonlar va Gadjetlar',
    categoryId: 'cat-1',
    price: 3499000,
    oldPrice: 4200000,
    discountPercent: 17,
    monthlyInstallment: 295000,
    rating: 4.9,
    reviewsCount: 142,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Apple A17 Pro kuchli protsessori bilan jihozlangan eng so\'nggi flagman smartfon. Aerokosmik darajadagi titan korpus, 48MP asosiy kamera hamda 5x optik zumga ega telefoto ob\'ektiv.',
    specs: {
      'Ekran': '6.7 dyuym Super Retina XDR OLED, 120Hz ProMotion',
      'Protsessor': 'Apple A17 Pro (3 nm)',
      'Xotira': '256 GB NVMe / 8 GB RAM',
      'Asosiy kamera': '48 MP + 12 MP + 12 MP',
      'Batareya': '4422 mAh, 29 soat video tomosha qilish',
      'Kafolat': '1 yil rasmiy kafolat'
    },
    stock: 15,
    isPopular: true,
    isDealOfTheDay: true,
    brand: 'Apple'
  },
  {
    id: 'prod-2',
    name: 'Samsung Galaxy S24 Ultra 12GB/512GB Titanium Gray',
    category: 'Smartfonlar va Gadjetlar',
    categoryId: 'cat-1',
    price: 2990000,
    oldPrice: 3600000,
    discountPercent: 17,
    monthlyInstallment: 250000,
    rating: 4.8,
    reviewsCount: 98,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Galaxy AI sun\'iy intellekt xususiyatlari, o\'rnatilgan S-Pen stilus va 200 megapikselli kamera bilan yangi davr smartfoni.',
    specs: {
      'Ekran': '6.8 dyuym Dynamic LTPO AMOLED 2X, 2600 nit yorqinlik',
      'Protsessor': 'Snapdragon 8 Gen 3 for Galaxy',
      'Xotira': '512 GB UFS 4.0 / 12 GB RAM',
      'Kamera': '200 MP + 50 MP + 10 MP + 12 MP',
      'Batareya': '5000 mAh, 45W tezkor zaryadlash'
    },
    stock: 12,
    isPopular: true,
    brand: 'Samsung'
  },
  {
    id: 'prod-3',
    name: 'MacBook Air 13" M3 Chip 16GB / 512GB Midnight',
    category: 'Noutbuklar va Kompyuterlar',
    categoryId: 'cat-2',
    price: 3850000,
    oldPrice: 4500000,
    discountPercent: 14,
    monthlyInstallment: 320000,
    rating: 4.95,
    reviewsCount: 76,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Yengil va ingichka MacBook Air yangi M3 chipi bilan yanada tezkor. 18 soatgacha uzluksiz batareya quvvati va jimjitlik ta\'minlovchi passiv sovutish.',
    specs: {
      'Ekran': '13.6 dyuym Liquid Retina, 500 nit',
      'Protsessor': 'Apple M3 (8 yadroli CPU, 10 yadroli GPU)',
      'Xotira': '512 GB SSD / 16 GB birlashtirilgan xotira',
      'Batareya': '18 soatgacha avtonom ish',
      'Og\'irligi': '1.24 kg'
    },
    stock: 8,
    isPopular: true,
    isNew: true,
    brand: 'Apple'
  },
  {
    id: 'prod-4',
    name: 'Sony WH-1000XM5 Shovqinni bekor qiluvchi quloqchin',
    category: 'Smartfonlar va Gadjetlar',
    categoryId: 'cat-1',
    price: 490000,
    oldPrice: 650000,
    discountPercent: 25,
    monthlyInstallment: 45000,
    rating: 4.85,
    reviewsCount: 114,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Dunyo miqyosida eng yaxshi shovqinni faol bekor qilish (ANC) texnologiyasiga ega simsiz premium quloqchin.',
    specs: {
      'Ulanish': 'Bluetooth 5.2, LDAC, Hi-Res Audio',
      'Batareya': '30 soat ANC yoqilgan holda',
      'Zaryad': '3 daqiqada 3 soatlik ish zaryadi',
      'Mikrofon': '8 ta mikrofon kristaldek toza suhbatlar uchun'
    },
    stock: 20,
    isDealOfTheDay: true,
    brand: 'Sony'
  },
  {
    id: 'prod-5',
    name: 'LG Smart TV 55" OLED 4K UHD 120Hz WebOS',
    category: 'Maishiy Texnika',
    categoryId: 'cat-3',
    price: 2450000,
    oldPrice: 3100000,
    discountPercent: 21,
    monthlyInstallment: 210000,
    rating: 4.9,
    reviewsCount: 64,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'OLED o\'z-o\'zini yorituvchi piksellar, mutlaq qora rang va cheksiz kontrast. Dolby Vision va Dolby Atmos qo\'llab-quvvatlaydi.',
    specs: {
      'Dioganal': '55 dyuym (139 sm)',
      'Ruxsat': '4K UHD (3840 x 2160), 120Hz',
      'Texnologiya': 'OLED evo, α9 AI Processor Gen6',
      'Ovoz': '40W 2.2 kanalli Dolby Atmos'
    },
    stock: 6,
    brand: 'LG'
  },
  {
    id: 'prod-6',
    name: 'Dyson V15 Detect Extra Simsiz Changyutkich',
    category: 'Maishiy Texnika',
    categoryId: 'cat-3',
    price: 980000,
    oldPrice: 1350000,
    discountPercent: 27,
    monthlyInstallment: 85000,
    rating: 4.92,
    reviewsCount: 88,
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Lazerli mikroskopik chang aniqlash tizimi, 240 AW kuchli so\'rish quvvati va 60 daqiqagacha avtonom ishlash.',
    specs: {
      'Quvvat': '240 AW',
      'Filtratsiya': 'HEPA 99.99% mayda zarralarni ushlab qoladi',
      'Vazn': '3.0 kg',
      'Displey': 'LCD ekran zaryad va chang hajmini ko\'rsatadi'
    },
    stock: 11,
    isPopular: true,
    brand: 'Dyson'
  },
  {
    id: 'prod-7',
    name: 'Erkaklar Paxtali Kundalik Polo Ko\'ylagi Premium',
    category: 'Kiyim va Poyabzallar',
    categoryId: 'cat-4',
    price: 89000,
    oldPrice: 145000,
    discountPercent: 39,
    monthlyInstallment: 9000,
    rating: 4.7,
    reviewsCount: 215,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'
    ],
    description: '100% tabiiy nafas oluvchi turk paxtasidan tikilgan qulay polo. Kundalik kiyish uchun ideal, yuvilganda shaklini va rangini yo\'qotmaydi.',
    specs: {
      'Tarkibi': '100% Organik Paxta',
      'O\'lchamlar': 'S, M, L, XL, XXL',
      'Ishlab chiqarilgan': 'Turkiya',
      'Rang': 'To\'q ko\'k / Oq / Qora'
    },
    stock: 45,
    isDealOfTheDay: true,
    brand: 'Terra Pro'
  },
  {
    id: 'prod-8',
    name: '"Atom Odatlar" - Jeyms Klir (O\'zbek tilida)',
    category: 'Kitoblar va Kantselyariya',
    categoryId: 'cat-6',
    price: 35000,
    oldPrice: 55000,
    discountPercent: 36,
    monthlyInstallment: 3500,
    rating: 4.98,
    reviewsCount: 540,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Mayda o\'zgarishlar qanday qilib ulkan natijalarga olib kelishi haqida xalqaro bestseller. Millionlab insonlar hayotini ijobiy tomonga o\'zgartirgan kitob.',
    specs: {
      'Muallif': 'Jeyms Klir',
      'Sahifalar': '320 bet',
      'Muqova': 'Qattiq muqova',
      'Nashriyot': 'Zukko Kitobxon'
    },
    stock: 120,
    isPopular: true,
    brand: 'Asaxiy Books'
  }
];

export const INITIAL_USER: User = {
  id: 'usr-001',
  fullName: 'O\'tkirbek Olimboyev',
  phone: '+998 90 123 45 67',
  email: 'otkirbekolimboyev64@gmail.com',
  city: 'Toshkent shahri',
  address: 'Chilonzor tumani, 9-mavze, 14-uy, 28-xonadon',
  savedAddresses: [
    'Toshkent sh., Chilonzor tumani, 9-mavze, 14-uy',
    'Toshkent sh., Yunusobod tumani, 4-mavze, 8-uy'
  ],
  wishlist: ['prod-1', 'prod-4']
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-98421',
    createdAt: '2026-09-14T14:30:00Z',
    items: [
      {
        productId: 'prod-4',
        productName: 'Sony WH-1000XM5 Shovqinni bekor qiluvchi quloqchin',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        price: 490000,
        quantity: 1
      },
      {
        productId: 'prod-8',
        productName: '"Atom Odatlar" - Jeyms Klir (O\'zbek tilida)',
        productImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
        price: 35000,
        quantity: 1
      }
    ],
    totalAmount: 525000,
    shippingFee: 0,
    shippingAddress: {
      fullName: 'O\'tkirbek Olimboyev',
      phone: '+998 90 123 45 67',
      city: 'Toshkent shahri',
      address: 'Chilonzor tumani, 9-mavze, 14-uy'
    },
    paymentMethod: 'payme',
    paymentStatus: 'paid',
    status: 'yetkazilmoqda',
    trackingNumber: 'UZM-89312891'
  },
  {
    id: 'ORD-97103',
    createdAt: '2026-09-10T09:15:00Z',
    items: [
      {
        productId: 'prod-7',
        productName: 'Erkaklar Paxtali Kundalik Polo Ko\'ylagi Premium',
        productImage: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80',
        price: 89000,
        quantity: 2
      }
    ],
    totalAmount: 178000,
    shippingFee: 20000,
    shippingAddress: {
      fullName: 'O\'tkirbek Olimboyev',
      phone: '+998 90 123 45 67',
      city: 'Toshkent shahri',
      address: 'Chilonzor tumani, 9-mavze, 14-uy'
    },
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    status: 'yetkazildi',
    trackingNumber: 'UZM-77123901'
  }
];
