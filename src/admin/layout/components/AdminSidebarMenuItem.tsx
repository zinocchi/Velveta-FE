// AdminSidebarMenuItem.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../../libs/utils';

interface AdminSidebarMenuItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

const AdminSidebarMenuItem: React.FC<AdminSidebarMenuItemProps> = ({
  to,
  icon,
  label,
  isCollapsed,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative',
          isCollapsed && 'justify-center',
          isActive
            ? 'bg-red-50 text-red-600 font-medium'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
        )
      }
      title={isCollapsed ? label : undefined}
    >
      {({ isActive }) => (
        <>
          {/* Active left indicator */}
          {isActive && !isCollapsed && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-red-500 rounded-r-full" />
          )}
          
          {/* Icon */}
          <div className={cn(
            'transition-colors duration-200 flex-shrink-0',
            isActive ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-600'
          )}>
            {icon}
          </div>
          
          {/* Label */}
          {!isCollapsed && (
            <span className={cn(
              'text-sm transition-colors duration-200',
              isActive ? 'text-red-600 font-semibold' : 'font-medium'
            )}>
              {label}
            </span>
          )}

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">
              {label}
              <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45" />
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};

export default AdminSidebarMenuItem;