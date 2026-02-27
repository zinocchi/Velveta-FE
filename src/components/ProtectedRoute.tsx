import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState, type JSX } from "react";

const ProtectedRoute = ({ children }: { children?: JSX.Element }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsChecking(false);
  }, []);

    if (isChecking) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-gray-600 text-sm animate-pulse">Checking access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
