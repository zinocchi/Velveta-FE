// src/services/admin/dashboard.service.ts

import { apiClient } from '../api/config';
import { API_ENDPOINTS } from '../api/endpoint';
import { ApiResponse } from '../../types';
import { 
  type DashboardStats, 
  type RevenueReportRequest, 
  type RevenueReportResponse 
} from '../../types/admin';

class AdminDashboardService {
  /**
   * Get dashboard overview
   */
  async getDashboard(): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>(
      API_ENDPOINTS.ADMIN_DASHBOARD.INDEX
    );
    return response.data;
  }

  /**
   * Get revenue report
   */
  async getRevenueReport(params: RevenueReportRequest): Promise<RevenueReportResponse> {
    const searchParams = new URLSearchParams(params as any);
    const response = await apiClient.get<ApiResponse<RevenueReportResponse>>(
      `${API_ENDPOINTS.ADMIN_DASHBOARD.REVENUE_REPORT}?${searchParams}`
    );
    return response.data;
  }

  /**
   * Get order statistics
   */
  async getStatistics(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(
      API_ENDPOINTS.ADMIN_DASHBOARD.STATISTICS
    );
    return response.data;
  }
}

export const adminDashboardService = new AdminDashboardService();