"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "../services/apiClient";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Verify token and get user data
      api.get("/auth/me")
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          // Token invalid, remove it
          localStorage.removeItem("token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    // Get user data after login
    api.get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    // Instant redirect to login page
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
