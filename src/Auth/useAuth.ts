import api from "../api/axios";

export const login = async (login: string, password: string) => {
  const res = await api.post("/login", {
    login,
    password,
  });

  localStorage.setItem("token", res.data.token);
  return res.data.user;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
