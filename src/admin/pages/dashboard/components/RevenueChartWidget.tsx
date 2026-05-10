// src/admin/pages/dashboard/components/RevenueChartWidget.tsx

import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaChartArea,
  FaChartBar,
  FaDownload,
} from "react-icons/fa";
import RevenueChart from "../../../components/charts/RevenueChart";
import DateRangePicker from "../../../../components/ui/DateRangePicker";
import { RevenueData } from "../../../types/dashboard";
import { formatCurrency } from "../../../../utils/formatters";

interface RevenueChartWidgetProps {
  revenueData: RevenueData[];
  chartLoading: boolean;
  onRefresh?: (startDate?: Date, endDate?: Date) => void;
  onExport?: () => void;
}

type ChartType = "area" | "line" | "bar";

const RevenueChartWidget: React.FC<RevenueChartWidgetProps> = ({
  revenueData,
  chartLoading,
  onRefresh,
  onExport,
}) => {
  const [chartType, setChartType] = useState<ChartType>("area");
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());

  const chartOptions = [
    {
      id: "area",
      label: "Area",
      icon: <FaChartArea className="w-3.5 h-3.5" />,
    },
    {
      id: "line",
      label: "Line",
      icon: <FaChartLine className="w-3.5 h-3.5" />,
    },
    { id: "bar", label: "Bar", icon: <FaChartBar className="w-3.5 h-3.5" /> },
  ];

  const handleDateRangeApply = () => {
    if (onRefresh) {
      onRefresh(startDate, endDate);
    }
  };

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);
  const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Format date untuk display di bawah chart
  const formatChartDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()} ${date.toLocaleDateString("id-ID", { month: "short" })}`;
  };

  const firstDate = revenueData.length > 0 ? revenueData[0].date : "";
  const lastDate =
    revenueData.length > 0 ? revenueData[revenueData.length - 1].date : "";

  if (chartLoading && revenueData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-700 mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Loading chart data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Revenue Analytics
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Pendapatan periode terakhir
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onApply={handleDateRangeApply}
          />

          {onExport && (
            <button
              onClick={onExport}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Export Data">
              <FaDownload className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
        <span className="text-xs text-gray-500 mr-2">Chart Type:</span>
        {chartOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setChartType(option.id as ChartType)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
              chartType === option.id
                ? "bg-red-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="h-80 w-full">
        {revenueData && revenueData.length > 0 ? (
          <RevenueChart data={revenueData} chartType={chartType} height={320} />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 rounded-xl">
            <div className="text-center">
              <FaChartLine className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">
                No revenue data available for selected period
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Date Range Label */}
      {revenueData && revenueData.length > 0 && (
        <div className="flex justify-center mt-2">
          <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
            {formatChartDate(firstDate)} - {formatChartDate(lastDate)}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {revenueData && revenueData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="p-3 bg-gray-50 rounded-xl text-center sm:text-left">
            <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl text-center sm:text-left">
            <p className="text-xs text-gray-500 mb-1">Total Orders</p>
            <p className="text-xl font-bold text-gray-900">{totalOrders}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl text-center sm:text-left">
            <p className="text-xs text-gray-500 mb-1">Average Order Value</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(averageOrder)}
            </p>
          </div>
        </div>
      )}

      {/* Last Updated */}
      {revenueData && revenueData.length > 0 && (
        <div className="flex justify-end mt-4 pt-2 text-xs text-gray-400">
          Last updated: {new Date().toLocaleDateString("id-ID")}
        </div>
      )}
    </div>
  );
};

export default RevenueChartWidget;
