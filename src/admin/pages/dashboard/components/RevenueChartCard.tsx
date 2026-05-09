import React from 'react';
import RevenueChart from '../../../components/charts/RevenueChart';
import ChartControls from '../../../components/charts/ChartControl';
import { RevenueData } from '../../../types/dashboard';
import { ChartType, DateRange } from '../../../../types/chart';

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
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-gray-900">Sales Analytics</h3>
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

      <div className="h-72 mt-2">
        <RevenueChart 
          data={revenueData} 
          chartType={chartType}
          height={280}
        />
      </div>
    </div>
  );
};

export default RevenueChartCard;