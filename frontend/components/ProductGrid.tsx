import ProductCard from "./ProductCard";
import type { Product } from "../services/types";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div className="row g-3">
      {products.map((p) => (
        <div key={p._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}

