import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useState } from "react";


type User = {
  id: number;
  name: string;
  email?: string;
  photo?: string;
};
export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (loginInput: string, password: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/login", { login: loginInput, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setLoading(false);
      return { success: true, user: res.data.user };
    } catch (err: unknown) {
      setLoading(false);
      type AxiosError = { response?: { data?: { message?: string } } };
      setError(
        err && typeof err === "object" && "response" in err
          ? ((err as AxiosError).response?.data?.message || "Login gagal")
          : "Login gagal"
      );
      return { success: false };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const target = e.target as typeof e.target & {
      login: { value: string };   // bisa email atau username
      password: { value: string };
    };
    
    const loginInput = target.login.value;
    const password = target.password.value;

    if (!loginInput || !password) {
      alert("Username/email dan password harus diisi");
      return;
    }

    try {
      const result = await login(loginInput, password);

      if (result.success) {
        console.log("Login berhasil:", result.user);
        navigate("/");   // redirect kalau sukses
      } else {
        console.log("Login gagal");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (e) {
      console.error(e);
    }
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const token = localStorage.getItem("token");

  const user: User | null = token ? JSON.parse(localStorage.getItem("user") || "null") : null;

  return {
    user,
    login,
    logout,
    handleSubmit,
    isAuthenticated: !!token,
    loading,
    error,
  };
}