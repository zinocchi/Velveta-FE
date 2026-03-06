import React from "react";
import {
  FaClock,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

interface OrderStatusBadgeProps {
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  size?: "sm" | "md" | "lg";
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, size = "md" }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "PENDING":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: FaClock,
          label: "Pending",
        };
      case "PROCESSING":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: FaSpinner,
          label: "Processing",
        };
      case "COMPLETED":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          icon: FaCheckCircle,
          label: "Completed",
        };
      case "CANCELLED":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          border: "border-rose-200",
          icon: FaTimesCircle,
          label: "Cancelled",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: FaClock,
          label: status,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} />
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;