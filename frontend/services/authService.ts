import api from "./apiClient";

export const register = async (payload: { name: string; email: string; password: string }) => {
  const res = await api.post("/auth/register", payload);
  return res.data;
};

export const login = async (payload: { email: string; password: string }) => {
  const res = await api.post("/auth/login", payload);
  return res.data;
};

export const loginWithGoogle = () => {
  // Construct Google OAuth URL
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
  const googleAuthUrl = `${base}/auth/google`;
  
  // Redirect to backend Google OAuth endpoint
  // This will initiate the OAuth flow and eventually redirect back to /auth/google/callback
  window.location.href = googleAuthUrl;
};

export const logout = () => {
  localStorage.removeItem("token");
};

