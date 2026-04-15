// src/components/ReceiptModal.tsx

import React, { useRef } from "react";
import { FaPrint, FaDownload, FaTimes } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Order } from "../types/order";
import {
  formatCurrency,
  formatDateShort,
  formatDateTime,
  formatTimeOnly,
} from "../../utils/formatters";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, order }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getPaymentMethodName = (method: string) => {
    const methods: Record<string, string> = {
      credit_card: "Credit Card",
      e_wallet: "E-Wallet",
      bank_transfer: "Bank Transfer",
      cash: "Cash",
    };
    return methods[method?.toLowerCase()] || method?.replace('_', ' ') || "Cash";
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING": return "Pending";
      case "PROCESSING": return "Processing";
      case "COMPLETED": return "Completed";
      case "CANCELLED": return "Cancelled";
      default: return status;
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const formattedDate = formatDate(order.created_at);
    const formattedTime = formatTimeOnly(order.created_at);
    const subtotal = order.total_price - (order.shipping_cost || 0);

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
            .items { margin: 15px 0; }
            .item-row {
              display: flex; justify-content: space-between;
              padding: 5px 0; border-bottom: 1px dashed #ddd;
              font-size: 12px;
            }
            .item-name { flex: 2; }
            .item-qty { flex: 0.5; text-align: center; }
            .item-price { flex: 1; text-align: right; }
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
            <div class="info-row">
              <span>Cashier</span>
              <span>System</span>
            </div>
            <div class="info-row">
              <span>Customer</span>
              <span>${order.user?.username || order.user?.username || "Guest"}</span>
            </div>
            
            <div class="items">
              ${order.items.map((item) => `
                <div class="item-row">
                  <div class="item-name">${item.menu.name}</div>
                  <div class="item-qty">${item.qty}x</div>
                  <div class="item-price">${formatCurrency(item.price * item.qty).replace(/Rp\s?/, "").trim()}</div>
                </div>
              `).join("")}
            </div>
            
            <div class="totals">
              <div class="total-row">
                <span>Subtotal</span>
                <span>${formatCurrency(subtotal).replace(/Rp\s?/, "").trim()}</span>
              </div>
              <div class="total-row">
                <span>Shipping</span>
                <span>${!order.shipping_cost || order.shipping_cost === 0 ? "FREE" : formatCurrency(order.shipping_cost).replace(/Rp\s?/, "").trim()}</span>
              </div>
              <div class="grand-total">
                <span>TOTAL</span>
                <span>${formatCurrency(order.total_price).replace(/Rp\s?/, "").trim()}</span>
              </div>
            </div>
            
            <div class="payment-info">
              <div class="info-row">
                <span>Payment Method</span>
                <span>${getPaymentMethodName(order.payment_method).toUpperCase()}</span>
              </div>
              ${order.payment_details?.provider ? `
                <div class="info-row">
                  <span>Provider</span>
                  <span>${order.payment_details.provider}</span>
                </div>
              ` : ""}
              ${order.payment_details?.bank ? `
                <div class="info-row">
                  <span>Bank</span>
                  <span>${order.payment_details.bank.toUpperCase()}</span>
                </div>
              ` : ""}
              ${order.payment_details?.card_last4 ? `
                <div class="info-row">
                  <span>Card</span>
                  <span>•••• ${order.payment_details.card_last4}</span>
                </div>
              ` : ""}
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
          <script>
            window.onload = function() { 
              setTimeout(function() { window.print(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadPDF = async () => {
    const element = receiptRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 150],
      });

      const imgWidth = 80;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      pdf.save(`receipt-${order.order_number}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-lg font-bold text-gray-900">Payment Receipt</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6">
          <div ref={receiptRef} className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 font-mono max-w-md mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold uppercase tracking-wider text-gray-900">
                Velveta Coffee
              </h3>
              <p className="text-sm text-gray-600">Jl. Sudirman No. 123</p>
              <p className="text-sm text-gray-600">Jakarta Pusat, 12345</p>
              <p className="text-sm text-gray-600">Telp: (021) 1234-5678</p>
            </div>

            <div className="text-center mb-4">
              <h4 className="text-lg font-bold uppercase border-t border-b border-dashed border-gray-400 py-2 text-gray-900">
                Payment Receipt
              </h4>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Order No.</span>
                <span className="font-bold text-gray-900">#{order.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="text-gray-900">{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time</span>
                <span className="text-gray-900">{formatTimeOnly(order.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cashier</span>
                <span className="text-gray-900">System</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer</span>
                <span className="text-gray-900">{order.user?.username || order.user?.username || "Guest"}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-700 mb-2 pb-1 border-b border-dashed border-gray-300">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-4 text-right">Price</div>
              </div>
              
              {order.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 text-sm py-1 border-b border-dashed border-gray-200">
                  <div className="col-span-6 text-gray-900 truncate">{item.menu.name}</div>
                  <div className="col-span-2 text-center text-gray-700">{item.qty}x</div>
                  <div className="col-span-4 text-right font-medium text-gray-900">
                    {formatCurrency(item.price * item.qty).replace(/Rp\s?/, "").trim()}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="text-gray-900">
                  {formatCurrency(order.total_price - (order.shipping_cost || 0)).replace(/Rp\s?/, "").trim()}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-gray-900">
                  {!order.shipping_cost || order.shipping_cost === 0
                    ? "FREE"
                    : formatCurrency(order.shipping_cost).replace(/Rp\s?/, "").trim()}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-dashed border-gray-400">
                <span className="text-gray-900">TOTAL</span>
                <span className="text-red-700">
                  {formatCurrency(order.total_price).replace(/Rp\s?/, "").trim()}
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs mb-4 p-3 bg-gray-50 rounded">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium text-gray-900">
                  {getPaymentMethodName(order.payment_method).toUpperCase()}
                </span>
              </div>

              {order.payment_details?.provider && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Provider</span>
                  <span className="font-medium text-gray-900">
                    {order.payment_details.provider}
                  </span>
                </div>
              )}

              {order.payment_details?.bank && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank</span>
                  <span className="font-medium text-gray-900 uppercase">
                    {order.payment_details.bank}
                  </span>
                </div>
              )}

              {order.payment_details?.card_last4 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Card</span>
                  <span className="font-medium text-gray-900">
                    •••• {order.payment_details.card_last4}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`font-medium ${
                  order.status === "COMPLETED" ? "text-green-600" :
                  order.status === "PROCESSING" ? "text-blue-600" :
                  order.status === "CANCELLED" ? "text-red-600" :
                  "text-yellow-600"
                }`}>
                  {getStatusText(order.status).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium text-gray-900">
                  {order.delivery_type === "delivery" ? "DELIVERY" : "PICKUP"}
                </span>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="font-bold text-lg uppercase text-gray-900">Thank You</p>
              <p className="text-sm text-gray-600">Enjoy your meal!</p>
              <p className="text-xs text-gray-500 mt-2">
                * Keep this receipt as proof of payment
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center mt-6 gap-3">
            <button
              onClick={handlePrint}
              className="bg-gray-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <FaPrint className="w-4 h-4" />
              Print Receipt
            </button>
            <button
              onClick={handleDownloadPDF}
              className="bg-red-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-800 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <FaDownload className="w-4 h-4" />
              Download PDF
            </button>
          </div>
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
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ReceiptModal;