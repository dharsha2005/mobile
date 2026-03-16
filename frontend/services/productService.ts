import api from "./apiClient";
import type { Product, Category } from "./types";

export const getFeaturedProducts = async () => {
  const res = await api.get<{ items: Product[] }>("/products", {
    params: { limit: 8, sort: "top_rated" }
  });
  return res.data;
};

export type ProductQuery = {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  sort?: "price_asc" | "price_desc" | "newest" | "top_rated";
  page?: number;
  limit?: number;
};

export const getProducts = async (params: ProductQuery) => {
  const res = await api.get<{ items: Product[]; total: number }>("/products", {
    params: {
      ...params,
      inStock: params.inStock ? "true" : undefined
    }
  });
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await api.get<Product>(`/products/${id}`);
  return res.data;
};

export const searchProducts = async (query: string) => {
  const res = await api.get<Product[]>("/products/search", {
    params: { query }
  });
  return res.data;
};

export const getCategories = async () => {
  const res = await api.get<Category[]>("/categories");
  return res.data;
};

