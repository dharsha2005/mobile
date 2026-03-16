"use client";

import { useEffect, useState } from "react";
import {
  getAdminUsers,
  getAdminOrders,
  getAdminProducts,
  createProduct,
  deleteProduct
} from "../services/adminService";
import type { Product, Order, User } from "../services/types";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const ensureToken = () => {
    if (!token) {
      window.location.href = "/login";
      return false;
    }
    return true;
  };

  const loadData = async () => {
    if (!ensureToken()) return;
    try {
      const [u, o, p] = await Promise.all([
        getAdminUsers(token),
        getAdminOrders(token),
        getAdminProducts()
      ]);
      setUsers(u);
      setOrders(o);
      setProducts(p.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load admin data");
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureToken()) return;
    try {
      const product = await createProduct(
        { name, price: Number(price) || 0 },
        token as string
      );
      setProducts((prev) => [product, ...prev]);
      setName("");
      setPrice("");
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create product");
    }
  };

  const handleDelete = async (id: string) => {
    if (!ensureToken()) return;
    try {
      await deleteProduct(id, token as string);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="container">
      <h1 className="mb-4">Admin Dashboard</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Create Product (Quick)</h5>
              <form onSubmit={handleCreateProduct}>
                <div className="mb-2">
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Add Product
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <h3>Products</h3>
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <hr className="my-4" />

      <div className="row g-4">
        <div className="col-md-6">
          <h3>Users</h3>
          <ul className="list-group">
            {users.map((u) => (
              <li key={u._id} className="list-group-item d-flex justify-content-between">
                <span>
                  {u.name} ({u.email})
                </span>
                <span className="badge bg-secondary">{u.role}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h3>Recent Orders</h3>
          <ul className="list-group">
            {orders.map((o) => (
              <li key={o._id} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <span>Order #{o._id.slice(-6)}</span>
                  <span className="badge bg-info text-dark">{o.status}</span>
                </div>
                <div className="small">
                  <div className="text-muted">
                    Customer: {o.userId?.email || "unknown"}
                  </div>
                  <div className="text-muted">
                    Total: ${o.totalPrice.toFixed(2)} • {o.products.length} items
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

