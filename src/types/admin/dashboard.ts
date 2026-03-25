import type { Order } from '../order';
import type { Menu } from '../menu';

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
 * Dashboard statistics
 */
export interface DashboardStats {
  // Overview
  totalOrders: number;
  totalRevenue: number;
  totalMenu: number;
  totalUsers: number;
  todayOrders: number;
  todayRevenue: number;
  
  // Order breakdown
  ordersByStatus: {
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
  };
  
  // Stock stats
  stockStats: {
    totalItems: number;
    lowStock: number;
    outOfStock: number;
    availableItems: number;
  };
  
  // Recent data
  recentOrders: Order[];
  popularMenus: PopularMenu[];
  revenueChart: RevenueData[];
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