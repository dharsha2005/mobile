"use client";

import type { Category } from "../services/types";

export type FilterState = {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  sort?: "price_asc" | "price_desc" | "newest" | "top_rated";
};

export default function FilterSidebar({
  categories,
  value,
  onChange
}: {
  categories: Category[];
  value: FilterState;
  onChange: (next: FilterState) => void;
}) {
  const update = (patch: Partial<FilterState>) => onChange({ ...value, ...patch });

  return (
    <div className="border rounded p-3 mb-3 mb-md-0">
      <h5 className="mb-3">Filters</h5>

      <div className="mb-3">
        <label className="form-label">Category</label>
        <select
          className="form-select form-select-sm"
          value={value.category || ""}
          onChange={(e) => update({ category: e.target.value || undefined })}
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c._id} value={c.slug || c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Brand</label>
        <input
          className="form-control form-control-sm"
          placeholder="e.g. Apple"
          value={value.brand || ""}
          onChange={(e) => update({ brand: e.target.value || undefined })}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Price range</label>
        <div className="d-flex gap-2">
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="Min"
            value={value.minPrice ?? ""}
            onChange={(e) =>
              update({
                minPrice: e.target.value ? Number(e.target.value) : undefined
              })
            }
          />
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="Max"
            value={value.maxPrice ?? ""}
            onChange={(e) =>
              update({
                maxPrice: e.target.value ? Number(e.target.value) : undefined
              })
            }
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Minimum rating</label>
        <select
          className="form-select form-select-sm"
          value={value.rating ?? ""}
          onChange={(e) =>
            update({
              rating: e.target.value ? Number(e.target.value) : undefined
            })
          }
        >
          <option value="">Any</option>
          <option value="4">4★ & up</option>
          <option value="3">3★ & up</option>
          <option value="2">2★ & up</option>
          <option value="1">1★ & up</option>
        </select>
      </div>

      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="filter-instock"
          checked={!!value.inStock}
          onChange={(e) => update({ inStock: e.target.checked || undefined })}
        />
        <label className="form-check-label" htmlFor="filter-instock">
          In stock only
        </label>
      </div>

      <div className="mb-2">
        <label className="form-label">Sort by</label>
        <select
          className="form-select form-select-sm"
          value={value.sort || "newest"}
          onChange={(e) =>
            update({
              sort: (e.target.value || "newest") as FilterState["sort"]
            })
          }
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="top_rated">Top Rated</option>
        </select>
      </div>
    </div>
  );
}

