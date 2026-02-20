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
  FaDownload,
  FaHome,
  FaQrcode,
} from 'react-icons/fa';
import { SiGooglemaps } from 'react-icons/si';
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
  notes?: string;
  variants?: string[];
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
  updated_at: string;
  items: OrderItem[];
  user?: {
    name: string;
    email: string;
  };
  transaction_id?: string;
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
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Fetch order history when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchOrderHistory();
    } else {
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

  // Real-time countdown for estimated time
  useEffect(() => {
    if (selectedOrder?.estimated_minutes && selectedOrder.status === 'PROCESSING') {
      const updateCountdown = () => {
        const createdTime = new Date(selectedOrder.created_at).getTime();
        const estimatedTime = createdTime + (selectedOrder.estimated_minutes || 0) * 60000;
        const now = new Date().getTime();
        const remaining = estimatedTime - now;

        if (remaining <= 0) {
          setTimeRemaining('Siap diambil');
        } else {
          const minutes = Math.floor(remaining / 60000);
          const seconds = Math.floor((remaining % 60000) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')} menit`);
        }
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [selectedOrder]);

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
      
      // Generate transaction ID if not exists
      if (!orderData.transaction_id) {
        orderData.transaction_id = `TXN${Math.floor(Math.random() * 1000000000)}`;
      }
      
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
        return 'bg-yellow-100 text-yellow-700';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-700';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
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

  const handleDownloadStruk = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Struk Pesanan #${order.order_number}</title>
            <style>
              body { font-family: 'Courier New', monospace; padding: 20px; max-width: 300px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 20px; }
              .header h1 { font-size: 18px; margin: 0; }
              .header p { font-size: 12px; color: #666; margin: 5px 0; }
              .divider { border-top: 1px dashed #000; margin: 15px 0; }
              .item { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px; }
              .item-detail { font-size: 10px; color: #666; margin-left: 10px; }
              .total { display: flex; justify-content: space-between; font-weight: bold; margin-top: 10px; }
              .footer { text-align: center; font-size: 10px; color: #666; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Kenangan Kopi</h1>
              <p>Jl. Sudirman No. 123, Jakarta Pusat</p>
              <p>Telp: 021-1234567</p>
            </div>
            
            <div class="divider"></div>
            
            <p><strong>Order #${order.order_number}</strong></p>
            <p>${formatDate(order.created_at)}</p>
            
            <div class="divider"></div>
            
            <p><strong>${order.delivery_type === 'delivery' ? 'Delivery' : 'Pickup'}</strong></p>
            ${order.delivery_type === 'pickup' ? `
              <p>Pickup di: Ruko Bandara Mas</p>
              <p>Pickup di Counter</p>
            ` : ''}
            
            <div class="divider"></div>
            
            <p><strong>Pesanan (Total ${order.items.length} items)</strong></p>
            
            ${order.items.map(item => `
              <div>
                <div class="item">
                  <span>${item.qty} x ${item.name}</span>
                  <span>${formatCurrency(item.price)}</span>
                </div>
                ${item.variants ? `<div class="item-detail">${item.variants.join(', ')}</div>` : ''}
              </div>
            `).join('')}
            
            <div class="divider"></div>
            
            <div class="item">
              <span>Subtotal</span>
              <span>${formatCurrency(order.total_price - order.shipping_cost)}</span>
            </div>
            <div class="item">
              <span>Tax</span>
              <span>${formatCurrency(order.total_price * 0.11)}</span>
            </div>
            <div class="item">
              <span>Total</span>
              <span><strong>${formatCurrency(order.total_price)}</strong></span>
            </div>
            
            <div class="divider"></div>
            
            <div class="item">
              <span>Payment Method</span>
              <span>${order.payment_method === 'cash' ? 'Cash' : 'QRIS'}</span>
            </div>
            <div class="item">
              <span>Transaksi ID</span>
              <span>${order.transaction_id || 'N/A'}</span>
            </div>
            
            <div class="footer">
              <p>All Price are inclusive Tax</p>
              <p>Terima kasih telah berbelanja!</p>
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
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {viewMode === 'detail' ? (
                <button
                  onClick={handleBackToHistory}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              ) : (
                <FaHistory className="w-6 h-6 text-red-700" />
              )}
              <h2 className="text-2xl font-bold text-gray-800">
                {viewMode === 'detail' ? 'Detail Pesanan' : 'Riwayat Pesanan'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
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
                Coba Lagi
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
                  Belum Ada Pesanan
                </h3>
                <p className="text-gray-500 mb-6">
                  Anda belum melakukan pemesanan. Yuk pesan kopi favoritmu!
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-red-700 text-white rounded-xl font-medium hover:bg-red-800 transition-colors"
                >
                  Mulai Belanja
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
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
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
                          <span className="capitalize">
                            {order.delivery_type === 'delivery' ? 'Delivery' : 'Pickup'}
                          </span>
                        </div>
                      </div>
                      <p className="font-semibold text-red-700">
                        {formatCurrency(order.total_price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </div>
                      <button className="text-red-700 text-sm font-medium group-hover:underline">
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // DETAIL VIEW - Inspired by the image
            selectedOrder && (
              <div className="space-y-6">
                {/* Pickup Header */}
                <div className="text-center">
                  <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status === 'COMPLETED' ? '✓ Selesai' : getStatusText(selectedOrder.status)}
                  </span>
                </div>

                {/* Store Info */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800">Kenangan VIP</h3>
                  <p className="text-2xl font-bold text-red-700 mt-1">
                    {formatCurrency(selectedOrder.total_price)}
                  </p>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-3">Detail Pesanan</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <FaUser className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Nama Pelanggan</p>
                        <p className="font-medium">{selectedOrder.user?.name || 'Fikri Aziz Mudzaki'}</p>
                      </div>
                    </div>
                    
                    {selectedOrder.delivery_type === 'pickup' && (
                      <div className="flex items-start gap-2 mt-3">
                        <FaStore className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">Pickup di</p>
                          <p className="font-medium">Ruko Bandara Mas</p>
                          <p className="text-sm text-gray-500">Pickup di Counter</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Pesanan (Total {selectedOrder.items.length} items)
                  </h4>
                  
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="border-b border-gray-200 pb-3 last:border-0">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium text-gray-800">
                            {item.qty} x {item.name}
                          </span>
                          <span className="text-sm font-medium text-gray-800">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                        {item.variants && item.variants.length > 0 && (
                          <p className="text-xs text-gray-500 ml-4">
                            {item.variants.join(' • ')}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-xs text-gray-500 ml-4">Note: {item.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-3">Detail Pembayaran</h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaksi ID</span>
                      <span className="font-mono text-xs">{selectedOrder.transaction_id || 'N/A'}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-600">Total</span>
                      <div className="text-right">
                        <span className="font-bold text-lg text-red-700">
                          {formatCurrency(selectedOrder.total_price)}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {selectedOrder.payment_method === 'cash' ? 'Cash' : 'QRIS'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estimated Time for PROCESSING orders */}
                {selectedOrder.status === 'PROCESSING' && selectedOrder.estimated_minutes && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaClock className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-gray-600">Estimasi Siap</span>
                      </div>
                      <span className="font-semibold text-blue-700">{timeRemaining}</span>
                    </div>
                  </div>
                )}

                {/* Tax Info */}
                <p className="text-xs text-center text-gray-400">
                  All Price are inclusive Tax
                </p>

                {/* Action Buttons - Matching the image */}
                <div className="flex flex-col gap-3 pt-4">
                  <button
                    onClick={() => handleDownloadStruk(selectedOrder)}
                    className="w-full bg-red-700 text-white py-3 rounded-xl font-medium hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaDownload className="w-4 h-4" />
                    Download Struk
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="w-full border border-gray-300 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Kembali Ke Beranda
                  </button>
                </div>

                {/* View All History Link */}
                <button
                  onClick={handleBackToHistory}
                  className="w-full text-center text-sm text-red-700 hover:text-red-800 font-medium"
                >
                  Lihat Semua Pesanan
                </button>
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