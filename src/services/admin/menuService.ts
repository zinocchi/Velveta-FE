// src/services/admin/menu.service.ts

import { apiClient } from '../api/config';
import { API_ENDPOINTS } from '../api/endpoint';
import { ApiResponse, Menu, type MenuFilters } from '../../types';
import { 
  type CreateMenuRequest, 
  type UpdateMenuRequest, 
  type UpdateStockRequest,
  type BulkStockItem,
  type StockStats 
} from '../../types/admin';

class AdminMenuService {
  /**
   * Get all menus with filters
   */
  async getAll(filters?: MenuFilters): Promise<Menu[]> {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.stock_status) params.append('stock_status', filters.stock_status);
    if (filters?.sort_field) params.append('sort_field', filters.sort_field);
    if (filters?.sort_direction) params.append('sort_direction', filters.sort_direction);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient.get<ApiResponse<Menu[]>>(
      `${API_ENDPOINTS.ADMIN_MENU.LIST}${queryString}`
    );
    
    return response.data;
  }

  /**
   * Get single menu
   */
  async getById(id: number): Promise<Menu> {
    const response = await apiClient.get<ApiResponse<Menu>>(
      API_ENDPOINTS.ADMIN_MENU.DETAIL(id)
    );
    return response.data;
  }

  /**
   * Create new menu
   */
  async create(data: CreateMenuRequest): Promise<Menu> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await apiClient.post<ApiResponse<Menu>>(
      API_ENDPOINTS.ADMIN_MENU.CREATE,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return response.data;
  }

  /**
   * Update menu
   */
  async update(id: number, data: UpdateMenuRequest): Promise<Menu> {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'id') {
        if (key === 'image' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await apiClient.post<ApiResponse<Menu>>(
      API_ENDPOINTS.ADMIN_MENU.UPDATE(id),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return response.data;
  }

  /**
   * Delete menu
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.ADMIN_MENU.DELETE(id)
    );
  }

  /**
   * Update stock
   */
  async updateStock(id: number, data: UpdateStockRequest): Promise<Menu> {
    const response = await apiClient.put<ApiResponse<Menu>>(
      API_ENDPOINTS.ADMIN_MENU.UPDATE_STOCK(id),
      data
    );
    return response.data;
  }

  /**
   * Bulk update stock
   */
  async bulkUpdateStock(items: BulkStockItem[]): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>(
      API_ENDPOINTS.ADMIN_MENU.BULK_UPDATE_STOCK,
      { items }
    );
    return response.data;
  }

  /**
   * Toggle menu availability
   */
  async toggleAvailability(id: number): Promise<{ is_available: boolean }> {
    const response = await apiClient.patch<ApiResponse<any>>(
      API_ENDPOINTS.ADMIN_MENU.TOGGLE_AVAILABILITY(id)
    );
    return response.data;
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>(
      API_ENDPOINTS.ADMIN_MENU.CATEGORIES
    );
    return response.data;
  }

  /**
   * Get low stock items
   */
  async getLowStockItems(): Promise<StockStats> {
    const response = await apiClient.get<ApiResponse<StockStats>>(
      API_ENDPOINTS.ADMIN_MENU.LOW_STOCK
    );
    return response.data;
  }
}

export const adminMenuService = new AdminMenuService();