"use client";

import { useEffect, useState } from "react";
import { getAdminUsers } from "../../../services/adminService";
import type { User } from "../../../services/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadUsers = async () => {
    if (!token) return;
    try {
      const usersData = await getAdminUsers(token);
      setUsers(usersData);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getRoleBadgeClass = (role: string) => {
    return role === "admin" ? "bg-danger" : "bg-primary";
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Users Management</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={loadUsers}>
            <i className="bi bi-arrow-clockwise me-2"></i>Refresh
          </button>
        </div>
      </div>

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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: "40px", height: "40px" }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{user.name}</strong>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted">
                        {new Date(parseInt(user._id.substring(0, 8), 16) * 1000).toLocaleDateString()}
                      </small>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          alert(`User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nID: ${user._id}`);
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
          {users.length === 0 && (
            <div className="text-center text-muted py-4">
              No users found yet.
            </div>
          )}
        </div>
      </div>

      {users.length > 0 && (
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-primary">{users.length}</h5>
                <p className="card-text">Total Users</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-success">
                  {users.filter(u => u.role === 'user').length}
                </h5>
                <p className="card-text">Customers</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-danger">
                  {users.filter(u => u.role === 'admin').length}
                </h5>
                <p className="card-text">Admins</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
