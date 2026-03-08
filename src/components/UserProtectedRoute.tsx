// components/UserProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const UserProtectedRoute = () => {
  console.log('👤 UserProtectedRoute checking...');
  const { user, loading, isLoggedIn } = useAuth();
  const token = localStorage.getItem("token");

  console.log('UserProtectedRoute - State:', { 
    token: !!token, 
    isLoggedIn, 
    user, 
    loading,
    role: user?.role 
  });

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-700"></div>
      </div>
    );
  }

  // Kalau tidak ada token atau belum login, redirect ke login user
  if (!token || !isLoggedIn || !user) {
    console.log('⛔ No token/user, redirecting to user login');
    return <Navigate to="/login" replace />;
  }

  // Kalau admin mencoba akses user route, redirect ke admin dashboard
  if (user.role === 'admin') {
    console.log('⛔ Admin trying to access user route, redirecting to admin dashboard');
    return <Navigate to="/admin/dashboard" replace />;
  }

  console.log('✅ User authenticated, rendering outlet');
  return <Outlet />;
};

export default UserProtectedRoute;