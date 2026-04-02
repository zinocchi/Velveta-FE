// src/admin/layouts/components/AdminSidebar.tsx

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUtensils, 
  FaShoppingBag, 
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { useAuthContext } from '../../context/AuthContext';
import { cn } from '../../libs/utils';

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
  //   path: '/admin/settings',
  //   label: 'Settings',
  //   icon: <FaCog className="w-5 h-5" />,
  // },
];

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-30',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        {isCollapsed ? (
          <FaChevronRight className="w-3 h-3 text-gray-500" />
        ) : (
          <FaChevronLeft className="w-3 h-3 text-gray-500" />
        )}
      </button>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-red-50 text-red-700'
                  : 'text-gray-700 hover:bg-gray-100',
                isCollapsed && 'justify-center'
              )
            }
            title={isCollapsed ? item.label : undefined}
          >
            {item.icon}
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}

        {/* Divider */}
        <div className="my-4 border-t border-gray-200" />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-700 hover:bg-red-50 hover:text-red-700',
            isCollapsed && 'justify-center'
          )}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <FaSignOutAlt className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;