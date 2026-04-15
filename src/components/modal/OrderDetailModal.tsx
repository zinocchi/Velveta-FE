import React, { useState, useEffect, useRef } from "react";
import {
  FaTimes,
  FaClock,
  FaMotorcycle,
  FaStore,
  FaMapMarkerAlt,
  FaBox,
  FaWhatsapp,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaReceipt,
  FaHourglassHalf,
  FaCheckDouble,
  FaBan,
} from "react-icons/fa";
import api from "../../services/api/config";
import ReceiptModal from "../../admin/components/ReceiptModal";
import { Order, OrderStatus, DeliveryType, OrderItem } from "../../types/order";
import { PaymentMethodConfig } from "../../types/payment";
import {
  formatCurrency,
  formatDateTime,
  formatTimeOnly,
} from "../../utils/formatters";

const STATUS_CONFIG = {
  [OrderStatus.PENDING]: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: FaHourglassHalf,
    label: "Pending Payment",
  },
  [OrderStatus.PROCESSING]: {
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: FaSpinner,
    label: "Processing",
  },
  [OrderStatus.COMPLETED]: {
    color: "bg-green-100 text-green-700 border-green-200",
    icon: FaCheckCircle,
    label: "Completed",
  },
  [OrderStatus.CANCELLED]: {
    color: "bg-red-100 text-red-700 border-red-200",
    icon: FaBan,
    label: "Cancelled",
  },
};

const STATUS_STEPS = [
  { key: OrderStatus.PENDING, label: "Pending", icon: FaHourglassHalf },
  { key: OrderStatus.PROCESSING, label: "Processing", icon: FaSpinner },
  { key: OrderStatus.COMPLETED, label: "Completed", icon: FaCheckDouble },
];

