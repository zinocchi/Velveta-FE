import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEye, FaCalendarAlt, FaMotorcycle, FaStore } from "react-icons/fa";
import type { Order } from "../../types";
import OrderStatusBadge from "./components/OrderStatusBadges";

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  filter: string;
  onFilterChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  selectedOrders: number[];
  onSelectOrder: (orderId: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onUpdateStatus: (orderId: number, status: string) => void;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  loading,
  filter,
  onFilterChange,
  search,
  onSearchChange,
  selectedOrders,
  onSelectOrder,
  onSelectAll,
  onUpdateStatus,
}) => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-700"></div>
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by order number or customer name..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {orders.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {/* Header */}
            <div className="p-5 bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="w-4 h-4 text-red-700 rounded border-gray-300 focus:ring-red-200"
                  />
                </div>
                <div className="flex-1 grid grid-cols-4 gap-4 text-xs font-medium text-gray-500 uppercase">
                  <div>Order Info</div>
                  <div>Customer</div>
                  <div>Items</div>
                  <div>Total</div>
                </div>
                <div className="w-32">Status</div>
              </div>
            </div>

            {/* Rows */}
            {orders.map((order) => (
              <div key={order.id} className="p-5 hover:bg-gray-50/80 transition-all duration-200">
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={(e) => onSelectOrder(order.id, e.target.checked)}
                      className="w-4 h-4 text-red-700 rounded border-gray-300 focus:ring-red-200"
                    />
                  </div>

                  {/* Order Info */}
                  <div className="flex-1 grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-400">#{order.order_number}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <FaCalendarAlt className="w-3 h-3" />
                        {formatDate(order.created_at)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
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
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.user?.name}</p>
                      <p className="text-xs text-gray-500">{order.user?.email}</p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-1">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <span key={idx} className="text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded-md">
                            {item.menu?.name} x{item.qty}
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
                      <p className="text-xs text-gray-500">{order.payment_method}</p>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="w-32 flex flex-col items-end gap-2">
                    <OrderStatusBadge status={order.status} />
                    
                    <div className="flex gap-2">
                      <select
                        value=""
                        onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-200"
                      >
                        <option value="">Update</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      
                      <button
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <FaEye className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-900 text-lg font-medium mb-2">
              No orders found
            </p>
            <p className="text-gray-500 text-sm">
              Orders will appear here when customers place them
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderList;