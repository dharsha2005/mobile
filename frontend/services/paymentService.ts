import api from "./apiClient";

export const createStripePaymentIntent = async (payload: {
  amount: number;
  currency?: string;
  orderId: string;
}) => {
  const res = await api.post<{ clientSecret: string }>("/payments/stripe/intent", payload);
  return res.data;
};

export const createRazorpayOrder = async (payload: {
  amount: number;
  currency?: string;
  orderId: string;
}) => {
  const res = await api.post<{
    id: string;
    amount: number;
    currency: string;
  }>("/payments/razorpay/order", payload);
  return res.data;
};

export const markOrderPaid = async (orderId: string, provider: string) => {
  const res = await api.post(`/payments/orders/${orderId}/paid`, { provider });
  return res.data;
};

