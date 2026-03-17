// src/services/api/endpoints.ts

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    ME: '/me',
  },
  
  // Admin Auth
  ADMIN: {
    LOGIN: '/admin/login',
    REGISTER: '/admin/register',
  },
  
  // Menu (public)
  MENU: {
    LIST: '/menu',
    DETAIL: (id: number) => `/menu/${id}`,
    CATEGORIES: '/menu/categories',
    BY_CATEGORY: (slug: string) => `/menu/category/${slug}`,
  },
  
  // Orders (user)
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAIL: (id: number) => `/orders/${id}`,
    MY_ORDERS: '/orders/my',
    PAY: (id: number) => `/orders/${id}/pay`,
  },
  
  // Admin Dashboard
  ADMIN_DASHBOARD: {
    INDEX: '/admin/dashboard',
    REVENUE_REPORT: '/admin/dashboard/revenue-report',
    STATISTICS: '/admin/dashboard/statistics',
  },
  
  // Admin Menu Management
  ADMIN_MENU: {
    LIST: '/admin/menus',
    CREATE: '/admin/menus',
    DETAIL: (id: number) => `/admin/menus/${id}`,
    UPDATE: (id: number) => `/admin/menus/${id}`,
    DELETE: (id: number) => `/admin/menus/${id}`,
    UPDATE_STOCK: (id: number) => `/admin/menus/${id}/stock`,
    BULK_UPDATE_STOCK: '/admin/menus/bulk-update-stock',
    TOGGLE_AVAILABILITY: (id: number) => `/admin/menus/${id}/toggle-availability`,
    CATEGORIES: '/admin/categories',
    LOW_STOCK: '/admin/stock/low-stock',
  },
  
  // Admin Order Management
  ADMIN_ORDER: {
    LIST: '/admin/orders',
    DETAIL: (id: number) => `/admin/orders/${id}`,
    UPDATE_STATUS: (id: number) => `/admin/orders/${id}/status`,
    BULK_STATUS: '/admin/orders/bulk-status',
    STATISTICS: '/admin/orders/statistics/overview',
    RECENT: '/admin/orders/recent/recent-list',
  },
} as const;