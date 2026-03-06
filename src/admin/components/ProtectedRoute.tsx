import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  if (!token || user?.role !== "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};
export default AdminProtectedRoute;