interface ExtendedOrder extends Order {
  user_id: number;
  payment_method: {
    id: number;
    code: string;
    name: string;
    icon: string;
    description: string;
  };
  payment_details?: {
    card_number?: string;
    card_last4?: string;
    card_brand?: string;
    provider?: string;
    phone?: string;
    bank?: string;
  };
  e_wallet_provider?: string;
  bank_code?: string;
  card_last4?: string;
  shipping_cost: number;
  shipping_address?: any;
  estimated_minutes?: number;
  paid_at?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

interface OrderDetailModalProps {
  isOpen: boolean;
  orderId: string | null;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  orderId,
  onClose,
}) => {
  const [order, setOrder] = useState<ExtendedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [estimatedCompletion, setEstimatedCompletion] = useState<string | null>(
    null,
  );
  const [showReceipt, setShowReceipt] = useState(false);

  const modalContentRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Fetch order detail
  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetail(orderId);
    }
  }, [isOpen, orderId]);

  // Timer logic
  useEffect(() => {
    if (!order?.estimated_minutes) {
      setTimeRemaining(null);
      setEstimatedCompletion(null);
      return;
    }

    const createdTime = new Date(order.created_at).getTime();
    const estimatedMs = order.estimated_minutes * 60 * 1000;
    const completionTime = createdTime + estimatedMs;

    setEstimatedCompletion(
      new Date(completionTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );

    if (order.status === OrderStatus.PROCESSING) {
      const updateTime = () => {
        const now = Date.now();
        const remaining = completionTime - now;

        if (remaining <= 0) {
          setTimeRemaining(0);
          setOrder((prev) =>
            prev ? { ...prev, status: OrderStatus.COMPLETED } : null,
          );
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        } else {
          setTimeRemaining(remaining);
        }
      };

      updateTime();
      intervalRef.current = setInterval(updateTime, 1000);
    } else {
      setTimeRemaining(null);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [order?.id, order?.status, order?.created_at, order?.estimated_minutes]);

  const fetchOrderDetail = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/orders/${id}`);
      const orderData = response.data.data || response.data;

      if (!orderData.estimated_minutes) {
        orderData.estimated_minutes = 15;
      }

      setOrder(orderData);
    } catch (err: any) {
      console.error("Failed to fetch order detail:", err);
      setError(err.response?.data?.message || "Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    onClose();
  };

  const formatRemainingTime = (ms: number) => {
    const minutes = Math.floor(ms / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getCurrentStatusIndex = (status: OrderStatus) => {
    return STATUS_STEPS.findIndex((step) => step.key === status);
  };

  const getPaymentMethodDisplay = (order: ExtendedOrder) => {
    const method = order.payment_method;
    const methods: Record<string, string> = {
      credit_card: "Credit Card",
      e_wallet: "E-Wallet",
      bank_transfer: "Bank Transfer",
    };

    return {
      name:
        method?.name ||
        (method?.code ? methods[method.code] || method.code : "Cash"),
      code: method?.code,
    };
  };

  const handleShareWhatsApp = () => {
    if (!order) return;
    const message = `Hello, I would like to ask about my order status:\n\nOrder: ${order.order_number}\nTotal: ${formatCurrency(order.total_price)}\nStatus: ${STATUS_CONFIG[order.status].label}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (!isOpen) return null;

  const statusConfig = order ? STATUS_CONFIG[order.status] : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={modalContentRef}
          className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fadeIn pointer-events-auto"
          onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-red-700 to-red-800 text-white p-6 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Order Details</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState
                error={error}
                onRetry={() => orderId && fetchOrderDetail(orderId)}
              />
            ) : !order ? (
              <EmptyState />
            ) : (
              <div className="space-y-6">
                {/* Order Info Header */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border border-red-200">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order Number</p>
                      <p className="text-xl font-bold text-gray-800">
                        #{order.order_number}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${statusConfig?.color}`}>
                        {statusConfig && (
                          <statusConfig.icon className="w-4 h-4" />
                        )}
                        {statusConfig?.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                {order.status !== OrderStatus.CANCELLED && (
                  <StatusTimeline
                    status={order.status}
                    estimatedMinutes={order.estimated_minutes}
                    estimatedCompletion={estimatedCompletion}
                    getCurrentStatusIndex={getCurrentStatusIndex}
                  />
                )}

                {/* Countdown Timer */}
                {order.status === OrderStatus.PROCESSING &&
                  order.estimated_minutes && (
                    <CountdownTimer
                      timeRemaining={timeRemaining}
                      estimatedCompletion={estimatedCompletion}
                      deliveryType={order.delivery_type}
                      formatRemainingTime={formatRemainingTime}
                    />
                  )}

                {/* Date & Time */}
                <InfoCard
                  icon={<FaCalendarAlt className="w-5 h-5 text-red-600" />}
                  label="Order Date & Time"
                  value={formatDateTime(order.created_at)}
                />

                {/* Delivery/Pickup Info */}
                <DeliveryInfo order={order} />

                {/* Payment Details */}
                <PaymentDetails order={order} />

                {/* Order Items */}
                <OrderItemsList items={order.items} />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleShareWhatsApp}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    <FaWhatsapp className="w-4 h-4" />
                    Share via WhatsApp
                  </button>
                  <button
                    onClick={() => setShowReceipt(true)}
                    className="flex-1 bg-red-700 text-white py-3 rounded-xl font-medium hover:bg-red-800 transition-colors flex items-center justify-center gap-2">
                    <FaReceipt className="w-4 h-4" />
                    View Receipt
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        order={order}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </>
  );
};

// Sub-components
const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700 mb-4" />
    <p className="text-gray-600">Loading order details...</p>
  </div>
);

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({
  error,
  onRetry,
}) => (
  <div className="text-center py-12">
    <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
    <p className="text-red-600 mb-2">Error</p>
    <p className="text-gray-500 text-sm">{error}</p>
    <button
      onClick={onRetry}
      className="mt-4 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800">
      Try Again
    </button>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-12">
    <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
    <p className="text-gray-600">Order not found</p>
  </div>
);

interface StatusTimelineProps {
  status: OrderStatus;
  estimatedMinutes?: number;
  estimatedCompletion: string | null;
  getCurrentStatusIndex: (status: OrderStatus) => number;
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({
  status,
  estimatedMinutes,
  estimatedCompletion,
  getCurrentStatusIndex,
}) => (
  <div className="bg-gray-50 p-4 rounded-xl">
    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <FaClock className="w-4 h-4 text-red-600" />
      Order Progress
    </h3>
    <div className="relative">
      <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
        <div
          className="h-full bg-red-600 transition-all duration-500"
          style={{
            width: `${(getCurrentStatusIndex(status) / (STATUS_STEPS.length - 1)) * 100}%`,
          }}
        />
      </div>

      <div className="relative flex justify-between">
        {STATUS_STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= getCurrentStatusIndex(status);
          const isCurrent = step.key === status;

          return (
            <div key={step.key} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isActive
                    ? "bg-red-600 border-red-600 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                } ${isCurrent ? "ring-4 ring-red-200" : ""}`}>
                {isActive && step.key === OrderStatus.COMPLETED ? (
                  <FaCheckCircle className="w-5 h-5" />
                ) : (
                  <Icon
                    className={`w-5 h-5 ${step.key === OrderStatus.PROCESSING && isActive ? "animate-spin" : ""}`}
                  />
                )}
              </div>
              <p
                className={`text-xs mt-2 font-medium ${
                  isActive ? "text-red-600" : "text-gray-400"
                }`}>
                {step.label}
              </p>
              {isCurrent &&
                estimatedMinutes &&
                step.key === OrderStatus.PROCESSING && (
                  <p className="text-xs text-gray-500 mt-1">
                    Est. {estimatedCompletion}
                  </p>
                )}
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

interface CountdownTimerProps {
  timeRemaining: number | null;
  estimatedCompletion: string | null;
  deliveryType: DeliveryType;
  formatRemainingTime: (ms: number) => string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  timeRemaining,
  estimatedCompletion,
  deliveryType,
  formatRemainingTime,
}) => (
  <div className="bg-gradient-to-r from-green-600 to-green-600 text-white p-6 rounded-xl shadow-lg">
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <FaClock className="w-5 h-5 animate-pulse" />
        <p className="text-sm font-medium uppercase tracking-wider">
          Estimated Ready Time
        </p>
      </div>
      {timeRemaining !== null && timeRemaining > 0 ? (
        <>
          <div className="text-5xl font-mono font-bold mb-2">
            {formatRemainingTime(timeRemaining)}
          </div>
          <p className="text-sm text-blue-100">
            (Estimated at {estimatedCompletion})
          </p>
        </>
      ) : timeRemaining === 0 ? (
        <>
          <div className="text-3xl font-bold mb-2">
            ✓ Ready for{" "}
            {deliveryType === DeliveryType.DELIVERY ? "Delivery" : "Pickup"}!
          </div>
          <p className="text-sm text-blue-100">Your order is now ready</p>
        </>
      ) : (
        <div className="text-3xl font-bold mb-2">Calculating...</div>
      )}
    </div>
  </div>
);

const InfoCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="bg-gray-50 p-4 rounded-xl">
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

const DeliveryInfo: React.FC<{ order: ExtendedOrder }> = ({ order }) => (
  <div className="bg-gray-50 p-4 rounded-xl">
    <div className="flex items-center gap-3 mb-3">
      {order.delivery_type === DeliveryType.DELIVERY ? (
        <FaMotorcycle className="w-5 h-5 text-red-600" />
      ) : (
        <FaStore className="w-5 h-5 text-red-600" />
      )}
      <h3 className="font-semibold text-gray-800">
        {order.delivery_type === DeliveryType.DELIVERY
          ? "Delivery Information"
          : "Pickup Information"}
      </h3>
    </div>

    {order.delivery_type === DeliveryType.DELIVERY && order.shipping_address ? (
      <div className="ml-8 space-y-2">
        <p className="text-sm text-gray-600 flex items-start gap-2">
          <FaMapMarkerAlt className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <span>
            {order.shipping_address.full_address ||
              `${order.shipping_address.address}, ${order.shipping_address.city}`}
          </span>
        </p>
        {order.shipping_address.recipientName && (
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <FaUser className="w-4 h-4 text-gray-400" />
            {order.shipping_address.recipientName}
          </p>
        )}
        {order.shipping_address.phoneNumber && (
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <FaPhone className="w-4 h-4 text-gray-400" />
            {order.shipping_address.phoneNumber}
          </p>
        )}
      </div>
    ) : (
      <div className="ml-8">
        <p className="text-sm text-gray-600">
          Pickup at our store: Jl. Sudirman No. 123, Jakarta Pusat
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Please bring your order number for pickup
        </p>
      </div>
    )}
  </div>
);

const PaymentDetails: React.FC<{ order: ExtendedOrder }> = ({ order }) => {
  const { name: methodName, code } = (() => {
    const method = order.payment_method;
    const methods: Record<string, string> = {
      credit_card: "Credit Card",
      e_wallet: "E-Wallet",
      bank_transfer: "Bank Transfer",
    };
    return {
      name:
        method?.name ||
        (method?.code ? methods[method.code] || method.code : "Cash"),
      code: method?.code,
    };
  })();

  return (
    <div className="bg-gray-50 p-4 rounded-xl">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <FaReceipt className="w-4 h-4 text-red-600" />
        Payment Details
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Payment Method</span>
          <span className="font-medium text-gray-800">{methodName}</span>
        </div>

        {code === "e_wallet" && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Provider</span>
              <span className="font-medium text-gray-800">
                {order.e_wallet_provider || order.payment_details?.provider}
              </span>
            </div>
            {order.payment_details?.phone && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phone Number</span>
                <span className="font-medium text-gray-800">
                  {order.payment_details.phone}
                </span>
              </div>
            )}
          </>
        )}

        {code === "bank_transfer" && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Bank</span>
            <span className="font-medium text-gray-800 uppercase">
              {order.bank_code || order.payment_details?.bank}
            </span>
          </div>
        )}

        {code === "credit_card" && order.card_last4 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Card Number</span>
            <span className="font-medium text-gray-800">
              •••• •••• •••• {order.card_last4}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-800">
            {formatCurrency(order.total_price - order.shipping_cost)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping Cost</span>
          <span className="text-gray-800">
            {order.shipping_cost === 0
              ? "Free"
              : formatCurrency(order.shipping_cost)}
          </span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
          <span className="font-semibold text-gray-800">Total</span>
          <span className="font-bold text-lg text-red-700">
            {formatCurrency(order.total_price)}
          </span>
        </div>
        {order.paid_at && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Paid at</span>
            <span className="text-gray-800">
              {formatTimeOnly(order.paid_at)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const OrderItemsList: React.FC<{ items: OrderItem[] }> = ({ items }) => (
  <div className="bg-gray-50 p-4 rounded-xl">
    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
      <FaBox className="w-4 h-4 text-red-600" />
      Order Items
    </h3>
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 rounded-lg flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
            {item.menu.image_url ? (
              <img
                src={item.menu.image_url}
                alt={item.menu.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaBox className="w-6 h-6 text-red-700" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800">{item.menu.name}</p>
            <p className="text-sm text-gray-500">
              {item.qty} x {formatCurrency(item.price)}
            </p>
          </div>
          <span className="font-medium text-gray-800">
            {formatCurrency(item.price * item.qty)}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default OrderDetailModal;
