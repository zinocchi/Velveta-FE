import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaReceipt,
  FaCalendarAlt,
  FaMotorcycle,
  FaStore,
  FaLock,
} from "react-icons/fa";
import { Order } from "../../../types/order";
import OrderStatusBadge from "./OrderStatusBadges";
import { formatCurrency, formatDateShort } from "../../../utils/formatters";

interface OrderTableRowProps {
  order: Order;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onStatusUpdate: (orderId: number, newStatus: string) => void;
  onViewReceipt: (order: Order) => void;
}

const OrderTableRow: React.FC<OrderTableRowProps> = ({
  order,
  isSelected,
  onSelect,
  onStatusUpdate,
  onViewReceipt,
}) => {
  const navigate = useNavigate();
  const isCompleted = order.status === "COMPLETED";
  const isCancelled = order.status === "CANCELLED";
  const isLocked = isCompleted || isCancelled;

  const getPaymentMethodName = (method: string) => {
    const methods: Record<string, string> = {
      credit_card: "Credit Card",
      e_wallet: "E-Wallet",
      bank_transfer: "Bank Transfer",
      cash: "Cash",
    };
    return methods[method] || method.replace("_", " ");
  };

  // Get available status options based on current status
  const getAvailableStatusOptions = () => {
    if (isLocked) return [];
    
    const options = [];
    if (order.status !== "PROCESSING") {
      options.push({ value: "PROCESSING", label: "Processing" });
    }
    if (order.status !== "COMPLETED") {
      options.push({ value: "COMPLETED", label: "Completed" });
    }
    if (order.status !== "CANCELLED") {
      options.push({ value: "CANCELLED", label: "Cancelled" });
    }
    return options;
  };

  const availableOptions = getAvailableStatusOptions();

  return (
    <div className="p-5 hover:bg-gray-50/80 transition-all duration-200">
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            disabled={isLocked}
            className={`w-4 h-4 text-red-700 rounded border-gray-300 focus:ring-red-200 ${
              isLocked ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Order Info */}
        <div className="flex-1 grid grid-cols-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-900">
                #{order.order_number}
              </p>
              {isLocked && (
                <div className="relative group">
                  <FaLock className="w-3 h-3 text-gray-400" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {isCompleted 
                      ? "Completed orders cannot be modified" 
                      : "Cancelled orders cannot be modified"}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <FaCalendarAlt className="w-3 h-3" />
              {formatDateShort(order.created_at)}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              {order.delivery_type === "delivery" ? (
                <>
                  <FaMotorcycle className="w-3 h-3" /> Delivery
                </>
              ) : (
                <>
                  <FaStore className="w-3 h-3" /> Pickup
                </>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              {order.user?.username || "N/A"}
            </p>
            <p className="text-xs text-gray-500">
              {order.user?.email || "N/A"}
            </p>
          </div>

          <div>
            <div className="flex flex-wrap gap-1">
              {order.items.slice(0, 2).map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded-md"
                >
                  {item.menu?.name || "Unknown"} x{item.qty}
                </span>
              ))}
              {order.items.length > 2 && (
                <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                  +{order.items.length - 2}
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-gray-900">
              {formatCurrency(order.total_price)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {getPaymentMethodName(order.payment_method)}
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="w-40 flex flex-col items-end gap-2">
          <div className="relative group">
            <OrderStatusBadge status={order.status} />
            {isLocked && (
              <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Status locked
              </div>
            )}
          </div>

          <div className="flex gap-1">
            {/* Status Update Dropdown */}
            {!isLocked && availableOptions.length > 0 ? (
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    onStatusUpdate(order.id, e.target.value);
                    e.target.value = ""; // Reset select after selection
                  }
                }}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-200 transition-colors cursor-pointer"
              >
                <option value="">Update</option>
                {availableOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <button
                disabled
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 text-gray-400 cursor-not-allowed flex items-center gap-1"
                title={isCompleted ? "Completed orders cannot be modified" : "Cancelled orders cannot be modified"}
              >
                <FaLock className="w-3 h-3" />
                Locked
              </button>
            )}

            {/* View Details Button */}
            <button
              onClick={() => navigate(`/admin/orders/${order.id}`)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="View Details"
            >
              <FaEye className="w-4 h-4 text-gray-500" />
            </button>

            {/* View Receipt Button */}
            <button
              onClick={() => onViewReceipt(order)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="View Receipt"
            >
              <FaReceipt className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTableRow;