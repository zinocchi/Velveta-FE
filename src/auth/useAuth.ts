import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  fullname?: string;
  email?: string;
  avatar?: string;
  role?: string;  // ← TAMBAHKAN INI!
};

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load user from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const usr = localStorage.getItem("user");

    if (token && usr) {
      try {
        const parsedUser = JSON.parse(usr);
        console.log("Loaded user from storage:", parsedUser); // Debug
        setIsLoggedIn(true);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user from storage", e);
      }
    }
  }, []);

  const updateIsLoggedIn = useCallback((status: boolean) => {
    setIsLoggedIn(status);
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

        console.log("Login response:", res.data); // Debug

        // Pastikan role dari response tersimpan
        const userData = {
          ...res.data.user,
          role: res.data.user.role || 'user' // Default 'user' kalau tidak ada
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
        let errorMessage = "Login gagal";

        if (err.response?.data) {
          errorMessage =
            err.response.data.message ||
            err.response.data.error ||
            `Error ${err.response.status}`;
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

    navigate("/login");
  }, [navigate]);

  return {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn: updateIsLoggedIn,
    login,
    logout,
    loading,
    error,
  };
};