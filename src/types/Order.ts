export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

/**
 * Delivery type enum
 */
export enum DeliveryType {
  DELIVERY = 'delivery',
  PICKUP = 'pickup'
}

/**
 * Order item model
 */
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
 * Order model from backend
 */
export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  total_price: number;
  payment_method: string;
  delivery_type: DeliveryType;
  created_at: string;
  items: OrderItem[];
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
  delivery_type: DeliveryType | string;
  shipping_cost: number;
  total: number;
  shipping_address?: ShippingAddress;
  notes?: string;
}