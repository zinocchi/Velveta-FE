// src/types/dashboard.ts

import { Order } from './order';
import { Menu } from './menu';

/**
 * Revenue chart data
 */
export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  day_name?: string;
}

/**
 * Popular menu item
 */
export interface PopularMenu {
  id: number;
  name: string;
  total_sold: number;
  image: string | null;
}

/**
 * Recent order for dashboard
 */
export interface RecentOrder {
  id: number;
  order_number: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  total_price: number;
  created_at: string;
  user: {
    name: string;
    username?: string;
  };
  items: any[];
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalMenu: number;
  totalUsers: number;
  todayOrders: number;
  todayRevenue?: number;
  ordersByStatus: {
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
  };
  stockStats: {
    totalItems: number;
    lowStock: number;
    outOfStock: number;
    availableItems: number;
  };
  popularMenus: PopularMenu[];
  recentOrders: RecentOrder[];
}

/**
 * Revenue report request
 */
export interface RevenueReportRequest {
  start_date: string;
  end_date: string;
  group_by?: 'day' | 'week' | 'month';
}

/**
 * Revenue report response
 */
export interface RevenueReportResponse {
  summary: {
    total_revenue: number;
    total_orders: number;
    average_order: number;
    period: {
      start: string;
      end: string;
    };
  };
  chart_data: RevenueData[];
}