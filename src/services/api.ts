import { Product, Category, Order } from '../../server/types.js';

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    total: number;
  };
  message?: string;
}

export interface SingleProductResponse {
  success: boolean;
  data: {
    product: Product;
  };
  message?: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: {
    categories: Category[];
  };
}

export interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
  };
}

export interface SingleOrderResponse {
  success: boolean;
  data: {
    order: Order;
  };
  message?: string;
}

export interface AnalyticsResponse {
  success: boolean;
  data: {
    totalRevenue: number;
    totalOrders: number;
    paidOrders: number;
    averageOrderValue: number;
    statusCounts: Record<string, number>;
    categoryRevenue: Record<string, { count: number; revenue: number }>;
    inventory: {
      totalInventoryItems: number;
      totalSkus: number;
      lowStockCount: number;
      outOfStockCount: number;
      lowStockItems: Array<{
        id: string;
        name: string;
        category: string;
        stock: number;
        price: number;
      }>;
    };
    salesTimeline: Array<{ date: string; amount: number }>;
  };
}

export const api = {
  // Products
  async getProducts(params?: Record<string, any>): Promise<ProductsResponse> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    const res = await fetch(`/api/products?${query.toString()}`);
    return res.json();
  },

  async getProduct(slugOrId: string): Promise<SingleProductResponse> {
    const res = await fetch(`/api/products/${encodeURIComponent(slugOrId)}`);
    return res.json();
  },

  async createProduct(product: Partial<Product>): Promise<SingleProductResponse> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return res.json();
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<SingleProductResponse> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Categories
  async getCategories(): Promise<CategoriesResponse> {
    const res = await fetch('/api/categories');
    return res.json();
  },

  // Orders
  async getOrders(): Promise<OrdersResponse> {
    const res = await fetch('/api/orders');
    return res.json();
  },

  async getOrder(id: string): Promise<SingleOrderResponse> {
    const res = await fetch(`/api/orders/${id}`);
    return res.json();
  },

  async updateOrderStatus(id: string, status: string): Promise<SingleOrderResponse> {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  async createDirectOrder(orderData: any): Promise<SingleOrderResponse> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  // Razorpay
  async createRazorpayOrder(amount: number, receipt?: string, notes?: any) {
    const res = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, receipt, notes })
    });
    return res.json();
  },

  async verifyPayment(verificationData: any): Promise<SingleOrderResponse> {
    const res = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verificationData)
    });
    return res.json();
  },

  // Cloudinary Upload
  async uploadImage(imageBase64OrUrl: string) {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: imageBase64OrUrl.startsWith('data:') ? imageBase64OrUrl : undefined,
        imageUrl: !imageBase64OrUrl.startsWith('data:') ? imageBase64OrUrl : undefined
      })
    });
    return res.json();
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsResponse> {
    const res = await fetch('/api/analytics');
    return res.json();
  },

  // Nodemailer Email OTP Verification
  async sendBookingOtp(email: string, fullName?: string): Promise<{ success: boolean; message: string; debugOtp?: string; otpPreviewUrl?: string }> {
    const res = await fetch('/api/auth/send-booking-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, fullName })
    });
    return res.json();
  },

  async verifyBookingOtp(email: string, otp: string): Promise<{ success: boolean; message: string; verified?: boolean }> {
    const res = await fetch('/api/auth/verify-booking-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    return res.json();
  },

  // Store Settings
  async getSettings(): Promise<{ success: boolean; data: { settings: any } }> {
    const res = await fetch('/api/settings');
    return res.json();
  },

  async updateSettings(settings: any): Promise<{ success: boolean; data: { settings: any } }> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return res.json();
  }
};
