import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      localStorage.removeItem("user");

      if (
        !window.location.pathname.includes("/") &&
        !window.location.pathname.includes("/")
      ) {
        const isAdmin = window.location.pathname.startsWith("/");
        window.location.href = isAdmin ? "/admin/login" : "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
