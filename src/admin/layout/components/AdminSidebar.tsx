import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUtensils, 
  FaShoppingBag, 
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaCrown,
} from 'react-icons/fa';
import { useAuthContext } from '../../../context/AuthContext';
import { cn } from '../../../libs/utils';
import AdminSidebarMenuItem from './AdminSidebarMenuItem';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    path: '/admin/dashboard',
    label: 'Dashboard',
    icon: <FaTachometerAlt className="w-5 h-5" />,
  },
  {
    path: '/admin/menus',
    label: 'Menu Management',
    icon: <FaUtensils className="w-5 h-5" />,
  },
  {
    path: '/admin/orders',
    label: 'Orders',
    icon: <FaShoppingBag className="w-5 h-5" />,
  },
];

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 z-30 flex flex-col',
        'bg-gradient-to-b from-white via-red-50/30 to-white',
        'backdrop-blur-xl shadow-2xl shadow-red-900/5',
        'border-r border-red-100/50',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-red-200/20 to-orange-200/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 -right-10 w-40 h-40 bg-gradient-to-tl from-red-300/10 to-pink-300/10 rounded-full blur-2xl" />
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          'absolute -right-3 top-6 w-7 h-7 rounded-full flex items-center justify-center',
          'bg-gradient-to-r from-red-500 to-red-600',
          'hover:from-red-600 hover:to-red-700',
          'shadow-lg shadow-red-500/30 hover:shadow-red-600/40',
          'transition-all duration-300 transform hover:scale-110',
          'border-2 border-white',
          isCollapsed && 'rotate-180'
        )}
      >
        <FaChevronLeft className="w-3 h-3 text-white" />
      </button>

      {/* Logo/Brand Section */}
      {!isCollapsed ? (
        <div className="p-5 border-b border-red-100/50 mb-2 relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <FaCrown className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Velveta
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-md opacity-50" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-lg">
                  {user?.username?.[0]?.toUpperCase() || 'A'}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">
                {user?.username || 'Admin'}
              </p>
              <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                {user?.email || 'admin@velveta.com'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center py-5 border-b border-red-100/50 mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-md opacity-50" />
            <div className="relative w-11 h-11 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-lg">
                {user?.username?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto relative">
        <div className={cn("mb-3", isCollapsed ? "px-1" : "px-3")}>
          {!isCollapsed && (
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Main Menu
            </span>
          )}
        </div>
        {menuItems.map((item) => (
          <AdminSidebarMenuItem
            key={item.path}
            to={item.path}
            icon={item.icon}
            label={item.label}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-red-100/50 relative">
        {/* Back to Website */}
        <AdminSidebarMenuItem
          to="/"
          icon={<FaHome className="w-5 h-5" />}
          label="Back to Website"
          isCollapsed={isCollapsed}
        />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
            'bg-gradient-to-r from-gray-50 to-red-50/50',
            'hover:from-red-50 hover:to-red-100',
            'border border-red-100/50 hover:border-red-200',
            'text-gray-700 hover:text-red-700',
            'shadow-sm hover:shadow-md hover:shadow-red-200/50',
            'transform hover:-translate-y-0.5',
            isCollapsed && 'justify-center'
          )}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <FaSignOutAlt className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>

      {/* Version Info */}
      {!isCollapsed && (
        <div className="p-4 text-center border-t border-red-100/50">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-50 to-orange-50 rounded-full border border-red-100/50">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <p className="text-xs font-medium text-gray-500">
              Velveta Admin <span className="text-red-600 font-semibold">v1.0</span>
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;