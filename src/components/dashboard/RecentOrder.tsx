import React from "react";
import { useNavigate } from "react-router-dom";
import { Order } from "../../types/order";
import { formatCurrency } from "../../utils/formatters";
import OrderStatusBadge from "../ui/OrderStatusBadge";
import { FaCalendarAlt, FaMotorcycle, FaStore, FaCoffee } from "react-icons/fa";

interface RecentOrdersProps {
  orders: Order[];
  onViewAll?: () => void;
  onOrderClick?: (orderId: number) => void;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({
  orders,
  onViewAll,
  onOrderClick,
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays === 2) return "2 days ago";
    if (diffDays === 3) return "3 days ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleOrderClick = (orderId: number) => {
    if (onOrderClick) {
      onOrderClick(orderId);
    } else {
      navigate(`/dashboard/orders/${orderId}`);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCoffee className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-900 text-lg font-medium mb-2">No orders yet</p>
        <p className="text-gray-500 text-sm mb-6">
          Ready to order your first coffee?
        </p>
        <button
          onClick={() => navigate("/menu")}
          className="px-6 py-3 bg-red-700 text-white rounded-xl font-medium hover:bg-red-800 transition-colors inline-flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Order Now
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => handleOrderClick(order.id)}
            className="p-5 hover:bg-gray-50/80 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left Section - Order Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-gray-400">
                    #{order.order_number}
                  </span>
                  <span className="text-gray-300">•</span>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FaCalendarAlt className="w-3 h-3" />
                    {formatDate(order.created_at)}
                  </p>
                  <span className="text-gray-300">•</span>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    {order.delivery_type === "delivery" ? (
                      <>
                        <FaMotorcycle className="w-3 h-3" />
                        Delivery
                      </>
                    ) : (
                      <>
                        <FaStore className="w-3 h-3" />
                        Pickup
                      </>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <span
                      key={idx}
                      className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded-md"
                    >
                      {item.menu?.name}
                      {item.qty > 1 && (
                        <span className="text-gray-500 ml-1">(x{item.qty})</span>
                      )}
                    </span>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Right Section - Status & Total */}
              <div className="flex items-center gap-4 md:flex-col md:items-end">
                <OrderStatusBadge status={order.status} />
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(order.total_price)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;