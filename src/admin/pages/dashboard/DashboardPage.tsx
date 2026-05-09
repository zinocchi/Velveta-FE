// src/admin/pages/dashboard/DashboardPage.tsx

import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import DashboardSkeleton from './components/DashboardSkeleton';
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

  if (loading && !stats) {
    return <DashboardSkeleton />;
  }

  // Tampilkan error jika ada (opsional - uncomment jika perlu)
  // if (error || !stats) {
  //   return (
  //     <div className="p-8">
  //       <ErrorState
  //         message={error || 'Failed to load dashboard'}
  //         onRetry={() => window.location.reload()}
  //       />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Welcome back, here's your business overview
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className="mb-8">
          <StatsCards stats={stats} />
        </div>

        {/* Order Status & Stock Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <OrderStatusCard stats={stats} />
          <StockStatusCard stats={stats} />
          <PopularMenusCard stats={stats} />
        </div>

        {/* Revenue Chart & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart - Lebih lebar */}
          <div className="lg:col-span-2">
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
          </div>
          
          {/* Recent Orders */}
          <div className="lg:col-span-1">
            <RecentOrdersCard stats={stats} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;