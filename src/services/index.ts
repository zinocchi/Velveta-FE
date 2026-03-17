// src/services/index.ts

export { apiClient } from './api/config';
export { API_ENDPOINTS } from './api/endpoint';

// User services
export { menuService } from './menuService';
export { orderService } from './orderService';

// Admin services
export { adminDashboardService } from './admin/dashboardService';
export { adminMenuService } from './admin/menuService';
export { adminOrderService } from './admin/orderService';