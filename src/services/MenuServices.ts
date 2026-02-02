import api from "../api/axios";
import { type Menu, type ApiResponse, type MenuFilters } from "../types/index";

const menuService = {
  /**
   * Get all menus with optional filters
   */
  async getAllMenu(filters?: MenuFilters): Promise<Menu[]> {
    try {
      const params = new URLSearchParams();

      if (filters?.category && filters.category !== "all") {
        params.append("category", filters.category);
      }  

      if (filters?.search) {
        params.append("search", filters.search);
      }

      const response = await api.get<ApiResponse<Menu[]>>(
        `/menu${params.toString() ? `?${params.toString()}` : ""}`,
      );

      return response.data.data;
    } catch (error) {
      console.error("Error fetching menus:", error);
      throw error;
    }
  },

  /**
   * Get single menu by ID
   */

  async getMenuById(id: number): Promise<Menu> {
    try {
      const response = await api.get<ApiResponse<Menu>>(`/menu/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching menu ${id}:`, error);
      throw error;
    }
  },

  async getMenuByCategory(category: string): Promise<Menu[]> {
    try {
      const response = await api.get<ApiResponse<Menu[]>>(
        `/menu?category=${category}`,
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching menu for category ${category}:`, error);
      throw error;
    }
  },

  /**
   * Get all unique categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const response =
        await api.get<ApiResponse<string[]>>("/menu/categories");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
};

export default menuService;
