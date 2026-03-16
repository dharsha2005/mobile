"use client";

import { useEffect, useState } from "react";
import { getFeaturedProducts } from "../services/productService";
import type { Product } from "../services/types";
import ProductCard from "./ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getFeaturedProducts()
      .then((data) => setProducts(data.items || []))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="container">
      <section className="bg-dark text-white p-5 rounded-3 mb-4">
        <div className="row align-items-center">
          <div className="col-md-7">
            <h1 className="display-5 fw-bold">Latest Electronic Gadgets</h1>
            <p className="lead mt-3">
              Shop smartphones, laptops, accessories and more with fast delivery and secure checkout.
            </p>
            <a href="/products" className="btn btn-primary btn-lg mt-3">
              Browse Products
            </a>
          </div>
        </div>
      </section>

      <h2 className="mb-3">Featured Products</h2>
      <div className="row g-3">
        {products.map((p) => (
          <div key={p._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <ProductCard product={p} />
          </div>
        ))}
        {products.length === 0 && <p>No featured products yet.</p>}
      </div>
    </div>
  );
}

