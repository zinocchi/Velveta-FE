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
          'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative',
          'hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50',
          'hover:shadow-md hover:shadow-red-200/30',
          'transform hover:-translate-y-0.5',
          isCollapsed && 'justify-center',
          isActive
            ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 text-red-600 shadow-sm shadow-red-200/30 border border-red-200/30'
            : 'text-gray-600 hover:text-red-600'
        )
      }
      title={isCollapsed ? label : undefined}
    >
      {({ isActive }) => (
        <>
          {/* Active indicator */}
          {isActive && !isCollapsed && (
            <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-r-full shadow-sm shadow-red-500/30" />
          )}
          
          {/* Icon container */}
          <div
            className={cn(
              'transition-all duration-300',
              isActive && 'text-red-600 scale-110'
            )}
          >
            {icon}
          </div>
          
          {/* Label */}
          {!isCollapsed && (
            <span
              className={cn(
                'font-medium transition-all duration-300',
                isActive && 'text-red-600'
              )}
            >
              {label}
            </span>
          )}

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl z-50">
              {label}
              <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};

export default AdminSidebarMenuItem;