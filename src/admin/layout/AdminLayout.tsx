import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './components/AdminNavbar';
import AdminSidebar from './components/AdminSidebar';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f0f1f3]">
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-64 mt-16 p-6 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;