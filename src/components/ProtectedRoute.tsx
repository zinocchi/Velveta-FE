import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const AdminProtectedRoute = () => {
  console.log('🔒 AdminProtectedRoute checking...');
  const { user, loading } = useAuth();
  
  console.log('User:', user);
  console.log('Loading:', loading);
  
  // Cek token di localStorage
  const token = localStorage.getItem('token');
  console.log('Token exists:', !!token);
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }
  
  // Kalau tidak ada token, redirect ke login
  if (!token) {
    console.log('⛔ No token, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }
  
  // Cek role admin
  if (!user || user.role !== 'admin') {
    console.log('⛔ Not admin, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }
  
  console.log('✅ Admin authenticated, rendering outlet');
  return <Outlet />;
};

export default AdminProtectedRoute;