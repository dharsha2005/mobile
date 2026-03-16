import api from "./apiClient";
import type { Product } from "./types";

export type CartItem = {
  _id: string;
  product: Product;
  quantity: number;
};

export type Cart = {
  _id: string;
  items: CartItem[];
};

export const getCart = async () => {
  const res = await api.get<Cart>("/cart");
  return res.data;
};

export const addToCart = async (productId: string, quantity = 1) => {
  const res = await api.post<Cart>("/cart", { productId, quantity });
  return res.data;
};

export const updateCartItem = async (itemId: string, quantity: number) => {
  const res = await api.put<Cart>(`/cart/${itemId}`, { quantity });
  return res.data;
};

export const removeCartItem = async (itemId: string) => {
  const res = await api.delete<Cart>(`/cart/${itemId}`);
  return res.data;
};

