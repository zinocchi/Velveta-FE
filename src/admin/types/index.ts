// admin/types/index.ts
export interface OrderItem {
  id: number;
  menu_id: number;
  qty: number;
  price: number;
  menu: {
    name: string;
    image_url: string | null;
  };
}

export interface ShippingAddress {
  id?: number;
  recipient_name?: string;
  phone_number?: string;
  address?: string;
  detail?: string;
  city?: string;
  postal_code?: string;
  full_address?: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: "PROCESSING" | "COMPLETED" | "CANCELLED";
  total_price: number;
  payment_method: string;
  delivery_type: "delivery" | "pickup";
  shipping_cost: number;
  estimated_minutes?: number;
  created_at: string;
  shipping_address?: ShippingAddress | null;
  user: {
    id: number;
    username: string;
    email: string;
  };
  items: OrderItem[];
}

export interface Menu {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string | null;
  is_available: boolean;
  created_at: string;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  day_name?: string;
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
  recentOrders: Order[];
  popularMenus: {
    id: number;
    name: string;
    total_sold: number;
    image: string | null;
  }[];
  revenueChart: RevenueData[]; // Data untuk grafik
}

export interface MenuFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: File | null;
  is_available: boolean;
}