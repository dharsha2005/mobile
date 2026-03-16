"use client";

import { useState } from "react";
import { login, register, loginWithGoogle } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login: setAuthUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (mode === "login") {
        const res = await login({ email, password });
        localStorage.setItem("token", res.token);
        setAuthUser(res.token);
        if (res.user && res.user.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      } else {
        const res = await register({ name, email, password });
        localStorage.setItem("token", res.token);
        setAuthUser(res.token);
        window.location.href = "/";
      }
    } catch (err: any) {
      const data = err?.response?.data;
      const message =
        data?.message ||
        (Array.isArray(data?.errors) ? data.errors[0]?.msg : undefined) ||
        "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-gradient-primary d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            {/* Login Card */}
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                {/* Logo and Title */}
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <i className="bi bi-shop text-primary" style={{ fontSize: "3rem" }}></i>
                  </div>
                  <h2 className="fw-bold text-dark">
                    {mode === "login" ? "Welcome Back" : "Join Gadgetra"}
                  </h2>
                  <p className="text-muted">
                    {mode === "login" 
                      ? "Sign in to access your account and continue shopping"
                      : "Create an account to start your shopping journey"
                    }
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setError(null)}
                    ></button>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  {mode === "register" && (
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-person me-2"></i>Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-envelope me-2"></i>Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-lock me-2"></i>Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        {mode === "login" ? "Signing in..." : "Creating account..."}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        {mode === "login" ? "Sign In" : "Create Account"}
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="text-center mb-3">
                  <span className="text-muted">OR</span>
                </div>

                {/* Google Login */}
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg w-100 mb-4"
                  onClick={() => loginWithGoogle()}
                  disabled={loading}
                >
                  <i className="bi bi-google me-2"></i>
                  Continue with Google
                </button>

                {/* Switch Mode */}
                <div className="text-center">
                  <span className="text-muted">
                    {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                  </span>
                  <button
                    type="button"
                    className="btn btn-link text-primary text-decoration-none p-0 ms-1"
                    onClick={() => {
                      setMode(mode === "login" ? "register" : "login");
                      setError(null);
                      setName("");
                      setEmail("");
                      setPassword("");
                    }}
                  >
                    {mode === "login" ? "Sign up" : "Sign in"}
                  </button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="row mt-4">
              <div className="col-4 text-center">
                <i className="bi bi-shield-check text-success" style={{ fontSize: "2rem" }}></i>
                <h6 className="mt-2">Secure</h6>
                <small className="text-muted">Safe & encrypted</small>
              </div>
              <div className="col-4 text-center">
                <i className="bi bi-truck text-info" style={{ fontSize: "2rem" }}></i>
                <h6 className="mt-2">Fast Delivery</h6>
                <small className="text-muted">Quick shipping</small>
              </div>
              <div className="col-4 text-center">
                <i className="bi bi-headset text-warning" style={{ fontSize: "2rem" }}></i>
                <h6 className="mt-2">24/7 Support</h6>
                <small className="text-muted">Always here to help</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .card {
          border-radius: 1rem;
        }
        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        }
      `}</style>
    </div>
  );
}

