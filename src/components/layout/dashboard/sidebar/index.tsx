import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardSidebarProps, MenuItem } from "./types";
import { DEFAULT_MENU_ITEMS } from "./Constant";
import SidebarMenuItem from "./SidebarMenuItem";
import BackToHomeButton from "./BackToHomeButton";
import { cn } from "../../../../libs/utils";

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  ordersCount = 0,
  favoritesCount = 0,
  onBackToHome,
  className = "",
  customMenuItems,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = useMemo<MenuItem[]>(() => {
    if (customMenuItems) {
      return customMenuItems;
    }
    return DEFAULT_MENU_ITEMS(ordersCount).map((item) => {
      if (item.path === "/dashboard/favorites") {
        return { ...item, badgeCount: favoritesCount };
      }
      return item;
    });
  }, [customMenuItems, ordersCount, favoritesCount]);

  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      navigate("/");
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <aside
      className={cn(
        "w-64 bg-white shadow-sm h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto",
        className
      )}
    >
      <div className="p-6">
        {/* Back to Home Button - hanya tampil jika ada onBackToHome */}
        {onBackToHome && (
          <BackToHomeButton onClick={handleBackToHome} />
        )}

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <SidebarMenuItem
                key={item.label}
                item={item}
                isActive={isActive}
                onClick={() => handleNavigate(item.path)}
              />
            );
          })}
        </nav>

        {/* Optional Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Velveta Dashboard v1.0
          </p>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;