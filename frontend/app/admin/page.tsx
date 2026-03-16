"use client";

import { useEffect, useState } from "react";
import { getAdminUsers, getAdminOrders, getAdminProducts } from "../../services/adminService";
import type { Order, User, Product } from "../../services/types";
import { formatPrice } from "../../utils/formatPrice";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadDashboardData = async () => {
    if (!token) return;
    try {
      const [usersData, ordersData, productsData] = await Promise.all([
        getAdminUsers(token),
        getAdminOrders(token),
        getAdminProducts()
      ]);
      setUsers(usersData);
      setOrders(ordersData);
      setProducts(productsData.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const recentOrders = orders.slice(0, 5);
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-outline-primary" onClick={loadDashboardData}>
          <i className="bi bi-arrow-clockwise me-2"></i>Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="card-title">{users.length}</h4>
                  <p className="card-text">Total Users</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-people fs-1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="card-title">{products.length}</h4>
                  <p className="card-text">Products</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-box fs-1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="card-title">{orders.length}</h4>
                  <p className="card-text">Total Orders</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-receipt fs-1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="card-title">{formatPrice(totalRevenue)}</h4>
                  <p className="card-text">Revenue</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-currency-rupee fs-1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders and Quick Actions */}
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Orders</h5>
              <a href="/admin/orders" className="btn btn-sm btn-outline-primary">View All</a>
            </div>
            <div className="card-body">
              {recentOrders.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order._id}>
                          <td><span className="font-monospace">#{order._id.slice(-6)}</span></td>
                          <td>{order.userId.name}</td>
                          <td>{formatPrice(order.totalPrice)}</td>
                          <td>
                            <span className={`badge bg-${
                              order.status === 'pending' ? 'warning' : 
                              order.status === 'processing' ? 'info' : 
                              order.status === 'delivered' ? 'success' : 'secondary'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center py-3">No recent orders</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <a href="/admin/products" className="btn btn-outline-primary">
                  <i className="bi bi-plus-circle me-2"></i>Add New Product
                </a>
                <a href="/admin/orders" className="btn btn-outline-warning">
                  <i className="bi bi-list-check me-2"></i>
                  {pendingOrders > 0 && (
                    <span className="badge bg-danger me-2">{pendingOrders}</span>
                  )}
                  Manage Orders
                </a>
                <a href="/admin/users" className="btn btn-outline-info">
                  <i className="bi bi-people me-2"></i>Manage Users
                </a>
                <a href="/admin/categories" className="btn btn-outline-secondary">
                  <i className="bi bi-tags me-2"></i>Manage Categories
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

