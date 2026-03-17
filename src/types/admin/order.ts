// src/types/admin/order.ts

import type { Order, OrderStatus, OrderItem, ShippingAddress } from '../order';

/**
 * Admin order detail
 */
export interface AdminOrder extends Order {
  user: {
    id: number;
    username: string;
    email: string;
    phone?: string;
  };
  items: (OrderItem & {
    menu: {
      name: string;
      image_url: string | null;
      category: string;
    };
  })[];
  shipping_address: ShippingAddress | null;
}

/**
 * Update order status request
 */
export interface UpdateOrderStatusRequest {
  status: OrderStatus | string;
}

/**
 * Bulk update order status request
 */
export interface BulkUpdateOrderStatusRequest {
  order_ids: number[];
  status: OrderStatus | string;
}

/**
 * Order filter options
 */
export interface OrderFilterOptions {
  status?: OrderStatus | string;
  date_from?: string;
  date_to?: string;
  delivery_type?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

/**
 * Order statistics
 */
export interface OrderStatistics {
  total_orders: number;
  pending_orders: number;
  processing_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  today_orders: number;
  today_revenue: number;
  total_revenue: number;
  average_order_value: number;
  orders_by_delivery?: {
    delivery: number;
    pickup: number;
  };
}

/**
 * Order summary for lists
 */
export interface AdminOrderSummary {
  id: number;
  order_number: string;
  customer_name: string;
  total_price: number;
  status: OrderStatus | string;
  delivery_type: string;
  created_at: string;
  item_count: number;
}