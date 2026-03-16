"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const { cartCount } = useCart();
  const [term, setTerm] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith("/admin");

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    router.push(`/products?search=${encodeURIComponent(q)}`);
  };

  if (loading) {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <div className="navbar-brand">Gadgetra</div>
          <div className="ms-auto">
            <div className="spinner-border spinner-border-sm text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="/">
          <i className="bi bi-cpu me-2"></i>
          Gadgetra
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/products">
                <i className="bi bi-box me-1"></i>
                Products
              </a>
            </li>
            {!isAdminRoute && (
              <li className="nav-item">
                <a className="nav-link position-relative" href="/cart">
                  <i className="bi bi-cart3 me-1"></i>
                  Cart
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                    </span>
                  )}
                </a>
              </li>
            )}
            {user?.role === "admin" && (
              <li className="nav-item">
                <a className="nav-link" href="/admin">
                  <i className="bi bi-gear me-1"></i>
                  Admin
                </a>
              </li>
            )}
          </ul>
          <form className="d-flex me-3" role="search" onSubmit={onSearchSubmit}>
            <input
              className="form-control form-control-sm me-2"
              type="search"
              placeholder="Search gadgets..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </form>
          <div className="d-flex gap-2 align-items-center">
            {user ? (
              <>
                <div className="text-light me-3 d-none d-md-block">
                  <small className="d-block">Welcome,</small>
                  <strong>{user.name}</strong>
                </div>
                <button
                  className="btn btn-outline-light btn-sm"
                  type="button"
                  onClick={logout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </button>
              </>
            ) : (
              <>
                <a className="btn btn-outline-light btn-sm" href="/login">
                  <i className="bi bi-person me-1"></i>
                  Login
                </a>
                <a className="btn btn-primary btn-sm" href="/register">
                  <i className="bi bi-person-plus me-1"></i>
                  Sign up
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
