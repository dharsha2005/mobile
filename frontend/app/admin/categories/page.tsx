"use client";

import { useEffect, useState } from "react";
import type { Category } from "../../../services/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: ""
  });
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create category");
      const newCategory = await response.json();
      setCategories((prev) => [newCategory, ...prev]);
      setFormData({ name: "", description: "", slug: "" });
      setShowCreateForm(false);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to create category");
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingCategory) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/category/${editingCategory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update category");
      const updatedCategory = await response.json();
      setCategories((prev) =>
        prev.map((cat) => (cat._id === updatedCategory._id ? updatedCategory : cat))
      );
      setFormData({ name: "", description: "", slug: "" });
      setEditingCategory(null);
      setShowCreateForm(false);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to update category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/category/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete category");
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete category");
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      slug: category.slug || ""
    });
    setShowCreateForm(true);
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading categories...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Categories Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: "", description: "", slug: "" });
            setShowCreateForm(!showCreateForm);
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>
          {editingCategory ? "Edit Category" : "Add New Category"}
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
            <h5 className="mb-0">
              {editingCategory ? "Edit Category" : "Create New Category"}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}>
              <div className="mb-3">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Slug (URL-friendly name)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g., smartphones, laptops"
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? "Update Category" : "Create Category"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingCategory(null);
                    setFormData({ name: "", description: "", slug: "" });
                  }}
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
                  <th>Name</th>
                  <th>Description</th>
                  <th>Slug</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td>
                      <strong>{category.name}</strong>
                    </td>
                    <td>
                      <span className="text-muted">
                        {category.description || "No description"}
                      </span>
                    </td>
                    <td>
                      <code className="text-muted">
                        {category.slug || "-"}
                      </code>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => startEdit(category)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteCategory(category._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {categories.length === 0 && (
            <div className="text-center text-muted py-4">
              No categories found. Create your first category to organize your products.
            </div>
          )}
        </div>
      </div>

      {categories.length > 0 && (
        <div className="card mt-4">
          <div className="card-body text-center">
            <h5 className="card-title text-primary">{categories.length}</h5>
            <p className="card-text">Total Categories</p>
          </div>
        </div>
      )}
    </div>
  );
}
