import api from "./apiClient";

import type { Product, Order, User } from "./types";



export const getAdminUsers = async (token: string): Promise<User[]> => {

  const res = await api.get<User[]>("/admin/users", {

    headers: { Authorization: `Bearer ${token}` }

  });

  return res.data;

};



export const getAdminOrders = async (token: string): Promise<Order[]> => {

  const res = await api.get<Order[]>("/orders", {

    headers: { Authorization: `Bearer ${token}` }

  });

  return res.data;

};



export const getAdminProducts = async () => {

  const res = await api.get<{ items: Product[] }>("/products");

  return res.data;

};



export const createProduct = async (

  payload: { name: string; price: number },

  token: string

) => {

  const formData = new FormData();

  formData.append("name", payload.name);

  formData.append("price", String(payload.price));



  const res = await api.post<Product>("/products", formData, {

    headers: {

      Authorization: `Bearer ${token}`,

      "Content-Type": "multipart/form-data"

    }

  });

  return res.data;

};



export const deleteProduct = async (id: string, token: string) => {

  await api.delete(`/products/${id}`, {

    headers: { Authorization: `Bearer ${token}` }

  });

};



