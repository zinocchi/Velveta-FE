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

export const useDashboard = (): UseDashboardReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [chartType, setChartType] = useState<ChartType>('area');
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getDashboardStats();
      setStats(data);
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
        group_by: 'day'
      });
      
      const formattedData = data.chart_data.map(item => ({
        ...item,
        revenue: Number(item.revenue),
        orders: Number(item.orders)
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
    const csvData = revenueData.map(item => [
      item.date,
      item.revenue,
      item.orders
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
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