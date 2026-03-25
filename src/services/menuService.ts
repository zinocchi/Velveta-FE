// services/menuService.ts
import api from "./api/config";
import { Menu, MenuFilters } from "../types/menu";
import { ApiResponse } from "../types/api";

class MenuService {
  /**
   * Get all menus with optional filters
   */
  async getAll(filters?: MenuFilters): Promise<Menu[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.category) {
        params.append('category', filters.category);
      }
      
      if (filters?.search) {
        params.append('search', filters.search);
      }

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get<ApiResponse<Menu[]> | Menu[]>(`/menu${queryString}`);
      
      // Handle response structure yang mungkin berbeda
      // Response bisa berupa { data: [...] } atau langsung array
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        if (Array.isArray(response.data)) {
          return response.data;
        }
      }
      
      // Fallback
      return [];
    } catch (error) {
      console.error('Error fetching menus:', error);
      throw error;
    }
  }

  /**
   * Get menu by ID
   */
  async getById(id: number): Promise<Menu> {
    const response = await api.get<ApiResponse<Menu>>(`/menu/${id}`);
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    return response.data as unknown as Menu;
  }

  /**
   * Get all unique categories
   */
  async getCategories(): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>('/menu/categories');
    if (response.data && 'data' in response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return response.data as unknown as string[];
  }

  /**
   * Get menus by category
   */
  async getByCategory(category: string): Promise<Menu[]> {
    return this.getAll({ category });
  }
}

export const menuService = new MenuService();