import api from "../api/axios";

type User = {
  id: number;
  name: string;
  photo?: string;
};

export default function useAuth() {
  const token = localStorage.getItem("token");

  const login = async (login: string, password: string): Promise<User> => {
    const res = await api.post("/login", { login, password });
    localStorage.setItem("token", res.data.token);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return {
    user: token ? JSON.parse(localStorage.getItem("user") || "null") : null,
    login,
    logout,
    isAuthenticated: !!token,
  };
}
