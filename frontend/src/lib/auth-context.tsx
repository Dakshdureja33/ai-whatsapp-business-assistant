"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  company: string | null;
  role: string;
  avatar_url: string | null;
  created_at: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  company?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored auth on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("wa_token");
    const storedUser = localStorage.getItem("wa_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("wa_token");
        localStorage.removeItem("wa_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        return { success: false, error: err.detail || "Login failed" };
      }

      const data = await res.json();
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem("wa_token", data.access_token);
      localStorage.setItem("wa_user", JSON.stringify(data.user));
      return { success: true };
    } catch {
      // If backend is not running, use demo mode
      const demoUser: AuthUser = {
        id: "demo-user-001",
        email: email,
        full_name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        company: "TechStore Pro",
        role: "admin",
        avatar_url: null,
        created_at: new Date().toISOString(),
      };
      setToken("demo-token");
      setUser(demoUser);
      localStorage.setItem("wa_token", "demo-token");
      localStorage.setItem("wa_user", JSON.stringify(demoUser));
      return { success: true };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        return { success: false, error: err.detail || "Registration failed" };
      }

      const result = await res.json();
      setToken(result.access_token);
      setUser(result.user);
      localStorage.setItem("wa_token", result.access_token);
      localStorage.setItem("wa_user", JSON.stringify(result.user));
      return { success: true };
    } catch {
      // Demo mode fallback
      const demoUser: AuthUser = {
        id: "demo-user-001",
        email: data.email,
        full_name: data.full_name,
        company: data.company || null,
        role: "admin",
        avatar_url: null,
        created_at: new Date().toISOString(),
      };
      setToken("demo-token");
      setUser(demoUser);
      localStorage.setItem("wa_token", "demo-token");
      localStorage.setItem("wa_user", JSON.stringify(demoUser));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("wa_token");
    localStorage.removeItem("wa_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
