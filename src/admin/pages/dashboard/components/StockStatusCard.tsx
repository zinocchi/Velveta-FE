import React from "react";
import {
  FaExclamationTriangle,
  FaCoffee,
} from "react-icons/fa";
import { DashboardStats } from "../../../types/dashboard";

interface StockStatusCardProps {
  stats: DashboardStats | null;
}

const StockStatusCard: React.FC<StockStatusCardProps> = ({ stats }) => {
  const lowStock = stats?.stockStats?.lowStock || 0;
  const outOfStock = stats?.stockStats?.outOfStock || 0;
  const totalAlerts = lowStock + outOfStock;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-gray-900">Low Stock Alert</h3>
        {totalAlerts > 0 && (
          <span className="px-2 py-0.5 bg-red-50 text-red-500 text-xs font-semibold rounded-full">
            {totalAlerts} items
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <FaCoffee className="w-7 h-7 text-gray-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {lowStock > 0 ? `${lowStock} items low` : 'Stock Status'}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {outOfStock > 0 ? `${outOfStock} out of stock` : 'All items available'}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
        {totalAlerts > 0
          ? 'Products running out fast. Consider restocking or launching a flash promotion.'
          : 'All stock levels are healthy. No action needed.'}
      </p>

      {totalAlerts > 0 && (
        <button className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors">
          Restock Now
        </button>
      )}
    </div>
  );
};

export default StockStatusCard;
