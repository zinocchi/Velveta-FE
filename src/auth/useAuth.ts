import { useState, useEffect, useCallback, useRef } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Gunakan ref untuk menyimpan role saat logout
  const userRoleRef = useRef<string | undefined>(undefined);

  const isAdminPreview = user?.role === "admin";

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
          // Simpan role ke ref
          userRoleRef.current = parsedUser.role;
        } else {
          setUser(null);
          setIsLoggedIn(false);
          userRoleRef.current = undefined;
        }
      } catch (e) {
        console.error("Failed to parse user from storage", e);
        setUser(null);
        setIsLoggedIn(false);
        userRoleRef.current = undefined;
      } finally {
        setLoading(false);
      }
    };

    loadUser();

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
        userRoleRef.current = userData.role;

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

    // Simpan role sebelum dihapus
    const role = userRoleRef.current;
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setIsLoggedIn(false);
    userRoleRef.current = undefined;
    
    // Redirect berdasarkan role yang tersimpan di ref
    if (role === 'admin') {
      console.log('Logout admin, redirecting to /admin/login');
      navigate("/admin/login");
    } else {
      console.log('Logout user, redirecting to /login');
      navigate("/login");
    }
  }, [navigate]); // Hapus user dari dependency array

  return {
    user,
    setUser,
    isLoggedIn,
    login,
    logout,
    loading,
    error,
    isAdminPreview
  };
};