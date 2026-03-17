"use client";

import { useEffect, useState } from "react";
import { getAdminProducts, createProduct, updateProduct, deleteProduct, uploadProductImages } from "../../../services/adminService";
import { getCategories } from "../../../services/productService";
import type { Product } from "../../../services/types";
import type { Category } from "../../../services/types";
import { formatPrice } from "../../../utils/formatPrice";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    brand: "",
    stock: "",
    category: ""
  });
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadProducts = async () => {
    if (!token) return;
    try {
      const response = await getAdminProducts();
      setProducts(response.items || []);
      const cats = await getCategories();
      setCategories(cats);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        brand: formData.brand,
        stock: Number(formData.stock),
        category: formData.category
      };

      const newProduct = await createProduct(payload, token);
      setProducts((prev) => [newProduct, ...prev]);
      setFormData({ name: "", price: "", description: "", brand: "", stock: "", category: "" });
      setImageFiles(null);
      setImagePreviews([]);
      setShowCreateForm(false);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to create product");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImageFiles(files);
      
      // Create previews
      const previews = [];
      for (let i = 0; i < files.length; i++) {
        previews.push(URL.createObjectURL(files[i]));
      }
      setImagePreviews(previews);
    }
  };

  const clearImages = () => {
    setImageFiles(null);
    setImagePreviews([]);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id, token);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading products...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Products Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <i className="bi bi-plus-circle me-2"></i>Add New Product
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {showCreateForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Create New Product</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleCreateProduct}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Product Images</label>
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <small className="text-muted">You can upload multiple images for the product</small>
                  
                  {imagePreviews.length > 0 && (
                    <div className="mt-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted">Image Previews:</small>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={clearImages}>
                          <i className="bi bi-trash me-1"></i>Clear Images
                        </button>
                      </div>
                      <div className="d-flex gap-2 flex-wrap">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="position-relative">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              style={{ width: "100px", height: "100px", objectFit: "cover" }}
                              className="border rounded"
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                              onClick={() => {
                                const newPreviews = imagePreviews.filter((_, i) => i !== index);
                                setImagePreviews(newPreviews);
                                
                                if (imageFiles) {
                                  const newFiles = Array.from(imageFiles).filter((_, i) => i !== index);
                                  setImageFiles(newFiles.length > 0 ? newFiles as unknown as FileList : null);
                                }
                              }}
                              style={{ fontSize: "12px", padding: "2px 6px" }}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  Create Product
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          className="rounded"
                        />
                      ) : (
                        <div
                          className="bg-light rounded d-flex align-items-center justify-content-center"
                          style={{ width: "50px", height: "50px" }}
                        >
                          <span className="text-muted">No img</span>
                        </div>
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>{product.brand || "-"}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>
                      <span className={`badge ${product.stock > 0 ? "bg-success" : "bg-danger"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>{product.category?.name || "-"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => window.open(`/products/${product._id}`, '_blank')}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <div className="text-center text-muted py-4">
              No products found. Create your first product to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
