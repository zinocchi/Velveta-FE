import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';

import { LoadingSpinner } from '../../../components/ui/loading';
import { ErrorState } from '../../components/ui/ErrorState';
import StatsCards from './components/StatsCard';
import MonthlyGoalsCard from './components/MonthlyGoalsCard';
import RevenueChartCard from './components/RevenueChartCard';
import TopProductsCard from './components/TopProductsCard';
import BudgetUsageCard from './components/BudgetUsageCard';
import CustomerReviewCard from './components/CustomerReviewCard';
import StockStatusCard from './components/StockStatusCard';

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
      <div className="p-8 flex items-center justify-center min-h-[80vh]">
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
    <div className="p-2">
      {/* ===== ROW 1: Stats Cards + Monthly Goals ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Stats Cards (Revenue + Orders) - takes 2 cols */}
        <div className="lg:col-span-2">
          <StatsCards stats={stats} />
        </div>
        
        {/* Monthly Goals - takes 1 col */}
        <MonthlyGoalsCard
          target={stats.totalRevenue > 0 ? Math.ceil(stats.totalRevenue * 1.3 / 100000) * 100000 : 250000}
          achieved={stats.totalRevenue || 0}
        />
      </div>

      {/* ===== ROW 2: Sales Analytics + Top Products ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Sales Analytics Chart - wider */}
        <div className="lg:col-span-3">
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
        
        {/* Top Products Heatmap */}
        <div className="lg:col-span-2">
          <TopProductsCard stats={stats} />
        </div>
      </div>

      {/* ===== ROW 3: Budget + Customer Review + Low Stock Alert ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BudgetUsageCard stats={stats} />
        <CustomerReviewCard stats={stats} />
        <StockStatusCard stats={stats} />
      </div>
    </div>
  );
};

export default DashboardPage;