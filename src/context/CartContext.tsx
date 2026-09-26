import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../../server/types.js';

export interface CartItem {
  id: string; // productId + colorName
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  image: string;
  selectedColor: string;
  quantity: number;
  stock: number;
  fabric: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedColor?: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  totalSavings: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('virasat_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('virasat_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = (product: Product, selectedColor?: string, quantity = 1) => {
    // Check product stock
    if (product.stock <= 0 || product.availability === 'Out of Stock') {
      return;
    }

    const color = selectedColor || product.colors?.[0]?.name || 'Standard';
    const colorObj = product.colors?.find(c => c.name.toLowerCase() === color.toLowerCase());

    // Check color variant stock
    if (colorObj) {
      if (colorObj.inStock === false || (colorObj.stock !== undefined && colorObj.stock <= 0)) {
        return;
      }
    }

    const itemId = `${product.id}-${color}`;

    // Get color image if available, else first image
    const itemImage = colorObj?.image || product.images?.[0]?.url || '';

    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item =>
          item.id === itemId
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 10) }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          image: itemImage,
          selectedColor: color,
          quantity,
          stock: product.stock || 10,
          fabric: product.fabric
        }
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalSavings = cart.reduce((sum, item) => sum + Math.max(0, item.originalPrice - item.price) * item.quantity, 0);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        totalSavings,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
