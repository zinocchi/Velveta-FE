export interface Menu {
  id: number;
  name: string;
  price: number;
  category: string | null;
  image_url: string | null;
  stock: number;
  description: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Menu filters for API requests
 */
export interface MenuFilters {
  category?: string;
  search?: string;
  stock_status?: "low" | "out" | "available";
  sort_field?: string;
  sort_direction?: "asc" | "desc";
}

/**
 * Menu item for cart
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
export interface MenuState {
  items: Menu[];
  loading: boolean;
  error: string | null;
}

export interface GroupedCategories {
  [key: string]: Menu[];
}
