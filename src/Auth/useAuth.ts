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

  /** Load user from localStorage on app start */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const usr = localStorage.getItem("user");

    if (token && usr) {
      setIsLoggedIn(true);
      setUser(JSON.parse(usr));
    }
  }, []);

  /** LOGIN FUNCTION */
  const login = useCallback(async (loginInput: string, password: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/login", { login: loginInput, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);
      setIsLoggedIn(true);

      navigate("/"); // redirect DI SINI
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Login gagal");
    }
    finally {
      setLoading(false);
    }
  }, [navigate]);

  /** LOGOUT FUNCTION */
  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setIsLoggedIn(false);

    navigate("/login");
  }, [navigate]);

  return {
    user,
    isLoggedIn,
    login,
    logout,
    loading,
    error
  };
};
