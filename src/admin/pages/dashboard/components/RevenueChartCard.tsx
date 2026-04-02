import React from 'react';
import RevenueChart from '../../../components/charts/RevenueChart';
import ChartControls from '../../../components/charts/ChartControl';
import { RevenueData } from '../../../types/dashboard';
import { ChartType, DateRange } from '../../../../types/chart';
import { formatCurrency } from '../../../../utils/formatters';

interface RevenueChartCardProps {
  revenueData: RevenueData[];
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onRefresh: () => void;
  onExport: () => void;
  chartLoading: boolean;
}

const RevenueChartCard: React.FC<RevenueChartCardProps> = ({
  revenueData,
  chartType,
  onChartTypeChange,
  dateRange,
  onDateRangeChange,
  onRefresh,
  onExport,
  chartLoading,
}) => {
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);
  const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
      </div>

      <ChartControls
        chartType={chartType}
        onChartTypeChange={onChartTypeChange}
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        onRefresh={onRefresh}
        onExport={onExport}
        loading={chartLoading}
      />

      <div className="h-80">
        <RevenueChart 
          data={revenueData} 
          chartType={chartType}
          height={320}
        />
      </div>

      {revenueData.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Orders</p>
            <p className="text-lg font-bold text-gray-900">
              {totalOrders}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Average Order</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(averageOrder)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueChartCard;