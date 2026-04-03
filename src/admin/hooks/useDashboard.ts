// useDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import { DashboardStats, RevenueData } from '../types/dashboard';
import { ChartType, DateRange } from '../../types/chart';

interface UseDashboardReturn {
  stats: DashboardStats | null;
  revenueData: RevenueData[];
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  loading: boolean;
  chartLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  refreshRevenue: () => Promise<void>;
  exportData: () => void;
}

// Helper function to transform API response to frontend format
const transformStats = (apiStats: any): DashboardStats => {
  if (!apiStats) return {} as DashboardStats;
  
  return {
    // Keep original snake_case if your components expect it
    totalOrders: apiStats.total_orders || 0,
    totalRevenue: apiStats.total_revenue || 0,
    totalMenu: apiStats.total_menu || 0,
    totalUsers: apiStats.total_users || 0,
    todayOrders: apiStats.today_orders || 0,
    todayRevenue: apiStats.today_revenue || 0,
    ordersByStatus: apiStats.orders_by_status || {
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0
    },
    orders_by_delivery: apiStats.orders_by_delivery || {
      delivery: 0,
      pickup: 0
    },
    stock_stats: apiStats.stock_stats || {
      total_items: 0,
      low_stock: 0,
      out_of_stock: 0,
      available_items: 0
    },
    revenue: apiStats.revenue || {
      today: 0,
      this_week: 0,
      this_month: 0,
      average_order_value: 0
    }
  };
};

export const useDashboard = (): UseDashboardReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [chartType, setChartType] = useState<ChartType>('area');
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardService.getDashboardStats();
      
      console.log('Dashboard stats from API:', response);

      // Transform the data if needed
      const transformedStats = transformStats(response.stats);
      
      console.log('Transformed stats:', transformedStats);
      
      setStats(transformedStats);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRevenueData = useCallback(async () => {
    try {
      setChartLoading(true);

      const data = await dashboardService.getRevenueReport({
        start_date: dateRange.start,
        end_date: dateRange.end,
        group_by: 'day',
      });

      const formattedData = (data.chart_data || []).map((item) => ({
        ...item,
        revenue: Number(item.revenue) || 0,
        orders: Number(item.orders) || 0,
      }));

      setRevenueData(formattedData);
    } catch (err) {
      console.error('Failed to fetch revenue data:', err);
    } finally {
      setChartLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchRevenueData();
  }, [fetchRevenueData]);

  const refreshData = useCallback(async () => {
    await fetchDashboardData();
    await fetchRevenueData();
  }, [fetchDashboardData, fetchRevenueData]);

  const refreshRevenue = useCallback(() => {
    fetchRevenueData();
  }, [fetchRevenueData]);

  const exportData = useCallback(() => {
    const headers = ['Date', 'Revenue', 'Orders'];

    const csvData = revenueData.map((item) => [
      item.date,
      item.revenue,
      item.orders,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-report-${dateRange.start}-to-${dateRange.end}.csv`;
    a.click();
  }, [revenueData, dateRange]);

  return {
    stats,
    revenueData,
    chartType,
    setChartType,
    dateRange,
    setDateRange,
    loading,
    chartLoading,
    error,
    refreshData,
    refreshRevenue,
    exportData,
  };
};