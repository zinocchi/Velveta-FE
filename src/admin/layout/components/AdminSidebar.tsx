import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaShoppingBag, 
  FaCoffee,
  FaUsers,
  FaChartLine,
  FaBullhorn,
  FaFileAlt,
  FaSignOutAlt,
  FaChevronLeft,
} from 'react-icons/fa';
import { useAuthContext } from '../../../context/AuthContext';
import { cn } from '../../../libs/utils';
import AdminSidebarMenuItem from './AdminSidebarMenuItem';
import VelvetaLogo from '../../../assets/icon/velveta.jpeg';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    path: '/admin/dashboard',
    label: 'Overview',
    icon: <FaTachometerAlt className="w-[18px] h-[18px]" />,
  },
  {
    path: '/admin/orders',
    label: 'Orders',
    icon: <FaShoppingBag className="w-[18px] h-[18px]" />,
  },
  {
    path: '/admin/menus',
    label: 'Products',
    icon: <FaCoffee className="w-[18px] h-[18px]" />,
  },
  // {
  //   path: '/admin/customers',
  //   label: 'Customers',
  //   icon: <FaUsers className="w-[18px] h-[18px]" />,
  // },
  // {
  //   path: '/admin/analytics',
  //   label: 'Analytics',
  //   icon: <FaChartLine className="w-[18px] h-[18px]" />,
  // },
  // {
  //   path: '/admin/marketing',
  //   label: 'Marketing',
  //   icon: <FaBullhorn className="w-[18px] h-[18px]" />,
  // },
  // {
  //   path: '/admin/reports',
  //   label: 'Reports',
  //   icon: <FaFileAlt className="w-[18px] h-[18px]" />,
  // },
];

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-white transition-all duration-300 z-40 flex flex-col',
        'border-r border-gray-100',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className={cn(
        'flex items-center gap-3 px-5 py-5 border-b border-gray-100',
        isCollapsed && 'justify-center px-3'
      )}>
        <img 
          src={VelvetaLogo} 
          alt="Velveta" 
          className="w-9 h-9 rounded-xl object-cover flex-shrink-0" 
        />
        {!isCollapsed && (
          <div className="min-w-0">
            <h2 className="font-bold text-gray-900 text-sm leading-tight truncate">Velveta Coffee</h2>
            <p className="text-[11px] text-gray-400 truncate">Admin</p>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          'flex items-center gap-2 mx-4 mt-4 mb-1 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors',
          isCollapsed && 'mx-2 justify-center'
        )}
      >
        <FaChevronLeft className={cn(
          'w-3 h-3 transition-transform duration-300',
          isCollapsed && 'rotate-180'
        )} />
        {!isCollapsed && <span className="text-xs font-medium">Collapse</span>}
      </button>

      {/* Menu Section Label */}
      {!isCollapsed && (
        <div className="px-5 mt-4 mb-2">
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.15em]">MENU</p>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
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
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200',
            'text-gray-400 hover:bg-red-50 hover:text-red-600',
            isCollapsed && 'justify-center'
          )}
          title={isCollapsed ? 'Keluar' : undefined}
        >
          <FaSignOutAlt className="w-[18px] h-[18px]" />
          {!isCollapsed && <span className="text-sm font-medium">Keluar</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
