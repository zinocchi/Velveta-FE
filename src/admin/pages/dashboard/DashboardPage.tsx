import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';

import { LoadingSpinner } from '../../../components/ui/loading';
import { ErrorState } from '../../components/ui/ErrorState';
import StatsCards from './components/StatsCard';
import OrderStatusCard from './components/OrderStatusCard';
import StockStatusCard from './components/StockStatusCard';
import PopularMenusCard from './components/PopularMenusCard';
import RevenueChartCard from './components/RevenueChartCard';
import RecentOrdersCard from './components/RecentOrderCard';

const DashboardPage: React.FC = () => {
  const {
    stats,
    revenueData,
    chartType,
    setChartType,
    dateRange,
    setDateRange,
    loading,
    chartLoading,
    error,
    refreshRevenue,
    exportData,
  } = useDashboard();

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="Loading dashboard..." />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8">
        <ErrorState
          message={error || 'Failed to load dashboard'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Dashboard Overview
        </h1>
        <p className="text-gray-500">Welcome back, here's your business overview</p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Order Status & Stock Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <OrderStatusCard stats={stats} />
        <StockStatusCard stats={stats} />
        <PopularMenusCard stats={stats} />
      </div>

      {/* Revenue Chart & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChartCard
          revenueData={revenueData}
          chartType={chartType}
          onChartTypeChange={setChartType}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onRefresh={refreshRevenue}
          onExport={exportData}
          chartLoading={chartLoading}
        />
        <RecentOrdersCard stats={stats} />
      </div>
    </div>
  );
};

export default DashboardPage;