import { Menu } from './menu';

/**
 * Cart item for shopping cart
 */
export interface CartItem {
  menu_id: number;
  name: string;
  price: number;
  qty: number;
  image_url: string | null;
  stock: number;
  subtotal: number;
}

/**
 * Cart state
 */
export interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  shippingCost: number;
  total: number;
}

/**
 * Cart actions
 */
export interface CartActions {
  addItem: (menu: Menu, qty?: number) => void;
  removeItem: (menuId: number) => void;
  updateQuantity: (menuId: number, qty: number) => void;
  clearCart: () => void;
}