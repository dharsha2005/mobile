"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProducts, getCategories, type ProductQuery } from "../services/productService";
import type { Product, Category } from "../services/types";
import ProductGrid from "./ProductGrid";
import FilterSidebar, { type FilterState } from "./FilterSidebar";

export default function ProductListPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    sort: "newest"
  });
  const [search, setSearch] = useState("");

  const loadProducts = async (overrides?: Partial<FilterState> & { search?: string }) => {
    const current: FilterState = { ...filters, ...(overrides || {}) };
    const query: ProductQuery = {
      search: overrides?.search ?? search,
      category: current.category,
      brand: current.brand,
      minPrice: current.minPrice,
      maxPrice: current.maxPrice,
      rating: current.rating,
      inStock: current.inStock,
      sort: current.sort
    };
    const data = await getProducts(query);
    setProducts(data.items || []);
  };

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const initialSearch = searchParams.get("search") || "";
    setSearch(initialSearch);
    loadProducts({ search: initialSearch }).catch(() => setProducts([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="container">
      <h1 className="mb-4">All Products</h1>
      <div className="row g-3">
        <div className="col-md-3">
          <FilterSidebar
            categories={categories}
            value={filters}
            onChange={(next) => {
              setFilters(next);
              loadProducts(next).catch(() => setProducts([]));
            }}
          />
        </div>
        <div className="col-md-9">
          <div className="d-flex mb-3">
            <input
              className="form-control"
              placeholder="Search gadgets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  loadProducts({ search: e.currentTarget.value }).catch(() =>
                    setProducts([])
                  );
                }
              }}
            />
          </div>
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}

