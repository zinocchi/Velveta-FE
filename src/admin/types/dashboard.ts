export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  day_name?: string;
}

export interface PopularMenu {
  id: number;
  name: string;
  total_sold: number;
  image: string | null;
}

export interface RecentOrder {
  id: number;
  order_number: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  total_price: number;
  created_at: string;
  user: {
    name: string;
  };
  items: any[];
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalMenu: number;
  totalUsers: number;
  todayOrders: number;
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