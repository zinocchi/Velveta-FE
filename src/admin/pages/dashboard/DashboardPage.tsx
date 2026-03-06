import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import {
  FaShoppingBag,
  FaWallet,
  FaUsers,
  FaCoffee,
  FaBoxOpen,
  FaExclamationCircle,
  FaTimesCircle,
  FaCheckCircle,
  FaStar,
  FaChevronRight,
} from "react-icons/fa";
import type { DashboardStats } from "../../types";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/dashboard");
      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-red-200 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {stats?.totalOrders || 0}
              </p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-gray-500">Today:</span>
                <span className="font-semibold text-gray-900">
                  {stats?.todayOrders || 0}
                </span>
              </div>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <FaShoppingBag className="w-6 h-6 text-red-700" />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-emerald-200 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {formatCurrency(stats?.totalRevenue || 0)}
              </p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-gray-500">All time</span>
              </div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <FaWallet className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Total Menu */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Menu</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {stats?.totalMenu || 0}
              </p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-gray-500">Items</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <FaCoffee className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-purple-200 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {stats?.totalUsers || 0}
              </p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-gray-500">Registered</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <FaUsers className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Order Status & Stock Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Order Status Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Order Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {stats?.ordersByStatus.pending || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Processing</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {stats?.ordersByStatus.processing || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {stats?.ordersByStatus.completed || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Cancelled</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {stats?.ordersByStatus.cancelled || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Stock Status */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Stock Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaBoxOpen className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Total Items</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {stats?.stockStats.totalItems || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaExclamationCircle className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-gray-600">Low Stock</span>
              </div>
              <span className="text-sm font-semibold text-amber-600">
                {stats?.stockStats.lowStock || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaTimesCircle className="w-4 h-4 text-rose-500" />
                <span className="text-sm text-gray-600">Out of Stock</span>
              </div>
              <span className="text-sm font-semibold text-rose-600">
                {stats?.stockStats.outOfStock || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <span className="text-sm font-semibold text-emerald-600">
                {stats?.stockStats.availableItems || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Popular Menus */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Menus</h3>
          <div className="space-y-3">
            {stats?.popularMenus && stats.popularMenus.length > 0 ? (
              stats.popularMenus.map((menu) => (
                <div key={menu.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      {menu.image ? (
                        <img src={menu.image} alt={menu.name} className="w-6 h-6 object-cover rounded" />
                      ) : (
                        <FaCoffee className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <span className="text-sm text-gray-600 truncate max-w-[120px]">
                      {menu.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaStar className="w-3 h-3 text-amber-400" />
                    <span className="text-sm font-semibold text-gray-900">
                      {menu.total_sold}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Revenue Chart & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1"
              />
              <span className="text-xs text-gray-400">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1"
              />
            </div>
          </div>
          <div className="h-64 flex items-center justify-center border border-gray-100 rounded-xl bg-gray-50">
            <p className="text-gray-400">Revenue chart will be displayed here</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <button
              onClick={() => navigate("/admin/orders")}
              className="text-red-700 hover:text-red-800 text-sm font-medium flex items-center gap-1"
            >
              View All
              <FaChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                  className="p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-400">
                      #{order.order_number}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.user?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.items?.length || 0} items
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {formatCurrency(order.total_price)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No recent orders</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;