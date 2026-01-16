import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  fullname?: string;
  email?: string;
  avatar?: string;
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
      setIsLoggedIn(true);
      setUser(JSON.parse(usr));
    }
  }, []);

  // EXPORT setIsLoggedIn juga
  const updateIsLoggedIn = useCallback((status: boolean) => {
    setIsLoggedIn(status);
  }, []);

  /** LOGIN FUNCTION */
  const login = useCallback(
    async (loginInput: string, password: string) => {
      setLoading(true);
      setError("");

      try {
        const res = await api.post("/login", {
          login: loginInput,
          password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setUser(res.data.user);
        setIsLoggedIn(true); // Jangan lupa ini

        return {
          success: true,
          user: res.data.user,
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

  /** LOGOUT FUNCTION */
  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch (_) {}

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setIsLoggedIn(false); // Jangan lupa ini

    navigate("/login");
  }, [navigate]);

  return {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn: updateIsLoggedIn, // Export setIsLoggedIn
    login,
    logout,
    loading,
    error,
  };
};