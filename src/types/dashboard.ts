import { Order } from './order';

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

export interface Order {
  id: number;
  order_number: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  total_price: number;
  payment_method: string;
  delivery_type: "delivery" | "pickup";
  created_at: string;
  items: OrderItem[];
}

export interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  favoriteDrink: string;
  favoriteCount: number;
  recentOrders: Order[];
  points?: number;
}

export interface DashboardState {
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
}