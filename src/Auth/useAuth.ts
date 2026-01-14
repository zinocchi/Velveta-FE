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
  const login = useCallback(
    async (loginInput: string, password: string) => {
      setLoading(true);
      setError("");

      try {
        console.log("Sending login request...");
        const res = await api.post("/login", {
          login: loginInput,
          password,
        });

        console.log("Login response:", res.data);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setUser(res.data.user);
        setIsLoggedIn(true);

        // Kembalikan data sukses - JANGAN redirect di sini
        return {
          success: true,
          user: res.data.user,
          token: res.data.token,
        };
      } catch (err: any) {
        console.log("Login error in useAuth:", err);

        let errorMessage = "Login gagal";

        // Cek berbagai format error
        if (err.response) {
          // Server responded with error
          if (err.response.data) {
            errorMessage =
              err.response.data.message ||
              err.response.data.error ||
              `Error ${err.response.status}: ${err.response.statusText}`;
          } else {
            errorMessage = `Error ${err.response.status}: ${err.response.statusText}`;
          }
        } else if (err.request) {
          // Request dibuat tapi tidak ada response
          errorMessage =
            "Tidak ada response dari server. Periksa koneksi internet.";
        } else if (err.message) {
          // Error lain
          errorMessage = err.message;
        }

        setError(errorMessage);

        // THROW ERROR agar bisa ditangkap di component
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [] // Tidak perlu navigate di dependencies
  );

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
    error,
  };
};
