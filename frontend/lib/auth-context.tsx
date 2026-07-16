"use client";

/**
 * Client auth state. The JWT lives in localStorage under `TOKEN_KEY`; on mount we
 * hydrate `user` by calling `/auth/me` with it (a stale/invalid token is dropped and
 * the app renders logged-out). `login`/`register` set the token then fetch the user;
 * `register` auto-logs-in. Consume via `useAuth()` inside `<AuthProvider>` (mounted in
 * the root layout). `loading` is true only during the initial hydrate — gate redirects
 * on it so a page doesn't bounce a logged-in user to /login before hydration finishes.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { api, ApiError } from "@/lib/api";
import type { User } from "@/lib/types";

export const TOKEN_KEY = "servelocal_token";

type RegisterInput = {
  email: string;
  password: string;
  full_name?: string;
  role?: string;
  dob?: string;
  guardian_name?: string;
  guardian_email?: string;
  turnstile_token?: string;
};

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me(token)
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { access_token } = await api.login({ email, password });
    localStorage.setItem(TOKEN_KEY, access_token);
    setUser(await api.me(access_token));
  }

  async function register(input: RegisterInput) {
    await api.register(input);
    await login(input.email, input.password);
  }

  async function refresh() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) setUser(await api.me(token));
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export { ApiError };
