import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaMotorcycle,
  FaStore,
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaCity,
  FaClock,
  FaCalendarAlt,
  FaShoppingBag,
  FaBox,
  FaCreditCard,
  FaMoneyBillWave,
  FaTag,
  FaTimesCircle,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../../../api/axios";
import type { Order } from "../../types/index";
import OrderStatusBadge from "./components/OrderStatusBadges";

interface OrderDetailProps {
  orderId: number;
  onStatusUpdate: (orderId: number, status: string) => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ orderId, onStatusUpdate }) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/orders/${orderId}`);
      setOrder(response.data.data);
    } catch (error) {
      console.error("Failed to fetch order detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    setUpdating(true);
    try {
      await onStatusUpdate(orderId, status);
      await fetchOrderDetail();
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'credit_card':
      case 'credit card':
        return <FaCreditCard className="w-4 h-4" />;
      case 'cash':
      case 'cash on delivery':
        return <FaMoneyBillWave className="w-4 h-4" />;
      default:
        return <FaTag className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-red-700"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaBox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-6">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/admin/orders")}
            className="px-6 py-3 bg-red-700 text-white rounded-xl font-medium hover:bg-red-800 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/orders")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <div className="p-2 rounded-lg bg-white shadow-sm group-hover:bg-gray-50 transition-colors">
            <FaArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-medium">Back to Orders</span>
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 rounded-xl">
                <FaShoppingBag className="w-6 h-6 text-red-700" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order #{order.order_number}
                  </h1>
                  <OrderStatusBadge status={order.status} size="md" />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="w-4 h-4" />
                    {formatDate(order.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    {order.delivery_type === "delivery" ? (
                      <FaMotorcycle className="w-4 h-4" />
                    ) : (
                      <FaStore className="w-4 h-4" />
                    )}
                    <span className="capitalize">{order.delivery_type}</span>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Order Total */}
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-red-700">
                {formatCurrency(order.total_price)}
              </p>
            </div>
          </div>
        </div>

        {/* Status Update Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Order Status</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleStatusUpdate("PROCESSING")}
              disabled={order.status === "PROCESSING" || updating}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                order.status === "PROCESSING"
                  ? "bg-blue-100 text-blue-700 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {updating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaClock className="w-4 h-4" />
              )}
              Mark as Processing
            </button>
            
            <button
              onClick={() => handleStatusUpdate("COMPLETED")}
              disabled={order.status === "COMPLETED" || updating}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                order.status === "COMPLETED"
                  ? "bg-emerald-100 text-emerald-700 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {updating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaCheckCircle className="w-4 h-4" />
              )}
              Mark as Completed
            </button>
            
            <button
              onClick={() => handleStatusUpdate("CANCELLED")}
              disabled={order.status === "CANCELLED" || updating}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                order.status === "CANCELLED"
                  ? "bg-rose-100 text-rose-700 cursor-not-allowed"
                  : "bg-rose-600 text-white hover:bg-rose-700 shadow-sm hover:shadow"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {updating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaTimesCircle className="w-4 h-4" />
              )}
              Cancel Order
            </button>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
              </div>
              
              <div className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Item Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        {item.menu.image_url ? (
                          <img
                            src={item.menu.image_url}
                            alt={item.menu.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaBox className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {item.menu.name}
                        </h4>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-gray-500">
                            {formatCurrency(item.price)} × {item.qty}
                          </span>
                          <span className="text-gray-300">|</span>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(item.price * item.qty)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(order.total_price - (order.shipping_cost || 0))}
                    </span>
                  </div>
                  {order.shipping_cost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping Cost</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(order.shipping_cost)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-red-700 text-xl">
                      {formatCurrency(order.total_price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Customer & Delivery Info */}
          <div className="space-y-6">
            {/* Customer Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FaUser className="w-4 h-4 text-gray-500" />
                  Customer Information
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Full Name</p>
                  <p className="font-medium text-gray-900">{order.user?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email Address</p>
                  <p className="font-medium text-gray-900">{order.user?.email}</p>
                </div>
              </div>
            </div>

            {/* Delivery Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  {order.delivery_type === "delivery" ? (
                    <FaMotorcycle className="w-4 h-4 text-gray-500" />
                  ) : (
                    <FaStore className="w-4 h-4 text-gray-500" />
                  )}
                  Delivery Information
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Method</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {order.delivery_type}
                  </p>
                </div>

                {order.delivery_type === "delivery" && order.shipping_address && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Recipient</p>
                      <p className="font-medium text-gray-900">
                        {order.shipping_address.recipient_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                      <p className="font-medium text-gray-900">
                        {order.shipping_address.phone_number}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Address</p>
                      <p className="font-medium text-gray-900">
                        {order.shipping_address.address}
                      </p>
                      {order.shipping_address.detail && (
                        <p className="text-sm text-gray-600 mt-1">
                          {order.shipping_address.detail}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">City</p>
                        <p className="font-medium text-gray-900">
                          {order.shipping_address.city}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Postal Code</p>
                        <p className="font-medium text-gray-900">
                          {order.shipping_address.postal_code}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {order.estimated_minutes && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Est. Preparation Time</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <FaClock className="w-4 h-4 text-gray-400" />
                      {order.estimated_minutes} minutes
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FaCreditCard className="w-4 h-4 text-gray-500" />
                  Payment Information
                </h3>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getPaymentMethodIcon(order.payment_method)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {order.payment_method.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OrderDetail;