import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product, Category, Order, StoreSettings } from './types.js';
import { initialProducts, initialCategories, initialOrders } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

const defaultSettings: StoreSettings = {
  adminWhatsAppNumber: process.env.ADMIN_WHATSAPP_NUMBER || '+919356951406',
  storeName: 'Virasat Silk & Sarees',
  storeEmail: process.env.SMTP_USER || 'orders@virasatsarees.com',
  storePhone: '+919356951406',
  storeAddress: 'Showroom No. 12, Mahadwar Road, Rajarampuri, Kolhapur, Maharashtra 416012'
};

interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  orders: Order[];
  settings?: StoreSettings;
}

function ensureDbFile(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      products: initialProducts,
      categories: initialCategories,
      orders: initialOrders,
      settings: defaultSettings
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.settings) {
      parsed.settings = defaultSettings;
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    return parsed;
  } catch (err) {
    console.error('Failed to parse database.json, resetting to seed data:', err);
    const initialData: DatabaseSchema = {
      products: initialProducts,
      categories: initialCategories,
      orders: initialOrders,
      settings: defaultSettings
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function saveDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database.json:', err);
  }
}

export const db = {
  // Products
  getProducts(filters?: {
    category?: string;
    search?: string;
    fabric?: string;
    occasion?: string;
    color?: string;
    zariType?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    bestSeller?: boolean;
    newArrival?: boolean;
    sort?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  }): Product[] {
    const state = ensureDbFile();
    let result = [...state.products];

    if (!filters) return result;

    if (filters.category && filters.category !== 'all' && filters.category !== 'All') {
      const catLower = filters.category.toLowerCase();
      result = result.filter(p => p.category.toLowerCase() === catLower);
    }

    if (filters.search && filters.search.trim()) {
      const term = filters.search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.fabric.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.occasion.toLowerCase().includes(term) ||
        p.colors?.some(c => c.name.toLowerCase().includes(term))
      );
    }

    if (filters.fabric && filters.fabric !== 'all') {
      result = result.filter(p => p.fabric.toLowerCase().includes(filters.fabric!.toLowerCase()));
    }

    if (filters.occasion && filters.occasion !== 'all' && filters.occasion !== 'All') {
      const occLower = filters.occasion.toLowerCase().trim();
      result = result.filter(p => Boolean(p.occasion) && p.occasion.toLowerCase().includes(occLower));
    }

    if (filters.color && filters.color !== 'all') {
      const colLower = filters.color.toLowerCase();
      result = result.filter(p => p.colors?.some(c => c.name.toLowerCase().includes(colLower)));
    }

    if (filters.zariType && filters.zariType !== 'all') {
      result = result.filter(p => p.zariType?.toLowerCase().includes(filters.zariType!.toLowerCase()));
    }

    if (filters.minPrice !== undefined) {
      result = result.filter(p => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters.featured) {
      result = result.filter(p => p.featured);
    }

    if (filters.bestSeller) {
      result = result.filter(p => p.bestSeller);
    }

    if (filters.newArrival) {
      result = result.filter(p => p.newArrival);
    }

    if (filters.sort) {
      switch (filters.sort) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'featured':
        default:
          result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
      }
    }

    return result;
  },

  getProductBySlugOrId(identifier: string): Product | null {
    const state = ensureDbFile();
    const product = state.products.find(
      p => p.slug === identifier || p.id === identifier
    );
    return product || null;
  },

  createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const state = ensureDbFile();
    const id = 'prod-' + Date.now();
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: now,
      updatedAt: now
    };
    state.products.unshift(newProduct);
    saveDb(state);
    return newProduct;
  },

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const state = ensureDbFile();
    const index = state.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    state.products[index] = {
      ...state.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveDb(state);
    return state.products[index];
  },

  deleteProduct(id: string): boolean {
    const state = ensureDbFile();
    const initialLen = state.products.length;
    state.products = state.products.filter(p => p.id !== id);
    if (state.products.length !== initialLen) {
      saveDb(state);
      return true;
    }
    return false;
  },

  // Categories
  getCategories(): Category[] {
    const state = ensureDbFile();
    // Dynamically calculate accurate itemCount
    return state.categories.map(cat => {
      const count = state.products.filter(p => p.category.toLowerCase() === cat.slug.toLowerCase()).length;
      return {
        ...cat,
        itemCount: count || cat.itemCount
      };
    });
  },

  // Orders
  getOrders(): Order[] {
    const state = ensureDbFile();
    return [...state.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getOrderById(id: string): Order | null {
    const state = ensureDbFile();
    return state.orders.find(o => o.id === id || o.orderNumber === id) || null;
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    const state = ensureDbFile();
    const id = 'ord-' + Date.now();
    const orderNumber = 'VIR-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      createdAt: now,
      updatedAt: now
    };

    // Deduct stock
    for (const item of newOrder.items) {
      const prod = state.products.find(p => p.id === item.productId || p.slug === item.slug);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        if (prod.stock === 0) {
          prod.availability = 'Out of Stock';
        } else if (prod.stock <= 4) {
          prod.availability = 'Low Stock';
        }

        // Deduct variant stock if selectedColor is specified
        if (item.selectedColor && prod.colors) {
          const colorVariant = prod.colors.find(
            c => c.name.toLowerCase() === item.selectedColor!.toLowerCase()
          );
          if (colorVariant) {
            if (colorVariant.stock !== undefined) {
              colorVariant.stock = Math.max(0, colorVariant.stock - item.quantity);
              if (colorVariant.stock === 0) {
                colorVariant.inStock = false;
              }
            }
          }
        }
      }
    }

    state.orders.unshift(newOrder);
    saveDb(state);
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: Order['orderStatus']): Order | null {
    const state = ensureDbFile();
    const order = state.orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    order.orderStatus = status;
    order.updatedAt = new Date().toISOString();
    saveDb(state);
    return order;
  },

  // Store & Admin Settings
  getSettings(): StoreSettings {
    const state = ensureDbFile();
    return state.settings || defaultSettings;
  },

  updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    const state = ensureDbFile();
    state.settings = {
      ...(state.settings || defaultSettings),
      ...updates
    };
    saveDb(state);
    return state.settings;
  },

  // Comprehensive Analytics
  getAnalytics() {
    const state = ensureDbFile();
    const orders = state.orders;
    const products = state.products;

    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);

    const totalOrders = orders.length;
    const paidOrders = orders.filter(o => o.paymentStatus === 'paid').length;
    const aov = paidOrders > 0 ? Math.round(totalRevenue / paidOrders) : 0;

    // Status breakdown
    const statusCounts: Record<string, number> = {
      'Order Placed': 0,
      Confirmed: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0
    };
    orders.forEach(o => {
      statusCounts[o.orderStatus] = (statusCounts[o.orderStatus] || 0) + 1;
    });

    // Category breakdown
    const categoryRevenue: Record<string, { count: number; revenue: number }> = {};
    orders.forEach(o => {
      o.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId || p.slug === item.slug);
        const cat = prod?.category || 'Traditional';
        if (!categoryRevenue[cat]) {
          categoryRevenue[cat] = { count: 0, revenue: 0 };
        }
        categoryRevenue[cat].count += item.quantity;
        categoryRevenue[cat].revenue += item.price * item.quantity;
      });
    });

    // Inventory health
    const totalInventoryItems = products.reduce((acc, p) => acc + p.stock, 0);
    const lowStockProducts = products.filter(p => p.stock <= 5);
    const outOfStockProducts = products.filter(p => p.stock === 0);

    // Recent 7-day sales breakdown
    const salesByDate: Record<string, number> = {};
    orders.forEach(o => {
      const date = o.createdAt.split('T')[0];
      salesByDate[date] = (salesByDate[date] || 0) + (o.paymentStatus === 'paid' ? o.total : 0);
    });

    return {
      totalRevenue,
      totalOrders,
      paidOrders,
      averageOrderValue: aov,
      statusCounts,
      categoryRevenue,
      inventory: {
        totalInventoryItems,
        totalSkus: products.length,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
        lowStockItems: lowStockProducts.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          stock: p.stock,
          price: p.price
        }))
      },
      salesTimeline: Object.entries(salesByDate)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => a.date.localeCompare(b.date))
    };
  }
};
