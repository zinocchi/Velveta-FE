// src/components/modal/OrderHistoryModal.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  FaTimes,
  FaClock,
  FaMotorcycle,
  FaStore,
  FaCalendarAlt,
  FaBox,
  FaShoppingBag,
  FaChevronRight,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHourglassHalf,
  FaCheckDouble,
  FaBan,
  FaHistory,
} from "react-icons/fa";
import api from "../../api/axios";
import OrderDetailModal from "./OrderDetailModal";

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderItem {
  id: number;
  menu_id: number;
  qty: number;
  price: number;
  menu: {
    name: string;
    image_url: string | null;
  };
}

interface Order {
  id: number;
  order_number: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  total_price: number;
  delivery_type: "delivery" | "pickup";
  created_at: string;
  items: OrderItem[];
}

const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      fetchOrderHistory();

      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";

      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/orders/my");
      const ordersData = response.data.data || response.data;
      setOrders(ordersData);
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
      setError(err.response?.data?.message || "Failed to fetch order history");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleViewOrder = (orderId: number) => {
    setSelectedOrderId(orderId.toString());
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrderId(null);
  };

  const handleBrowseMenu = () => {
    onClose();
    window.location.href = "/menu";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffSeconds = Math.floor(diffTime / 1000);

    if (diffSeconds < 60) return "Just now";
    if (diffMinutes < 60)
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "PROCESSING":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <FaHourglassHalf className="w-3 h-3" />;
      case "PROCESSING":
        return <FaSpinner className="w-3 h-3 animate-spin" />;
      case "COMPLETED":
        return <FaCheckCircle className="w-3 h-3" />;
      case "CANCELLED":
        return <FaBan className="w-3 h-3" />;
      default:
        return <FaBox className="w-3 h-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "PROCESSING":
        return "Processing";
      case "COMPLETED":
        return "Completed";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={modalContentRef}
          className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fadeIn pointer-events-auto"
          onClick={handleModalClick}>
          {/* Header - Sticky */}
          <div className="sticky top-0 bg-gradient-to-r from-red-700 to-red-800 text-white p-6 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaHistory className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Order History</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700 mb-4"></div>
                <p className="text-gray-600">Loading your orders...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-2">Error</p>
                <p className="text-gray-500 text-sm">{error}</p>
                <button
                  onClick={fetchOrderHistory}
                  className="mt-4 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800">
                  Try Again
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No Orders Yet
                </h3>
                <p className="text-gray-500 text-center mb-6">
                  You haven't placed any orders yet. Start ordering your
                  favorite coffee now!
                </p>
                <button
                  onClick={handleBrowseMenu}
                  className="px-6 py-3 bg-red-700 text-white rounded-xl font-medium hover:bg-red-800 transition-colors flex items-center gap-2">
                  <span>Browse Menu</span>
                  <span>→</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => handleViewOrder(order.id)}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Order Number</p>
                        <p className="font-semibold text-gray-800">
                          #{order.order_number}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gray-600">
                          <FaCalendarAlt className="w-3 h-3" />
                          <span>{formatDate(order.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          {order.delivery_type === "delivery" ? (
                            <FaMotorcycle className="w-3 h-3" />
                          ) : (
                            <FaStore className="w-3 h-3" />
                          )}
                          <span className="capitalize">
                            {order.delivery_type === "delivery"
                              ? "Delivery"
                              : "Pickup"}
                          </span>
                        </div>
                      </div>
                      <p className="font-semibold text-red-700">
                        {formatCurrency(order.total_price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 bg-red-100 rounded-full border-2 border-white flex items-center justify-center overflow-hidden"
                            title={item.menu?.name}>
                            {item.menu?.image_url ? (
                              <img
                                src={item.menu.image_url}
                                alt={item.menu.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FaBox className="w-4 h-4 text-red-700" />
                            )}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <FaChevronRight className="w-4 h-4 text-gray-400 group-hover:text-red-700 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={showDetailModal}
        orderId={selectedOrderId}
        onClose={handleCloseDetailModal}
      />
    </>
  );
};

export default OrderHistoryModal;
