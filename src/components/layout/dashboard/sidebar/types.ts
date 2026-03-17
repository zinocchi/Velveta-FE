import { ReactNode } from "react";

export interface MenuItem {
  label: string;
  path: string;
  icon: ReactNode;
  hasBadge?: boolean;
  badgeCount?: number;
}

export interface DashboardSidebarProps {
  ordersCount?: number;
  favoritesCount?: number;
  onBackToHome?: () => void;
  className?: string;
  customMenuItems?: MenuItem[];
}

export interface SidebarMenuItemProps {
  item: MenuItem;
  isActive: boolean;
  onClick: () => void;
}