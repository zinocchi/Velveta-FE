import api from "../services/api/config";
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
      const response = await api.get<ApiResponse<Menu[]>>(`/menu${queryString}`);
      
      return response.data.data || response.data;
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
    return response.data.data || response.data;
  }

  /**
   * Get all unique categories
   */
  async getCategories(): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>('/menu/categories');
    return response.data.data || response.data;
  }

  /**
   * Get menus by category
   */
  async getByCategory(category: string): Promise<Menu[]> {
    return this.getAll({ category });
  }
}

export const menuService = new MenuService();