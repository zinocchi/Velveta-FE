// src/components/modal/OrderDetailModal.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  FaTimes,
  FaClock,
  FaMotorcycle,
  FaStore,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCreditCard,
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
  FaArrowLeft,
  FaPrint,
  FaDownload,
} from "react-icons/fa";
import api from "../../api/axios";

interface OrderDetailModalProps {
  isOpen: boolean;
  orderId: string | null;
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
  payment_method: string;
  delivery_type: "delivery" | "pickup";
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

const STATUS_STEPS = [
  { key: "PENDING", label: "Pending", icon: FaHourglassHalf },
  { key: "PROCESSING", label: "Processing", icon: FaSpinner },
  { key: "COMPLETED", label: "Completed", icon: FaCheckDouble },
];

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  orderId,
  onClose,
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [estimatedCompletion, setEstimatedCompletion] = useState<string | null>(
    null,
  );
  const [showReceipt, setShowReceipt] = useState(false);

  const modalContentRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetail(orderId);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, orderId]);

  useEffect(() => {
    // Clear interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!order || order.status !== "PROCESSING" || !order.estimated_minutes) {
      setTimeRemaining(null);
      setEstimatedCompletion(null);
      return;
    }

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const createdTime = new Date(order.created_at).getTime();
    const estimatedMs = order.estimated_minutes * 60 * 1000;
    const completionTime = createdTime + estimatedMs;

    const completionDate = new Date(completionTime);
    setEstimatedCompletion(
      completionDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );

    const updateTime = () => {
      const now = new Date().getTime();
      const remaining = completionTime - now;

      if (remaining <= 0) {
        setTimeRemaining(0);
        setOrder((prev) => (prev ? { ...prev, status: "COMPLETED" } : null));
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

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [order?.id, order?.status]);

  const fetchOrderDetail = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setShowReceipt(false);

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

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleClose = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    onClose();
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
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRemainingTime = (ms: number) => {
    const minutes = Math.floor(ms / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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
        return <FaHourglassHalf className="w-4 h-4" />;
      case "PROCESSING":
        return <FaSpinner className="w-4 h-4 animate-spin" />;
      case "COMPLETED":
        return <FaCheckCircle className="w-4 h-4" />;
      case "CANCELLED":
        return <FaBan className="w-4 h-4" />;
      default:
        return <FaBox className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pending Payment";
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

  const getCurrentStatusIndex = (status: string) => {
    return STATUS_STEPS.findIndex((step) => step.key === status);
  };

  const handleShareWhatsApp = () => {
    if (!order) return;
    const message = `Hello, I would like to ask about my order status:\n\nOrder: ${order.order_number}\nTotal: ${formatCurrency(order.total_price)}\nStatus: ${getStatusText(order.status)}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (!order) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      const formattedTime = currentDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Receipt #${order.order_number}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: 'Courier New', Courier, monospace;
                background: #fff;
                padding: 20px;
                display: flex;
                justify-content: center;
              }
              .receipt {
                max-width: 320px;
                width: 100%;
                background: white;
                border: 2px dashed #333;
                padding: 20px 15px;
                position: relative;
              }
              .receipt::before, .receipt::after {
                content: '';
                position: absolute;
                width: 20px;
                height: 20px;
                background: white;
                border: 2px solid #333;
                border-radius: 50%;
              }
              .receipt::before { top: -12px; left: -12px; }
              .receipt::after { top: -12px; right: -12px; }
              .header { text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px dashed #333; }
              .store-name { font-size: 24px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 5px; }
              .store-address { font-size: 12px; margin-bottom: 3px; }
              .store-phone { font-size: 12px; margin-bottom: 10px; }
              .receipt-title {
                font-size: 18px; font-weight: bold; margin: 10px 0;
                text-transform: uppercase; border-top: 1px dashed #333;
                border-bottom: 1px dashed #333; padding: 5px 0;
              }
              .info-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px; }
              .items-with-images { margin: 15px 0; }
              .item-row {
                display: flex; align-items: center; gap: 10px;
                padding: 8px 0; border-bottom: 1px dashed #ddd;
              }
              .item-image { width: 40px; height: 40px; object-fit: cover; border-radius: 4px; }
              .item-details { flex: 1; }
              .totals { margin-top: 15px; border-top: 2px dashed #333; padding-top: 10px; }
              .total-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 5px; }
              .grand-total { font-size: 18px; font-weight: bold; margin-top: 10px; padding-top: 10px; border-top: 2px dashed #333; }
              .payment-info { margin: 15px 0; padding: 10px 0; border-top: 1px dashed #333; border-bottom: 1px dashed #333; font-size: 12px; }
              .footer { text-align: center; margin-top: 20px; padding-top: 10px; border-top: 2px dashed #333; font-size: 11px; }
              .thank-you { font-size: 16px; font-weight: bold; margin: 10px 0; text-transform: uppercase; }
              @media print { body { padding: 0; } .receipt { border: none; } .receipt::before, .receipt::after { display: none; } }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <div class="store-name">Velveta Coffee</div>
                <div class="store-address">Jl. Sudirman No. 123</div>
                <div class="store-address">Jakarta Pusat, 12345</div>
                <div class="store-phone">Telp: (021) 1234-5678</div>
              </div>
              
              <div class="receipt-title">PAYMENT RECEIPT</div>
              
              <div class="info-row">
                <span>Order No.</span>
                <span><strong>#${order.order_number}</strong></span>
              </div>
              <div class="info-row">
                <span>Date</span>
                <span>${formattedDate}</span>
              </div>
              <div class="info-row">
                <span>Time</span>
                <span>${formattedTime}</span>
              </div>
              
              <div class="items-with-images">
                ${order.items
                  .map(
                    (item) => `
                  <div class="item-row">
                    ${item.menu.image_url ? `<img src="${item.menu.image_url}" alt="${item.menu.name}" class="item-image" />` : `<div class="item-image" style="display:flex; align-items:center; justify-content:center; background:#f0f0f0;"><span style="font-size:10px; color:#999;">No Image</span></div>`}
                    <div class="item-details">
                      <p><strong>${item.menu.name}</strong></p>
                      <p>${item.qty} x ${formatCurrency(item.price).replace("Rp", "").trim()}</p>
                    </div>
                    <div style="font-weight:bold;">
                      ${formatCurrency(item.price * item.qty)
                        .replace("Rp", "")
                        .trim()}
                    </div>
                  </div>
                `,
                  )
                  .join("")}
              </div>
              
              <div class="totals">
                <div class="total-row">
                  <span>Subtotal</span>
                  <span>${formatCurrency(
                    order.total_price - order.shipping_cost,
                  )
                    .replace("Rp", "")
                    .trim()}</span>
                </div>
                <div class="total-row">
                  <span>Shipping</span>
                  <span>${order.shipping_cost === 0 ? "FREE" : formatCurrency(order.shipping_cost).replace("Rp", "").trim()}</span>
                </div>
                <div class="grand-total">
                  <span>TOTAL</span>
                  <span>${formatCurrency(order.total_price).replace("Rp", "").trim()}</span>
                </div>
              </div>
              
              <div class="payment-info">
                <div class="info-row">
                  <span>Payment Method</span>
                  <span>${order.payment_method === "cash" ? "CASH" : "DEBIT/CREDIT"}</span>
                </div>
                <div class="info-row">
                  <span>Status</span>
                  <span>${getStatusText(order.status).toUpperCase()}</span>
                </div>
                <div class="info-row">
                  <span>Delivery</span>
                  <span>${order.delivery_type === "delivery" ? "DELIVERY" : "PICKUP"}</span>
                </div>
              </div>
              
              <div class="footer">
                <div class="thank-you">THANK YOU</div>
                <div>Enjoy your meal!</div>
                <div style="margin-top: 10px;">* Keep this receipt as proof of payment</div>
              </div>
            </div>
            <script>window.onload = function() { window.print(); }</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const ReceiptView = () => {
    if (!order) return null;

    return (
      <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 font-mono">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold uppercase tracking-wider">
            Velveta Coffee
          </h3>
          <p className="text-sm text-gray-600">Jl. Sudirman No. 123</p>
          <p className="text-sm text-gray-600">Jakarta Pusat, 12345</p>
          <p className="text-sm text-gray-600">Telp: (021) 1234-5678</p>
        </div>

        <div className="text-center mb-4">
          <h4 className="text-lg font-bold uppercase border-t border-b border-dashed border-gray-400 py-2">
            Payment Receipt
          </h4>
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Order No.</span>
            <span className="font-bold">#{order.order_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date</span>
            <span>{formatDate(order.created_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Cashier</span>
            <span>System</span>
          </div>
        </div>

        <div className="mb-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 py-2 border-b border-dashed border-gray-200">
              {item.menu.image_url ? (
                <img
                  src={item.menu.image_url}
                  alt={item.menu.name}
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <FaBox className="w-6 h-6 text-gray-500" />
              )}
              
            <div className="flex-1">
                <p className="font-medium text-sm">{item.menu.name}</p>
                <p className="text-xs text-gray-500">
                  {item.qty} x{" "}
                  {formatCurrency(item.price).replace("Rp", "").trim()}
                </p>
              </div>
              <div className="font-medium text-sm">
                {formatCurrency(item.price * item.qty)
                  .replace("Rp", "")
                  .trim()}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>
              {formatCurrency(order.total_price - order.shipping_cost)
                .replace("Rp", "")
                .trim()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>
              {order.shipping_cost === 0
                ? "FREE"
                : formatCurrency(order.shipping_cost).replace("Rp", "").trim()}
            </span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-dashed border-gray-400">
            <span>TOTAL</span>
            <span className="text-red-700">
              {formatCurrency(order.total_price).replace("Rp", "").trim()}
            </span>
          </div>
        </div>

        <div className="space-y-1 text-xs mb-4 p-3 bg-gray-50 rounded">
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-medium">
              {order.payment_method === "cash" ? "CASH" : "DEBIT/CREDIT"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status</span>
            <span
              className={`font-medium ${getStatusColor(order.status).split(" ")[1]}`}>
              {getStatusText(order.status).toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery</span>
            <span className="font-medium">
              {order.delivery_type === "delivery" ? "DELIVERY" : "PICKUP"}
            </span>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="font-bold text-lg uppercase">Thank You</p>
          <p className="text-sm text-gray-600">Enjoy your meal!</p>
          <p className="text-xs text-gray-500 mt-2">
            * Keep this receipt as proof of payment
          </p>
        </div>

        <div className="flex justify-center mt-6 gap-3">
          <button
            onClick={handlePrint}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center gap-2">
            <FaPrint className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-red-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-800 transition-colors flex items-center gap-2">
            <FaDownload className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        ref={modalContentRef}
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fadeIn"
        onClick={handleModalClick}>
        <div className="sticky top-0 bg-gradient-to-r from-red-700 to-red-800 text-white p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showReceipt ? (
                <button
                  onClick={() => setShowReceipt(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <FaArrowLeft className="w-5 h-5" />
                </button>
              ) : null}
              <h2 className="text-2xl font-bold">
                {showReceipt ? "Payment Receipt" : "Order Details"}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700 mb-4"></div>
              <p className="text-gray-600">Loading order details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-2">Error</p>
              <p className="text-gray-500 text-sm">{error}</p>
              <button
                onClick={() => orderId && fetchOrderDetail(orderId)}
                className="mt-4 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800">
                Try Again
              </button>
            </div>
          ) : !order ? (
            <div className="text-center py-12">
              <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600">Order not found</p>
            </div>
          ) : showReceipt ? (
            <ReceiptView />
          ) : (
            <div className="space-y-6">
              {/* Order Info */}
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
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              {order.status !== "CANCELLED" && (
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
                          width: `${(getCurrentStatusIndex(order.status) / (STATUS_STEPS.length - 1)) * 100}%`,
                        }}
                      />
                    </div>

                    <div className="relative flex justify-between">
                      {STATUS_STEPS.map((step, index) => {
                        const Icon = step.icon;
                        const isActive =
                          index <= getCurrentStatusIndex(order.status);
                        const isCurrent = step.key === order.status;

                        return (
                          <div
                            key={step.key}
                            className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                isActive
                                  ? "bg-red-600 border-red-600 text-white"
                                  : "bg-white border-gray-300 text-gray-400"
                              } ${isCurrent ? "ring-4 ring-red-200" : ""}`}>
                              {isActive && step.key === "COMPLETED" ? (
                                <FaCheckCircle className="w-5 h-5" />
                              ) : (
                                <Icon
                                  className={`w-5 h-5 ${step.key === "PROCESSING" && isActive ? "animate-spin" : ""}`}
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
                              order.estimated_minutes &&
                              step.key === "PROCESSING" && (
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
              )}

              {/* Countdown Timer */}
              {order.status === "PROCESSING" && order.estimated_minutes && (
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
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
                          {order.delivery_type === "delivery"
                            ? "Delivery"
                            : "Pickup"}
                          !
                        </div>
                        <p className="text-sm text-blue-100">
                          Your order is now ready
                        </p>
                      </>
                    ) : (
                      <div className="text-3xl font-bold mb-2">
                        Calculating...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Date & Time */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Order Date & Time</p>
                    <p className="font-medium text-gray-800">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery/Pickup Info */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  {order.delivery_type === "delivery" ? (
                    <FaMotorcycle className="w-5 h-5 text-red-600" />
                  ) : (
                    <FaStore className="w-5 h-5 text-red-600" />
                  )}
                  <h3 className="font-semibold text-gray-800">
                    {order.delivery_type === "delivery"
                      ? "Delivery Information"
                      : "Pickup Information"}
                  </h3>
                </div>

                {order.delivery_type === "delivery" &&
                order.shipping_address ? (
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
                      {order.payment_method === "cash" ? (
                        <FaMoneyBillWave className="w-4 h-4 text-green-600" />
                      ) : (
                        <FaCreditCard className="w-4 h-4 text-blue-600" />
                      )}
                      {order.payment_method === "cash"
                        ? "Cash on Delivery"
                        : "Debit/Credit Card"}
                    </span>
                  </div>
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
                        {formatTime(order.paid_at)}
                      </span>
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
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 rounded-lg flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
                        {item.menu.image_url ? (
                          <img
                            src={item.menu.image_url}
                            alt={item.menu.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaStore className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {item.menu.name}
                        </p>
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
                  onClick={handleShareWhatsApp}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  <FaWhatsapp className="w-4 h-4" />
                  Share
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

export default OrderDetailModal;
