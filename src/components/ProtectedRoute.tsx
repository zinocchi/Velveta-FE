import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { LoadingPage } from "./ui/loading/LoadingPage";

interface UserProtectedRouteProps {
  redirectTo?: string;
}

const UserProtectedRoute: React.FC<UserProtectedRouteProps> = ({ 
  redirectTo = "/login" 
}) => {
  const { isLoggedIn, loading } = useAuthContext();

  if (loading) {
    return <LoadingPage message="Checking authentication..." fullScreen />;
  }

  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default UserProtectedRoute;