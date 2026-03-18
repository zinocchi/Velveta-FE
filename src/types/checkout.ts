import { ReactNode } from 'react';

export type DeliveryType = 'delivery' | 'pickup';
export type PaymentStep = 'confirmation' | 'payment' | 'processing' | 'success';
export type PaymentMethod = 'credit_card' | 'e_wallet' | 'bank_transfer' | 'cash';
export type AddressType = 'home' | 'office' | 'other';

export interface Address {
  id: string;
  label: string;
  recipientName: string;
  phoneNumber: string;
  address: string;
  detail: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
  type: AddressType;
}

export interface AddressFormData {
  label: string;
  recipientName: string;
  phoneNumber: string;
  address: string;
  detail: string;
  city: string;
  postalCode: string;
  type: AddressType;
  isDefault: boolean;
}

export interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  estimateMinutes: { min: number; max: number };
  cost: number;
  icon: ReactNode;
}

export interface DeliveryEstimate {
  minMinutes: number;
  maxMinutes: number;
  timeRange: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image_url: string | null;
}

export interface OrderSummary {
  subtotal: number;
  shippingCost: number;
  total: number;
}

// Payment Types
export interface CardDetails {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
  saveCard: boolean;
}

export interface EWalletDetails {
  provider: string;
  phoneNumber: string;
}

export interface BankTransferDetails {
  bank: string;
  code?: string;
}

export interface PaymentDetails {
  method: PaymentMethod;
  details: CardDetails | EWalletDetails | BankTransferDetails | null;
}

// API Response Types
export interface PaymentMethodFromAPI {
  id: number;
  code: string;
  name: string;
  icon: string;
  description: string;
  settings: any;
  display_order: number;
  is_active: boolean;
  providers?: EWalletProvider[];
  banks?: Bank[];
}

export interface EWalletProvider {
  id: number;
  code: string;
  name: string;
  icon: string;
  settings: any;
  display_order: number;
  is_active: boolean;
}

export interface Bank {
  id: number;
  code: string;
  name: string;
  icon: string;
  accounts: BankAccount[];
  settings: any;
  display_order: number;
  is_active: boolean;
}

export interface BankAccount {
  account_number: string;
  account_name: string;
  branch: string;
}

export interface OrderPayload {
  items: { id: number; qty: number }[];
  delivery_type: DeliveryType;
  shipping_address: any | null;
  delivery_option: any | null;
  payment_method: string;
  shipping_cost: number;
  total: number;
  payment_details?: any;
}