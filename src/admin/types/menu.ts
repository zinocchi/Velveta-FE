// src/types/menu.ts

/**
 * Menu model from backend
 */
export interface Menu {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string | null;
  image?: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Menu filters for API requests
 */
export interface MenuFilters {
  search: string;
  category: string;
  stock_status?: 'low' | 'out' | 'available';
  sort_field?: string;
  sort_direction?: 'asc' | 'desc';
}

/**
 * Menu form data for create/update
 */
export interface MenuFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: File | null;
  is_available: boolean;
}

/**
 * Create menu request
 */
export interface CreateMenuRequest {
  name: string;
  price: number;
  category: string;
  description?: string;
  stock: number;
  image?: File;
  is_available?: boolean;
}

/**
 * Update menu request
 */
export interface UpdateMenuRequest extends Partial<CreateMenuRequest> {
  id: number;
}

/**
 * Stock update request
 */
export interface UpdateStockRequest {
  stock: number;
  operation?: 'set' | 'add' | 'subtract';
}

/**
 * Bulk stock update item
 */
export interface BulkStockItem {
  id: number;
  stock: number;
  operation?: 'set' | 'add' | 'subtract';
}

/**
 * Low stock item
 */
export interface LowStockItem extends Menu {
  stock_status: 'low' | 'out';
}

/**
 * Stock statistics
 */
export interface StockStats {
  total_items: number;
  low_stock: number;
  out_of_stock: number;
  available_items: number;
  items: {
    low_stock: LowStockItem[];
    out_of_stock: LowStockItem[];
  };
}

/**
 * Menu category from backend
 */
export interface MenuCategory {
  id: string;
  name: string;
  slug?: string;
  description: string;
  image: string;
  route: string;
}

/**
 * Menu item for cart
 */
export interface CartItem {
  id: number;
  menu_id: number;
  name: string;
  price: number;
  qty: number;
  image_url: string | null;
  stock: number;
  subtotal: number;
}