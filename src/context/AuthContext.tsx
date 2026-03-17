import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api/config";
import { User } from "../types/user";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoggedIn: boolean;
  login: (loginInput: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string;
  isAdminPreview: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userRoleRef = useRef<string | undefined>(undefined);

  const isLoggedIn = !!user;

  useEffect(() => {
    const loadUser = () => {
      try {
        const token = localStorage.getItem("token");
        const usr = localStorage.getItem("user");

        if (token && usr) {
          const parsedUser = JSON.parse(usr);
          setUser(parsedUser);
          userRoleRef.current = parsedUser.role;
        } else {
          setUser(null);
          userRoleRef.current = undefined;
        }
      } catch {
        setUser(null);
        userRoleRef.current = undefined;
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (loginInput: string, password: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/login", {
        login: loginInput,
        password,
      });

      const userData = {
        ...res.data.user,
        role: res.data.user.role || "user",
      };

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      userRoleRef.current = userData.role;

      return { success: true, user: userData };
    } catch (err: any) {
      const message = err.response?.data?.message || "Login gagal";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch {}

    const role = userRoleRef.current;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    userRoleRef.current = undefined;

    if (role === "admin") {
      navigate("/admin/login");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        login,
        logout,
        loading,
        error,
        isAdminPreview: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext harus dipakai di dalam AuthProvider");
  }
  return context;
};