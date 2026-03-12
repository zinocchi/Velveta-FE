export interface Menu {
  id: number;
  name: string;
  price: number;
  category: string | null;
  image_url: string | null;
  stock: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface MenuFilters {
  category?: string;
  search?: string;
}