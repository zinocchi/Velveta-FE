// src/admin/components/AdminProtectedRoute.enhanced.tsx

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { LoadingPage } from "../../components/ui/loading/LoadingPage";
import { Alert } from "../../components/ui/Alert";
import { useState, useEffect } from "react";

interface AdminProtectedRouteProps {
  redirectTo?: string;
  adminRedirectTo?: string;
  requiredPermission?: string | string[];
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  redirectTo = "/login",
  adminRedirectTo = "/",
  requiredPermission,
}) => {
  const { isLoggedIn, user, loading } = useAuthContext();
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        setAlertMessage("Please login to access this page");
        setShowAlert(true);
      } else if (user?.role !== "admin") {
        setAlertMessage("You don't have permission to access the admin area");
        setShowAlert(true);
      }
      
      const timer = setTimeout(() => setShowAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, isLoggedIn, user]);

  if (loading) {
    return <LoadingPage message="Checking admin authentication..." fullScreen />;
  }

  if (!isLoggedIn) {
    return (
      <>
        {showAlert && (
          <div className="fixed top-24 right-4 z-50 animate-slideIn">
            <Alert
              type="warning"
              message={alertMessage}
              dismissible
              onDismiss={() => setShowAlert(false)}
            />
          </div>
        )}
        <Navigate to={redirectTo} state={{ from: location }} replace />
      </>
    );
  }

  if (user?.role !== "admin") {
    return (
      <>
        {showAlert && (
          <div className="fixed top-24 right-4 z-50 animate-slideIn">
            <Alert
              type="error"
              message={alertMessage}
              dismissible
              onDismiss={() => setShowAlert(false)}
            />
          </div>
        )}
        <Navigate to={adminRedirectTo} replace />
      </>
    );
  }

  // Cek permission jika diperlukan (contoh untuk fitur lanjutan)
  if (requiredPermission) {
    const hasPermission = checkUserPermission(user, requiredPermission);
    if (!hasPermission) {
      return (
        <>
          <div className="fixed top-24 right-4 z-50 animate-slideIn">
            <Alert
              type="error"
              message="You don't have the required permissions"
              dismissible
            />
          </div>
          <Navigate to="/admin/dashboard" replace />
        </>
      );
    }
  }

  return <Outlet />;
};

// Helper function untuk cek permission (contoh)
const checkUserPermission = (user: any, required: string | string[]): boolean => {
  // Implementasi sesuai kebutuhan
  return true;
};

export default AdminProtectedRoute;