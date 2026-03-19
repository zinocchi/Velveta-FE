import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

const AdminProtectedRoute = () => {
  console.log(' AdminProtectedRoute checking...');
  const { user, loading, isLoggedIn } = useAuth();
  const token = localStorage.getItem('token');
  
  console.log('AdminProtectedRoute - State:', { 
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
  
  if (!token || !isLoggedIn || !user) {
    console.log('⛔ No token/user, redirecting to admin login');
    return <Navigate to="/admin/login" replace />;
  }
  
  if (user.role !== 'admin') {
    console.log('⛔ Not admin, redirecting to admin login');
    return <Navigate to="/admin/login" replace />;
  }
  
  console.log('✅ Admin authenticated, rendering outlet');
  return <Outlet />;
};

export default AdminProtectedRoute;