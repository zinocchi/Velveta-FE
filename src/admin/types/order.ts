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

export interface PaymentDetails {
  card_last4?: string;
  card_brand?: string;
  provider?: string;
  phone?: string;
  bank?: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  total_price: number;
  payment_method: string;
  delivery_type: 'delivery' | 'pickup';
  shipping_cost: number;
  estimated_minutes?: number;
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
  };
  items: OrderItem[];
  payment_details?: PaymentDetails;
}

export interface OrderFilters {
  status: string;
  search: string;
}

export interface BulkUpdateData {
  order_ids: number[];
  status: string;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

export const ORDER_STATUS = {
  PENDING: 'PENDING' as const,
  PROCESSING: 'PROCESSING' as const,
  COMPLETED: 'COMPLETED' as const,
  CANCELLED: 'CANCELLED' as const,
};

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