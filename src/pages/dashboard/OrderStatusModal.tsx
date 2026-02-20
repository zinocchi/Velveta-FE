// src/components/OrderStatusModal.tsx
import React, { useState, useEffect } from 'react';
import {
  FaTimes,
  FaClock,
  FaMotorcycle,
  FaStore,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaBox,
  FaPrint,
  FaWhatsapp,
  FaHistory,
  FaShoppingBag,
  FaChevronRight,
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaReceipt,
} from 'react-icons/fa';
import api from '../../api/axios';

interface OrderStatusModalProps {
  isOpen: boolean;
  orderId: string | null;
  onClose: () => void;
}

interface OrderItem {
  id: number;
  menu_id: number;
  name: string;
  qty: number;
  price: number;
  subtotal?: number;
}

interface Order {
  id: number;
  order_number: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  total_price: number;
  payment_method: string;
  delivery_type: 'delivery' | 'pickup';
  shipping_cost: number;
  shipping_address?: any;
  delivery_option?: any;
  estimated_minutes?: number;
  paid_at?: string;
  created_at: string;
  items: OrderItem[];
  user?: {
    name: string;
    email: string;
  };
}

type ViewMode = 'history' | 'detail';

const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  isOpen,
  orderId,
  onClose,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('history');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch order history when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchOrderHistory();
    } else {
      // Reset state when modal closes
      setViewMode('history');
      setSelectedOrder(null);
    }
  }, [isOpen]);

  // Fetch specific order when orderId changes
  useEffect(() => {
    if (orderId && isOpen) {
      fetchOrderDetail(orderId);
    }
  }, [orderId, isOpen]);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/orders/my');
      const ordersData = response.data.data || response.data;
      setOrders(ordersData);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch order history');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetail = async (id: string) => {
    try {
      setLoadingDetail(true);
      setError(null);
      const response = await api.get(`/orders/${id}`);
      const orderData = response.data.data || response.data;
      setSelectedOrder(orderData);
      setViewMode('detail');
    } catch (err: any) {
      console.error('Failed to fetch order detail:', err);
      setError(err.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewMode('detail');
  };

  const handleBackToHistory = () => {
    setViewMode('history');
    setSelectedOrder(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'Baru saja';
    if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return formatDate(dateString);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <FaClock className="w-4 h-4" />;
      case 'PROCESSING':
        return <FaSpinner className="w-4 h-4 animate-spin" />;
      case 'COMPLETED':
        return <FaCheckCircle className="w-4 h-4" />;
      case 'CANCELLED':
        return <FaExclamationTriangle className="w-4 h-4" />;
      default:
        return <FaBox className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Menunggu Pembayaran';
      case 'PROCESSING': return 'Diproses';
      case 'COMPLETED': return 'Selesai';
      case 'CANCELLED': return 'Dibatalkan';
      default: return status;
    }
  };

  const handleShareWhatsApp = (order: Order) => {
    const message = `Halo, saya ingin menanyakan status pesanan saya:\n\nOrder: ${order.order_number}\nTotal: ${formatCurrency(order.total_price)}\nStatus: ${getStatusText(order.status)}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePrint = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Order #${order.order_number}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .order-info { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
              th { background-color: #f5f5f5; }
              .total { font-size: 18px; font-weight: bold; text-align: right; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Order Receipt</h1>
              <p>Order #${order.order_number}</p>
            </div>
            <div class="order-info">
              <p><strong>Date:</strong> ${formatDate(order.created_at)}</p>
              <p><strong>Status:</strong> ${getStatusText(order.status)}</p>
              <p><strong>Payment Method:</strong> ${order.payment_method}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.qty}</td>
                    <td>${formatCurrency(item.price)}</td>
                    <td>${formatCurrency(item.price * item.qty)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total">
              Total: ${formatCurrency(order.total_price)}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-700 to-red-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {viewMode === 'detail' ? (
                <button
                  onClick={handleBackToHistory}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaArrowLeft className="w-5 h-5" />
                </button>
              ) : (
                <FaHistory className="w-6 h-6" />
              )}
              <h2 className="text-2xl font-bold">
                {viewMode === 'detail' ? 'Order Details' : 'Order History'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading || loadingDetail ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FaSpinner className="w-10 h-10 text-red-700 animate-spin mb-4" />
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-2">Error</p>
              <p className="text-gray-500 text-sm">{error}</p>
              <button
                onClick={fetchOrderHistory}
                className="mt-4 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
              >
                Try Again
              </button>
            </div>
          ) : viewMode === 'history' ? (
            // HISTORY VIEW
            orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No Order History
                </h3>
                <p className="text-gray-500 mb-6">
                  You haven't made any purchases yet.
                  Start ordering your favorite coffee!
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-red-700 text-white rounded-xl font-medium hover:bg-red-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              // ORDER HISTORY LIST
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => handleViewOrder(order)}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Order Number</p>
                        <p className="font-semibold text-gray-800">
                          #{order.order_number}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
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
                          <span>{getTimeAgo(order.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          {order.delivery_type === 'delivery' ? (
                            <FaMotorcycle className="w-3 h-3" />
                          ) : (
                            <FaStore className="w-3 h-3" />
                          )}
                          <span className="capitalize">{order.delivery_type}</span>
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
                            className="w-8 h-8 bg-red-100 rounded-full border-2 border-white flex items-center justify-center"
                            title={item.name}
                          >
                            <FaBox className="w-4 h-4 text-red-700" />
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
            )
          ) : (
            // DETAIL VIEW
            selectedOrder && (
              <div className="space-y-6">
                {/* Order Info */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border border-red-200">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order Number</p>
                      <p className="text-xl font-bold text-gray-800">
                        #{selectedOrder.order_number}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-600">Order Date & Time</p>
                      <p className="font-medium text-gray-800">
                        {formatDate(selectedOrder.created_at)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {getTimeAgo(selectedOrder.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Estimated Time */}
                {selectedOrder.estimated_minutes && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <FaClock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Estimated Ready</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {selectedOrder.estimated_minutes} minutes
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery/Pickup Info */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    {selectedOrder.delivery_type === 'delivery' ? (
                      <FaMotorcycle className="w-5 h-5 text-red-600" />
                    ) : (
                      <FaStore className="w-5 h-5 text-red-600" />
                    )}
                    <h3 className="font-semibold text-gray-800">
                      {selectedOrder.delivery_type === 'delivery'
                        ? 'Delivery Information'
                        : 'Pickup Information'}
                    </h3>
                  </div>

                  {selectedOrder.delivery_type === 'delivery' && selectedOrder.shipping_address ? (
                    <div className="ml-8 space-y-2">
                      <p className="text-sm text-gray-600 flex items-start gap-2">
                        <FaMapMarkerAlt className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>
                          {selectedOrder.shipping_address.full_address ||
                           `${selectedOrder.shipping_address.address}, ${selectedOrder.shipping_address.city}`}
                        </span>
                      </p>
                      {selectedOrder.shipping_address.recipientName && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <FaUser className="w-4 h-4 text-gray-400" />
                          {selectedOrder.shipping_address.recipientName}
                        </p>
                      )}
                      {selectedOrder.shipping_address.phoneNumber && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <FaPhone className="w-4 h-4 text-gray-400" />
                          {selectedOrder.shipping_address.phoneNumber}
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

                {/* Payment Info */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaReceipt className="w-4 h-4 text-red-600" />
                    Payment Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium text-gray-800 flex items-center gap-1">
                        {selectedOrder.payment_method === 'cash' ? (
                          <FaMoneyBillWave className="w-4 h-4 text-green-600" />
                        ) : (
                          <FaCreditCard className="w-4 h-4 text-blue-600" />
                        )}
                        {selectedOrder.payment_method === 'cash' ? 'Cash on Delivery' : 'Debit/Credit Card'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-800">
                        {formatCurrency(selectedOrder.total_price - selectedOrder.shipping_cost)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping Cost</span>
                      <span className="text-gray-800">
                        {selectedOrder.shipping_cost === 0 ? 'Free' : formatCurrency(selectedOrder.shipping_cost)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-800">Total</span>
                      <span className="font-bold text-lg text-red-700">
                        {formatCurrency(selectedOrder.total_price)}
                      </span>
                    </div>
                    {selectedOrder.paid_at && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Paid at</span>
                        <span className="text-gray-800">{formatDate(selectedOrder.paid_at)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaBox className="w-4 h-4 text-red-600" />
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
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

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleShareWhatsApp(selectedOrder)}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    Share
                  </button>
                  <button
                    onClick={() => handlePrint(selectedOrder)}
                    className="flex-1 border border-gray-300 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaPrint className="w-4 h-4" />
                    Print
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Custom Animations */}
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
    </div>
  );
};

export default OrderStatusModal;