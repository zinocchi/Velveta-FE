// auth/useAuth.ts
import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  fullname?: string;
  email?: string;
  avatar?: string;
  role?: string;
};

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Mulai dengan true
  const [error, setError] = useState("");

  // Load user from localStorage
  useEffect(() => {
    const loadUser = () => {
      try {
        const token = localStorage.getItem("token");
        const usr = localStorage.getItem("user");

        console.log('Loading user from storage:', { token: !!token, usr: !!usr });

        if (token && usr) {
          const parsedUser = JSON.parse(usr);
          console.log('Parsed user:', parsedUser);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (e) {
        console.error("Failed to parse user from storage", e);
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Listen for storage changes (login di tab lain)
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  const login = useCallback(
    async (loginInput: string, password: string) => {
      setLoading(true);
      setError("");

      try {
        const res = await api.post("/login", {
          login: loginInput,
          password,
        });

        console.log("Login response:", res.data);

        const userData = {
          ...res.data.user,
          role: res.data.user.role || 'user'
        };

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);
        setIsLoggedIn(true);

        return {
          success: true,
          user: userData,
          token: res.data.token,
        };
      } catch (err: any) {
        console.error("Login error:", err);
        let errorMessage = "Login gagal";
        if (err.response?.data) {
          errorMessage = err.response.data.message || err.response.data.error || `Error ${err.response.status}`;
        }
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch (_) {}

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setIsLoggedIn(false);
    
    // Redirect berdasarkan role sebelumnya
    if (user?.role === 'admin') {
      navigate("/admin/login");
    } else {
      navigate("/login");
    }
  }, [navigate, user]);

  return {
    user,
    setUser,
    isLoggedIn,
    login,
    logout,
    loading,
    error,
  };
};