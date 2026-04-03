import React from "react";
import {
  FaBoxOpen,
  FaExclamationCircle,
  FaTimesCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { DashboardStats } from "../../../types/dashboard";

interface StockStatusCardProps {
  stats: DashboardStats | null;
}

const StockStatusCard: React.FC<StockStatusCardProps> = ({ stats }) => {
  const stockItems = [
    {
      label: "Total Items",
      value: stats?.stockStats?.totalItems || 0, 
      icon: FaBoxOpen,
      color: "text-gray-400",
    },
    {
      label: "Low Stock",
      value: stats?.stockStats?.lowStock || 0, 
      icon: FaExclamationCircle,
      color: "text-amber-500",
      valueColor: "text-amber-600",
    },
    {
      label: "Out of Stock",
      value: stats?.stockStats?.outOfStock || 0, 
      icon: FaTimesCircle,
      color: "text-rose-500",
      valueColor: "text-rose-600",
    },
    {
      label: "Available",
      value: stats?.stockStats?.availableItems || 0, // stock_stats.available_items
      icon: FaCheckCircle,
      color: "text-emerald-500",
      valueColor: "text-emerald-600",
    },
  ];

  // Debug: Log the actual stats to see structure
  console.log("Stock stats from API:", stats?.stockStats);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Stock Status</h3>
      <div className="space-y-3">
        {stockItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
              <span
                className={`text-sm font-semibold ${item.valueColor || "text-gray-900"}`}>
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StockStatusCard;
