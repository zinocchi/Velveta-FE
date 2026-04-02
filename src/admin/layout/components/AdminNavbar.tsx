import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../../context/AuthContext';
import VelvetaLogo from '../../../assets/icon/velveta.jpeg';
import { FaBell, FaUserCircle } from 'react-icons/fa';

const AdminNavbar = () => {
  const { user } = useAuthContext();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <img src={VelvetaLogo} alt="Velveta" className="h-10 w-10 rounded-full" />
          <span className="font-bold text-xl text-gray-800 hidden md:inline">
            Admin Panel
          </span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="p-2 text-gray-500 hover:text-red-700 transition-colors relative">
            <FaBell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
              ) : (
                <FaUserCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800">{user?.username}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;