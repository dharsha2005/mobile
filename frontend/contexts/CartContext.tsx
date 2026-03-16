"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getCart, addToCart as addToCartService, updateCartItem, removeCartItem } from "../services/cartService";

interface CartItem {
  _id: string;
  product: any;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const cartData = await getCart();
        setCart(cartData.items || []);
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addToCart = async (productId: string, quantity: number) => {
    try {
      await addToCartService(productId, quantity);
      await loadCart(); // Reload cart to get updated data
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      await loadCart(); // Reload cart to get updated data
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateCartQuantity(itemId, quantity);
      await loadCart(); // Reload cart to get updated data
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
      throw error;
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
