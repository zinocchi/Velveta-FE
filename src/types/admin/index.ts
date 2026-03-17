// src/types/admin/index.ts

import type { DashboardStats, PopularMenu, RevenueData } from './dashboard';
import type { BulkStockItem, MenuFormData, UpdateStockRequest } from './menu';
import type { AdminOrder, OrderStatistics } from './order';

export * from './dashboard';
export * from './menu';
export * from './order';

// Re-export commonly used types
export type {
  DashboardStats,
  RevenueData,
  PopularMenu,
  MenuFormData,
  AdminOrder,
  OrderStatistics,
  UpdateStockRequest,
  BulkStockItem
};