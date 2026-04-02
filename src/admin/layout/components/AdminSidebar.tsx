import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUtensils, 
  FaShoppingBag, 
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaClipboardList,
  FaChartLine,
  FaTags,
  FaBell,
  FaUserShield,
  FaBoxOpen,
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
  // {
  //   path: '/admin/users',
  //   label: 'Users',
  //   icon: <FaUsers className="w-5 h-5" />,
  // },
  // {
  //   path: '/admin/categories',
  //   label: 'Categories',
  //   icon: <FaTags className="w-5 h-5" />,
  // },
  // {
  //   path: '/admin/reports',
  //   label: 'Reports',
  //   icon: <FaChartLine className="w-5 h-5" />,
  // },
  // {
  //   path: '/admin/settings',
  //   label: 'Settings',
  //   icon: <FaCog className="w-5 h-5" />,
  // },
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

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-30 flex flex-col',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          'absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm',
          isCollapsed && 'rotate-180'
        )}
      >
        <FaChevronLeft className="w-3 h-3 text-gray-500" />
      </button>

      {/* User Info (when expanded) */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-700 font-semibold text-lg">
                {user?.username?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {user?.username || 'Admin'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'admin@velveta.com'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User Avatar (when collapsed) */}
      {isCollapsed && (
        <div className="flex justify-center py-4 border-b border-gray-100 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-700 font-semibold text-lg">
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
      <div className="p-3 border-t border-gray-100">
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
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mt-2',
            'text-gray-700 hover:bg-red-50 hover:text-red-700',
            isCollapsed && 'justify-center'
          )}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <FaSignOutAlt className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>

      {/* Version Info */}
      {!isCollapsed && (
        <div className="p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">Velveta Admin Panel v1.0</p>
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;