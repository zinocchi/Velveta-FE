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
} from "react-icons/fa";
import api from "../../../api/axios";
import type{ Order } from "../../types/index";
import OrderStatusBadge from "./components/OrderStatusBadges";

interface OrderDetailProps {
  orderId: number;
  onStatusUpdate: (orderId: number, status: string) => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ orderId, onStatusUpdate }) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

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
    await onStatusUpdate(orderId, status);
    fetchOrderDetail(); // Refresh data
  };

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
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-700"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/orders")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <FaArrowLeft className="w-4 h-4" />
        <span>Back to Orders</span>
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Order #{order.order_number}
          </h1>
          <p className="text-gray-500 flex items-center gap-2">
            <FaCalendarAlt className="w-4 h-4" />
            {formatDate(order.created_at)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} size="lg" />
      </div>

      {/* Status Update */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Update Status</h3>
        <div className="flex gap-3">
          <button
            onClick={() => handleStatusUpdate("PROCESSING")}
            disabled={order.status === "PROCESSING"}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark as Processing
          </button>
          <button
            onClick={() => handleStatusUpdate("COMPLETED")}
            disabled={order.status === "COMPLETED"}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark as Completed
          </button>
          <button
            onClick={() => handleStatusUpdate("CANCELLED")}
            disabled={order.status === "CANCELLED"}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel Order
          </button>
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden">
                  {item.menu.image_url ? (
                    <img
                      src={item.menu.image_url}
                      alt={item.menu.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.menu.name}</h4>
                  <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(item.price * item.qty)}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-600">Subtotal</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(order.total_price - (order.shipping_cost || 0))}
              </span>
            </div>
            {order.shipping_cost > 0 && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-medium text-gray-600">Shipping Cost</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(order.shipping_cost)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-red-700">
                {formatCurrency(order.total_price)}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Delivery Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaUser className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{order.user?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{order.user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {order.delivery_type === "delivery" ? (
                  <FaMotorcycle className="w-5 h-5 text-gray-400" />
                ) : (
                  <FaStore className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <p className="text-sm text-gray-500">Method</p>
                  <p className="font-medium text-gray-900 capitalize">{order.delivery_type}</p>
                </div>
              </div>

              {order.delivery_type === "delivery" && order.shipping_address && (
                <>
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium text-gray-900">{order.shipping_address.address}</p>
                      {order.shipping_address.detail && (
                        <p className="text-sm text-gray-500">{order.shipping_address.detail}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCity className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">City</p>
                      <p className="font-medium text-gray-900">{order.shipping_address.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaPhone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{order.shipping_address.phone_number}</p>
                    </div>
                  </div>
                </>
              )}

              {order.estimated_minutes && (
                <div className="flex items-center gap-3">
                  <FaClock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Est. Time</p>
                    <p className="font-medium text-gray-900">{order.estimated_minutes} minutes</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Method</p>
                <p className="font-medium text-gray-900 capitalize">{order.payment_method}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;