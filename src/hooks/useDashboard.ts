import { useState, useEffect, useCallback } from "react";
import { dashboardService } from "../services/dashboardService";
import { DashboardStats, DashboardState } from "../types/dashboard";
import { RequestStatus } from "../types/api";

const initialState: DashboardState = {
  stats: {
    totalOrders: 0,
    totalSpent: 0,
    favoriteDrink: "-",
    favoriteCount: 0,
    recentOrders: [],
    points: 0,
  },
  loading: false,
  error: null,
};

export const useDashboard = () => {
  const [state, setState] = useState<DashboardState>(initialState);

  const fetchDashboardData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const stats = await dashboardService.getDashboardStats();
      setState({
        stats,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setState({
        ...initialState,
        loading: false,
        error: err.response?.data?.message || "Failed to load dashboard data",
      });
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refetch = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    ...state,
    refetch,
    isLoading: state.loading,
    isError: !!state.error,
    isSuccess: !state.loading && !state.error,
  };
};