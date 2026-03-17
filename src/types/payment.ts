import { IconType } from 'react-icons';

/**
 * Payment method configuration type only
 */
export interface PaymentMethodConfig {
  id: string;
  label: string;
  icon: IconType;
  description: string;
  brands?: IconType[];
  minAmount?: number;
  maxAmount?: number;
  fee?: number;
  feeType?: 'fixed' | 'percentage';
}

/**
 * Payment transaction
 */
export interface PaymentTransaction {
  id: string;
  order_id: number;
  amount: number;
  method: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  reference?: string;
  paid_at?: string;
  created_at: string;
}

/**
 * Payment receipt
 */
export interface PaymentReceipt {
  transaction_id: string;
  order_number: string;
  amount: number;
  payment_method: string;
  paid_at: string;
  receipt_url?: string;
}