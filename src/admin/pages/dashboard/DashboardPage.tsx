
import React, { useState, useEffect } from "react";
import { useDashboard } from "../../hooks/useDashboard";
import { useAuthContext } from "../../../context/AuthContext";
import DashboardSkeleton from "./components/DashboardSkeleton";
import RevenueChart from "../../components/charts/RevenueChart";
import DateRangePicker from "../../../components/ui/DateRangePicker";
import {
  FaWallet,
  FaShoppingBag,
  FaCoffee,
  FaUsers,
  FaArrowUp,
  FaChartLine,
  FaDownload,
  FaSyncAlt,
} from "react-icons/fa";
import { formatCurrency } from "../../../utils/formatters";

type ChartType = "line" | "bar" | "area";

// Mock data untuk 9-18 Mei 2024 (data real)
const MOCK_REVENUE_DATA = [
  { date: "2026-05-09", revenue: 3250000, orders: 42 },
  { date: "2026-05-10", revenue: 4120000, orders: 58 },
  { date: "2026-05-11", revenue: 5280000, orders: 73 },
  { date: "2026-05-12", revenue: 4850000, orders: 65 },
  { date: "2026-05-13", revenue: 5610000, orders: 82 },
  { date: "2026-05-14", revenue: 4980000, orders: 71 },
  { date: "2026-05-15", revenue: 6350000, orders: 94 },
  { date: "2026-05-16", revenue: 7120000, orders: 108 },
  { date: "2026-05-17", revenue: 6890000, orders: 95 },
  { date: "2026-05-18", revenue: 7580000, orders: 112 },
];

