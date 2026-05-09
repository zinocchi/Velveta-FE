import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from '../../../context/AuthContext';
import { FaBell, FaUserCircle } from 'react-icons/fa';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/admin/dashboard': {
    title: 'Store Overview',
    subtitle: "Here's how your store is performing today.",
  },
  '/admin/menus': {
    title: 'Menu Management',
    subtitle: 'Manage your coffee menu items and categories.',
  },
  '/admin/orders': {
    title: 'Orders',
    subtitle: 'Track and manage customer orders.',
  },
};

const AdminNavbar = () => {
  const { user } = useAuthContext();
  const location = useLocation();

  // Find the matching page title
  const currentPage = Object.entries(pageTitles).find(([path]) =>
    location.pathname.startsWith(path)
  );
  const { title, subtitle } = currentPage?.[1] || {
    title: 'Admin Panel',
    subtitle: 'Manage your store.',
  };

  return (
    <header className="fixed top-0 left-64 right-0 bg-white z-50 transition-all duration-300"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center justify-between px-8 py-4">
        {/* Page Title */}
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">{title}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <FaBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200"></div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-800">{user?.username || 'Admin'}</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
            <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center ring-2 ring-red-50">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <FaUserCircle className="w-6 h-6 text-red-500" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;