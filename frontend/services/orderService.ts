import api from "./apiClient";
import type { Order } from "./types";

export const createOrder = async (payload: {
  products: { product: string; quantity: number; price: number }[];
  totalPrice: number;
  address: string;
  paymentMethod: "cod" | "card" | "upi";
  razorpayOrderId?: string;
}) => {
  const res = await api.post<Order>("/orders", payload);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get<Order[]>("/orders/me");
  return res.data;
};

