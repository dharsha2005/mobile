"use client";

import { useEffect, useState } from "react";
import { getAdminOrders } from "../../../services/adminService";
import type { Order } from "../../../services/types";
import { formatPrice } from "../../../utils/formatPrice";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: ""
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadOrders = async () => {
    if (!token) return;
    try {
      const ordersData = await getAdminOrders(token);
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrdersByDate();
  }, [orders, dateRange]);

  const filterOrdersByDate = () => {
    if (!dateRange.startDate && !dateRange.endDate) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter(order => {
      const orderDate = new Date(parseInt(order._id.substring(0, 8), 16) * 1000);
      const start = dateRange.startDate ? new Date(dateRange.startDate) : new Date(0);
      const end = dateRange.endDate ? new Date(dateRange.endDate + "T23:59:59") : new Date();
      
      return orderDate >= start && orderDate <= end;
    });

    setFilteredOrders(filtered);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-warning";
      case "processing":
        return "bg-info";
      case "shipped":
        return "bg-primary";
      case "delivered":
        return "bg-success";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const clearDateFilter = () => {
    setDateRange({ startDate: "", endDate: "" });
  };

  const getDeliveredOrdersInDateRange = () => {
    return filteredOrders.filter(order => 
      order.status.toLowerCase() === 'delivered'
    );
  };

  const getRevenueInDateRange = () => {
    return filteredOrders
      .filter(order => order.status.toLowerCase() === 'delivered')
      .reduce((sum, order) => sum + order.totalPrice, 0);
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading orders...</p>
      </div>
    );
  }

  const deliveredOrders = getDeliveredOrdersInDateRange();
  const totalRevenue = getRevenueInDateRange();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Orders Management</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={loadOrders}>
            <i className="bi bi-arrow-clockwise me-2"></i>Refresh
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-calendar-range me-2"></i>
            Filter Orders by Date Range
          </h5>
        </div>
        <div className="card-body">
          <div className="row align-items-end">
            <div className="col-md-3 mb-3">
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input
                type="date"
                id="startDate"
                className="form-control"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="endDate" className="form-label">End Date</label>
              <input
                type="date"
                id="endDate"
                className="form-control"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
            <div className="col-md-6 mb-3">
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-secondary"
                  onClick={clearDateFilter}
                  disabled={!dateRange.startDate && !dateRange.endDate}
                >
                  <i className="bi bi-x-circle me-2"></i>Clear Filter
                </button>
                {(dateRange.startDate || dateRange.endDate) && (
                  <div className="align-self-center">
                    <span className="badge bg-info">
                      {filteredOrders.length} orders found
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics for Date Range */}
      {(dateRange.startDate || dateRange.endDate) && (
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card bg-success text-white">
              <div className="card-body text-center">
                <h4 className="card-title">{deliveredOrders.length}</h4>
                <p className="card-text">Delivered Orders</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-primary text-white">
              <div className="card-body text-center">
                <h4 className="card-title">{formatPrice(totalRevenue)}</h4>
                <p className="card-text">Total Revenue</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-info text-white">
              <div className="card-body text-center">
                <h4 className="card-title">
                  {deliveredOrders.length > 0 ? formatPrice(totalRevenue / deliveredOrders.length) : formatPrice(0)}
                </h4>
                <p className="card-text">Average Order Value</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <span className="font-monospace">#{order._id.slice(-8)}</span>
                    </td>
                    <td>
                      <div>
                        <strong>{order.userId.name}</strong>
                        <br />
                        <small className="text-muted">{order.userId.email}</small>
                      </div>
                    </td>
                    <td>
                      {new Date(parseInt(order._id.substring(0, 8), 16) * 1000).toLocaleDateString()}
                    </td>
                    <td>
                      <span className="badge bg-info">
                        {order.products.length} {order.products.length === 1 ? "item" : "items"}
                      </span>
                    </td>
                    <td className="fw-bold">{formatPrice(order.totalPrice)}</td>
                    <td>
                      <span className="badge bg-outline-secondary">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          const items = order.products.map(item => 
                            `${item.quantity}x ${item.product.name} - ${formatPrice(item.price)}`
                          ).join('\n');
                          alert(`Order Details:\n\nCustomer: ${order.userId.name}\nEmail: ${order.userId.email}\nItems: ${order.products.length}\nTotal: ${formatPrice(order.totalPrice)}\nStatus: ${order.status}\nPayment: ${order.paymentMethod}\n\nOrder Items:\n${items}\n\nAddress: ${order.address}`);
                        }}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="text-center text-muted py-4">
              {dateRange.startDate || dateRange.endDate 
                ? "No orders found in the selected date range."
                : "No orders found yet. Orders will appear here when customers make purchases."
              }
            </div>
          )}
        </div>
      </div>

      {filteredOrders.length > 0 && (
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-primary">{filteredOrders.length}</h5>
                <p className="card-text">Total Orders</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-warning">
                  {filteredOrders.filter(o => o.status === 'pending').length}
                </h5>
                <p className="card-text">Pending</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-info">
                  {filteredOrders.filter(o => o.status === 'processing').length}
                </h5>
                <p className="card-text">Processing</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-success">
                  {formatPrice(filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0))}
                </h5>
                <p className="card-text">Total Revenue</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
