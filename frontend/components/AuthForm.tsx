"use client";

import { useState } from "react";
import { login, register, loginWithGoogle } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login: setAuthUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
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
      setError(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <h1 className="mb-4">{isLogin ? "Login" : "Create account"}</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-3">
        {!isLogin && (
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          {isLogin ? "Login" : "Sign up"}
        </button>
      </form>
      <button
        type="button"
        className="btn btn-outline-danger w-100"
        onClick={() => {
          loginWithGoogle();
        }}
      >
        Continue with Google
      </button>
    </div>
  );
}

