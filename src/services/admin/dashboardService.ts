// // src/admin/services/dashboard.service.ts

// import api from '../../../api/axios';
// import { DashboardStats, RevenueData } from '../types/dashboard';
// import { DateRange } from '../types/chart';

// class DashboardService {
//   async getDashboardStats(): Promise<DashboardStats> {
//     const response = await api.get('/admin/dashboard');
//     return response.data.data;
//   }

//   async getRevenueReport(params: {
//     start_date: string;
//     end_date: string;
//     group_by?: 'day' | 'week' | 'month';
//   }): Promise<{ chart_data: RevenueData[] }> {
//     const response = await api.get('/admin/dashboard/revenue-report', { params });
//     return response.data.data;
//   }

//   async getOrderStatistics() {
//     const response = await api.get('/admin/orders/statistics/overview');
//     return response.data.data;
//   }

//   async getRecentOrders(limit: number = 10) {
//     const response = await api.get('/admin/orders/recent/recent-list');
//     return response.data.data;
//   }
// }

// export const dashboardService = new DashboardService();