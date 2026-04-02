export interface Menu {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: File | null;
  is_available: boolean;
}

export interface MenuFilters {
  search: string;
  category: string;
  stock_status?: 'low' | 'out' | 'available';
  sort_field?: string;
  sort_direction?: 'asc' | 'desc';
}