const DashboardPage: React.FC = () => {
  const { user } = useAuthContext();
  const [chartType, setChartType] = useState<ChartType>("area");
  const [startDate, setStartDate] = useState(() => {
    const date = new Date(2026, 4, 9); // 9 Mei 2024
    return date;
  });
  const [endDate, setEndDate] = useState(() => {
    const date = new Date(2026, 4, 18); // 18 Mei 2024
    return date;
  });
  const [displayRevenueData, setDisplayRevenueData] = useState(MOCK_REVENUE_DATA);
  const [chartLoading, setChartLoading] = useState(false);

  const {
    stats,
    loading,
    refreshRevenue,
    exportData,
  } = useDashboard();

  // Filter data berdasarkan date range
  const filterDataByDateRange = (start: Date, end: Date) => {
    const filtered = MOCK_REVENUE_DATA.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
    setDisplayRevenueData(filtered);
  };

  // Handle date range apply
  const handleDateRangeApply = () => {
    setChartLoading(true);
    // Simulate API call
    setTimeout(() => {
      filterDataByDateRange(startDate, endDate);
      setChartLoading(false);
    }, 500);
  };

  // Handle refresh
  const handleRefresh = () => {
    setChartLoading(true);
    setTimeout(() => {
      filterDataByDateRange(startDate, endDate);
      setChartLoading(false);
    }, 500);
  };

  // Handle export
  const handleExport = () => {
    const headers = ['Date', 'Revenue', 'Orders'];
    const csvData = displayRevenueData.map(item => [
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
    a.download = `revenue-report-${startDate.toISOString().split('T')[0]}-to-${endDate.toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const revenueChange = 12;
  const ordersChange = 8;
  const productsChange = 5;
  const usersChange = 15;

  if (loading && !stats) {
    return <DashboardSkeleton />;
  }

  // Calculate totals for display
  const totalRevenue = displayRevenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = displayRevenueData.reduce((sum, item) => sum + item.orders, 0);
  const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const summaryCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue || 0),
      change: `+${revenueChange}%`,
      icon: <FaWallet className="w-5 h-5" />,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      change: `+${ordersChange}%`,
      icon: <FaShoppingBag className="w-5 h-5" />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Products",
      value: stats?.totalMenu || 0,
      change: `+${productsChange}%`,
      icon: <FaCoffee className="w-5 h-5" />,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      change: `+${usersChange}%`,
      icon: <FaUsers className="w-5 h-5" />,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  // Format date untuk display
  const formatDateDisplay = (date: Date) => {
    return `${date.getDate()} ${date.toLocaleDateString('id-ID', { month: 'short' })} ${date.getFullYear()}`;
  };

  // Format date untuk label chart
  const formatChartDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Data untuk chart dengan format yang benar
  const chartData = displayRevenueData.map(item => ({
    date: formatChartDate(item.date),
    revenue: item.revenue,
    orders: item.orders,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8 lg:px-8">
        {/* Header */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              Berikut ringkasan performa sistem hari ini.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.username || "Admin"}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-semibold text-lg">
                {user?.username?.[0]?.toUpperCase() || "A"}
              </span>
            </div>
          </div>
        </div> */}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                  <div className={`${card.iconColor}`}>{card.icon}</div>
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <FaArrowUp className="w-3 h-3" />
                  <span>{card.change}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-400 mt-2">vs last month</p>
            </div>
          ))}
        </div>

        {/* Revenue Chart Widget */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
              <p className="text-sm text-gray-500 mt-1">Pendapatan periode terakhir</p>
            </div>
            
            {/* Date Range Picker */}
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onApply={handleDateRangeApply}
            />
          </div>

          {/* Chart Type Selector & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-0.5 bg-gray-100 p-0.5 rounded-lg">
              <button
                onClick={() => setChartType('area')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  chartType === 'area'
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Area
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  chartType === 'line'
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  chartType === 'bar'
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Bar
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleRefresh}
                disabled={chartLoading}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <FaSyncAlt className={`w-3.5 h-3.5 text-gray-500 ${chartLoading && 'animate-spin'}`} />
              </button>
              <button
                onClick={handleExport}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Export as CSV"
              >
                <FaDownload className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Chart Container */}
          <div className="h-80 w-full mt-4">
            {chartLoading ? (
              <div className="flex items-center justify-center h-full bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-700 mx-auto mb-3"></div>
                  <p className="text-gray-500 text-sm">Loading chart data...</p>
                </div>
              </div>
            ) : displayRevenueData.length > 0 ? (
              <RevenueChart 
                data={chartData} 
                chartType={chartType}
                height={320}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50 rounded-xl">
                <div className="text-center">
                  <FaChartLine className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No revenue data available for selected period</p>
                </div>
              </div>
            )}
          </div>

          {/* Date Range Label Below Chart */}
          {displayRevenueData.length > 0 && (
            <div className="flex justify-center mt-2">
              <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                {formatDateDisplay(startDate)} - {formatDateDisplay(endDate)}
              </div>
            </div>
          )}

          {/* Summary Stats */}
          {displayRevenueData.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="p-3 bg-gray-50 rounded-xl text-center sm:text-left">
                <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(totalRevenue)}
                </p>
                <p className="text-xs text-green-600 mt-1 flex items-center justify-center sm:justify-start gap-1">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  +12.5% from last period
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-center sm:text-left">
                <p className="text-xs text-gray-500 mb-1">Total Orders</p>
                <p className="text-xl font-bold text-gray-900">{totalOrders}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center justify-center sm:justify-start gap-1">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  +8.3% from last period
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-center sm:text-left">
                <p className="text-xs text-gray-500 mb-1">Average Order Value</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(averageOrder)}</p>
                <p className="text-xs text-gray-500 mt-1">Per transaction</p>
              </div>
            </div>
          )}

          {/* Legend */}
          {displayRevenueData.length > 0 && (
            <div className="flex justify-center gap-6 mt-4 pt-2 text-xs text-gray-500">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                Revenue
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                Orders
              </span>
            </div>
          )}
        </div>

        {/* Order Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Pending Orders</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats?.ordersByStatus.pending || 0}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Processing</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats?.ordersByStatus.processing || 0}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Completed</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats?.ordersByStatus.completed || 0}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Cancelled</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats?.ordersByStatus.cancelled || 0}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;