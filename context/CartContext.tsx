'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/products';
import { setCookie, getCookie } from '@/lib/cookies';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  cartAnimationTrigger: number;
  showNotification: boolean;
  notificationMessage: string;
  hideNotification: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartAnimationTrigger, setCartAnimationTrigger] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage and cookies on mount
  useEffect(() => {
    // Try localStorage first (more reliable during OAuth redirects)
    const localStorageCart = typeof window !== 'undefined' ? localStorage.getItem('shopping_cart') : null;

    if (localStorageCart) {
      try {
        const parsedCart = JSON.parse(localStorageCart);
        setCart(parsedCart);
        setIsLoaded(true);
        return;
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }

    // Fallback to cookies
    const savedCart = getCookie('shopping_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(decodeURIComponent(savedCart));
        setCart(parsedCart);
        // Migrate to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('shopping_cart', JSON.stringify(parsedCart));
        }
      } catch (error) {
        console.error('Failed to parse cart from cookie:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to both localStorage and cookies whenever it changes
  useEffect(() => {
    if (isLoaded) {
      const cartJson = JSON.stringify(cart);

      // Save to localStorage (primary storage)
      if (typeof window !== 'undefined') {
        localStorage.setItem('shopping_cart', cartJson);
      }

      // Save to cookies (backup for cross-domain scenarios)
      setCookie('shopping_cart', encodeURIComponent(cartJson), 7); // 7 days expiry
    }
  }, [cart, isLoaded]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setCartAnimationTrigger(prev => prev + 1);
    setNotificationMessage('Item added to cart!');
    setShowNotification(true);
  };

  const hideNotification = () => {
    setShowNotification(false);
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    // Clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shopping_cart');
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        cartAnimationTrigger,
        showNotification,
        notificationMessage,
        hideNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
