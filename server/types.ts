export interface CloudinaryImage {
  url: string;
  publicId: string;
}

export interface ProductColor {
  name: string;
  value: string;
  image: string;
  stock?: number;
  inStock?: boolean;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  location?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercentage?: number;
  stock: number;
  description: string;
  fabric: string;
  sareeLength: string;
  blouseIncluded: boolean;
  blouseType: string;
  careInstructions: string;
  availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  rating: number;
  reviewsCount: number;
  work: string;
  zariType: string;
  occasion: string;
  colors: ProductColor[];
  images: CloudinaryImage[];
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  image: CloudinaryImage;
  itemCount: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  image: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: 'razorpay' | 'cod' | 'test_mode';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'Pending' | 'Order Placed' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  adminWhatsAppNumber: string;
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  whatsAppApiKey?: string;
  whatsAppPhoneNumberId?: string;
}
