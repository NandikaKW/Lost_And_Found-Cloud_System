import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as loginApi, register as registerApi } from "../api/users";

const AuthContext = createContext(null);
const STORAGE_KEY = "findback.session";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  async function login(email, password) {
    setLoading(true);
    setError("");
    try {
      const res = await loginApi(email, password);
      const session = { id: res.id, email: res.email, role: res.role };
      setUser(session);
      return session;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  async function register(fields) {
    setLoading(true);
    setError("");
    try {
      await registerApi(fields);
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isAdmin: user?.role?.toLowerCase() === "admin",
      loading,
      error,
      setError,
      login,
      register,
      logout,
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
