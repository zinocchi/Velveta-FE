// src/services/admin/order.service.ts

import { apiClient } from '../api/config';
import { API_ENDPOINTS } from '../api/endpoint';
import { ApiResponse } from '../../types';
import { 
  type AdminOrder, 
  type OrderStatistics, 
  type UpdateOrderStatusRequest,
  type BulkUpdateOrderStatusRequest,
  type OrderFilterOptions,
  type AdminOrderSummary 
} from '../../types/admin';

class AdminOrderService {
  /**
   * Get all orders with filters
   */
  async getAll(filters?: OrderFilterOptions): Promise<AdminOrder[]> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);
    if (filters?.delivery_type) params.append('delivery_type', filters.delivery_type);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.per_page) params.append('per_page', String(filters.per_page));
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient.get<ApiResponse<AdminOrder[]>>(
      `${API_ENDPOINTS.ADMIN_ORDER.LIST}${queryString}`
    );
    
    return response.data;
  }

  /**
   * Get single order detail
   */
  async getById(id: number): Promise<AdminOrder> {
    const response = await apiClient.get<ApiResponse<AdminOrder>>(
      API_ENDPOINTS.ADMIN_ORDER.DETAIL(id)
    );
    return response.data;
  }

  /**
   * Update order status
   */
  async updateStatus(id: number, data: UpdateOrderStatusRequest): Promise<AdminOrder> {
    const response = await apiClient.put<ApiResponse<AdminOrder>>(
      API_ENDPOINTS.ADMIN_ORDER.UPDATE_STATUS(id),
      data
    );
    return response.data;
  }

  /**
   * Bulk update order status
   */
  async bulkUpdateStatus(data: BulkUpdateOrderStatusRequest): Promise<{
    updated_count: number;
    new_status: string;
  }> {
    const response = await apiClient.post<ApiResponse<any>>(
      API_ENDPOINTS.ADMIN_ORDER.BULK_STATUS,
      data
    );
    return response.data;
  }

  /**
   * Get order statistics
   */
  async getStatistics(): Promise<OrderStatistics> {
    const response = await apiClient.get<ApiResponse<OrderStatistics>>(
      API_ENDPOINTS.ADMIN_ORDER.STATISTICS
    );
    return response.data;
  }

  /**
   * Get recent orders
   */
  async getRecentOrders(): Promise<AdminOrderSummary[]> {
    const response = await apiClient.get<ApiResponse<AdminOrderSummary[]>>(
      API_ENDPOINTS.ADMIN_ORDER.RECENT
    );
    return response.data;
  }
}

export const adminOrderService = new AdminOrderService();