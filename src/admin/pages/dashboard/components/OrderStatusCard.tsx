import React from "react";
import { DashboardStats } from "../../../types/dashboard";

interface OrderStatusCardProps {
  stats: DashboardStats | null;
}

const OrderStatusCard: React.FC<OrderStatusCardProps> = ({ stats }) => {
  const statuses = [
    {
      label: "Pending",
      value: stats?.ordersByStatus?.pending || 0,
      color: "bg-amber-500",
    },
    {
      label: "Processing",
      value: stats?.ordersByStatus?.processing || 0,
      color: "bg-blue-500",
    },
    {
      label: "Completed",
      value: stats?.ordersByStatus?.completed || 0,
      color: "bg-emerald-500",
    },
    {
      label: "Cancelled",
      value: stats?.ordersByStatus?.cancelled || 0,
      color: "bg-rose-500",
    },
  ];

  console.log("Order status data:", stats?.ordersByStatus);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Order Status</h3>
      <div className="space-y-3">
        {statuses.map((status) => (
          <div key={status.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 ${status.color} rounded-full`}></div>
              <span className="text-sm text-gray-600">{status.label}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {status.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusCard;
