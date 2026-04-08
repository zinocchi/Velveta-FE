// src/types/order.ts

/**
 * Order status enum
 */
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

/**
 * Delivery type enum
 */
export type DeliveryType = 'delivery' | 'pickup';

/**
 * Payment method enum
 */
export type PaymentMethodType = 'credit_card' | 'e_wallet' | 'bank_transfer' | 'cash';

/**
 * Order status constants
 */
export const ORDER_STATUS = {
  PENDING: 'PENDING' as const,
  PROCESSING: 'PROCESSING' as const,
  COMPLETED: 'COMPLETED' as const,
  CANCELLED: 'CANCELLED' as const,
};

/**
 * Status configuration for UI
 */
export const STATUS_CONFIG: Record<OrderStatus, { color: string; bgColor: string; label: string }> = {
  PENDING: {
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    label: 'Pending',
  },
  PROCESSING: {
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    label: 'Processing',
  },
  COMPLETED: {
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    label: 'Completed',
  },
  CANCELLED: {
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    label: 'Cancelled',
  },
};

/**
 * Order item model
 */
export interface OrderItem {
  id: number;
  order_id?: number;
  menu_id: number;
  qty: number;
  price: number;
  subtotal?: number;
  menu: {
    id?: number;
    name: string;
    image_url: string | null;
    category?: string;
  };
}

/**
 * Shipping address
 */
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

/**
 * Payment details
 */
export interface PaymentDetails {
  card_last4?: string;
  card_brand?: string;
  provider?: string;
  phone?: string;
  bank?: string;
}

/**
 * Order model from backend
 */
export interface Order {
  id: number;
  order_number: string;
  user_id?: number;
  status: OrderStatus;
  total_price: number;
  payment_method: string;
  delivery_type: DeliveryType;
  shipping_cost: number;
  estimated_minutes?: number;
  estimated_ready_at?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  processing_at?: string;
  cancelled_at?: string;
  shipping_address?: ShippingAddress | null;
  user: {
    id: number;
    username: string;
    email: string;
    name?: string;
  };
  items: OrderItem[];
  payment_details?: PaymentDetails;
}

/**
 * Order filters
 */
export interface OrderFilters {
  status: string;
  search: string;
  date_from?: string;
  date_to?: string;
  delivery_type?: string;
}

/**
 * Bulk update data
 */
export interface BulkUpdateData {
  order_ids: number[];
  status: OrderStatus;
}

/**
 * Create order request
 */
export interface CreateOrderRequest {
  items: {
    id: number;
    qty: number;
  }[];
  payment_method: string;
  delivery_type: DeliveryType;
  shipping_cost: number;
  total: number;
  shipping_address?: ShippingAddress;
  notes?: string;
}

/**
 * Update order status request
 */
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

/**
 * Bulk update order status request
 */
export interface BulkUpdateOrderStatusRequest {
  order_ids: number[];
  status: OrderStatus;
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