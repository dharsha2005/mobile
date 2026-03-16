"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!loading && isClient) {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role !== "admin") {
          router.push("/");
          return;
        }
      } catch (err) {
        router.push("/login");
        return;
      }
    }
  }, [loading, isClient, router]);

  if (loading || !isClient) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const token = localStorage.getItem("token");
  let userRole = "user";
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userRole = payload.role;
    } catch (err) {
      userRole = "user";
    }
  }

  if (userRole !== "admin") {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h2>Access Denied</h2>
          <p>You do not have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Admin Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link href="/admin" className="navbar-brand">
            <i className="bi bi-gear me-2"></i>
            Gadgetra Admin
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link href="/admin" className="nav-link">
                  <i className="bi bi-speedometer2 me-2"></i>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-box me-2"></i>
                  Products
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link href="/admin/products" className="dropdown-item">
                      <i className="bi bi-list-ul me-2"></i>
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/products/new" className="dropdown-item">
                      <i className="bi bi-plus-circle me-2"></i>
                      Add Product
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link href="/admin/orders" className="nav-link">
                  <i className="bi bi-receipt me-2"></i>
                  Orders
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-tags me-2"></i>
                  Categories
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link href="/admin/categories" className="dropdown-item">
                      <i className="bi bi-list-ul me-2"></i>
                      All Categories
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/categories/new" className="dropdown-item">
                      <i className="bi bi-plus-circle me-2"></i>
                      Add Category
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link href="/admin/users" className="nav-link">
                  <i className="bi bi-people me-2"></i>
                  Users
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link href="/" className="nav-link">
                  <i className="bi bi-house me-2"></i>
                  Back to Store
                </Link>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                  }}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
            <div className="position-sticky">
              <div className="list-group list-group-flush">
                <Link href="/admin" className="list-group-item list-group-item-action">
                  <i className="bi bi-speedometer2 me-2"></i>
                  Dashboard
                </Link>
                <Link href="/admin/products" className="list-group-item list-group-item-action">
                  <i className="bi bi-box me-2"></i>
                  Products
                </Link>
                <Link href="/admin/orders" className="list-group-item list-group-item-action">
                  <i className="bi bi-receipt me-2"></i>
                  Orders
                </Link>
                <Link href="/admin/users" className="list-group-item list-group-item-action">
                  <i className="bi bi-people me-2"></i>
                  Users
                </Link>
                <Link href="/admin/categories" className="list-group-item list-group-item-action">
                  <i className="bi bi-tags me-2"></i>
                  Categories
                </Link>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="p-4">
              {children}
            </div>
          </main>
        </div>
      </div>

      <style jsx>{`
        .admin-layout {
          min-height: 100vh;
        }
        .sidebar {
          min-height: calc(100vh - 56px);
          padding-top: 1rem;
        }
        .position-sticky {
          position: sticky;
          top: 1rem;
        }
        .list-group-item {
          border: none;
          border-bottom: 1px solid #dee2e6;
          padding: 0.75rem 1rem;
        }
        .list-group-item:hover {
          background-color: #f8f9fa;
        }
        .list-group-item.active {
          background-color: #0d6efd;
          border-color: #0d6efd;
          color: white;
        }
        main {
          background-color: #f8f9fa;
          min-height: calc(100vh - 56px);
        }
      `}</style>
    </div>
  );
}
