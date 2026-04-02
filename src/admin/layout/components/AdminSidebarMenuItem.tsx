import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../../libs/utils';

interface AdminSidebarMenuItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed?: boolean;
  onClick?: () => void;
}

const AdminSidebarMenuItem: React.FC<AdminSidebarMenuItemProps> = ({
  to,
  icon,
  label,
  isCollapsed = false,
  onClick,
}) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
          isActive
            ? 'bg-red-50 text-red-700'
            : 'text-gray-700 hover:bg-gray-100',
          isCollapsed && 'justify-center'
        )
      }
      title={isCollapsed ? label : undefined}
    >
      <span className="text-lg">{icon}</span>
      {!isCollapsed && <span className="font-medium">{label}</span>}
    </NavLink>
  );
};

export default AdminSidebarMenuItem;