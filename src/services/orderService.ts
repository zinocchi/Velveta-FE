// src/services/order.service.ts

import { apiClient } from './api/config';
import { API_ENDPOINTS } from './api/endpoint';
import { ApiResponse, Order, type CreateOrderRequest } from '../types';

class OrderService {
  /**
   * Get user's orders
   */
  async getUserOrders(): Promise<Order[]> {
    const response = await apiClient.get<ApiResponse<Order[]>>(
      API_ENDPOINTS.ORDERS.MY_ORDERS
    );
    return response.data;
  }

  /**
   * Get all orders (with auth)
   */
  async getAll(): Promise<Order[]> {
    const response = await apiClient.get<ApiResponse<Order[]>>(
      API_ENDPOINTS.ORDERS.LIST
    );
    return response.data;
  }

  /**
   * Get single order by ID
   */
  async getById(id: number): Promise<Order> {
    const response = await apiClient.get<ApiResponse<Order>>(
      API_ENDPOINTS.ORDERS.DETAIL(id)
    );
    return response.data;
  }

  /**
   * Create new order
   */
  async create(data: CreateOrderRequest): Promise<{
    order_id: number;
    order_number: string;
    status: string;
    total: number;
  }> {
    const response = await apiClient.post<ApiResponse<any>>(
      API_ENDPOINTS.ORDERS.CREATE,
      data
    );
    return response.data;
  }
}

export const orderService = new OrderService();