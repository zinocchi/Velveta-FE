import React from "react";
import { OrderStatus } from "../../types/order";
import { FaShoppingBag, FaClock, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { cn } from "../../libs/utils";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
  showIcon?: boolean;
}

const statusConfig: Record<OrderStatus, { color: string; icon: React.ReactNode; label: string }> = {
  COMPLETED: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <FaShoppingBag className="w-3 h-3" />,
    label: "Completed",
  },
  PENDING: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <FaClock className="w-3 h-3" />,
    label: "Pending",
  },
  PROCESSING: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <FaSpinner className="w-3 h-3 animate-spin" />,
    label: "Processing",
  },
  CANCELLED: {
    color: "bg-rose-50 text-rose-700 border-rose-200",
    icon: <FaExclamationTriangle className="w-3 h-3" />,
    label: "Cancelled",
  },
};

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  className,
  showIcon = true,
}) => {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5",
        config.color,
        className
      )}
    >
      {showIcon && config.icon}
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;