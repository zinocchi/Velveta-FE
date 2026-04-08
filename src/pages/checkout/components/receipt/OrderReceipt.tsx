import React from 'react';
import { CreateOrderRequest, Order } from '../../../../types/Order';
import { formatCurrency, formatDate } from '../../../../utils/formatters';
import { FaPrint, FaDownload, FaTimes } from 'react-icons/fa';

interface OrderReceiptProps {
  order: Order | null; // 🔥 allow null
  OrderRequest: CreateOrderRequest;
  onClose?: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
  showActions?: boolean;
}

const OrderReceipt: React.FC<OrderReceiptProps> = ({
  order,
  OrderRequest,
  onClose,
  onPrint,
  onDownload,
  showActions = true,
}) => {
  // 🔒 GUARD (paling penting)
  if (!order) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <p className="text-gray-500">Loading order...</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600';
      case 'PROCESSING':
        return 'text-blue-600';
      case 'PENDING':
        return 'text-yellow-600';
      case 'CANCELLED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-red-700 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Order Receipt</h2>
        {onClose && (
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <FaTimes className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Order Info */}
        <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="text-lg font-bold text-gray-800">#{order.order_number}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium text-gray-800">
              {order.created_at ? formatDate(order.created_at) : '-'}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Status</p>
          <p className={`font-semibold ${getStatusColor(order.status)}`}>
            {order.status}
          </p>
        </div>

        {/* Items */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <p className="text-sm text-gray-500 mb-3">Items</p>

          {order.items && order.items.length > 0 ? (
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-800">
                    {item.menu?.name || 'Item'}{' '}
                    <span className="text-gray-500">x{item.qty}</span>
                  </span>
                  <span className="font-medium text-gray-800">
                    {formatCurrency(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No items</p>
          )}
        </div>

        {/* Totals */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-800">
                {formatCurrency(
                  order.total_price - (OrderRequest?.shipping_cost || 0)
                )}
              </span>
            </div>

            {OrderRequest?.shipping_cost > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-800">
                  {formatCurrency(OrderRequest.shipping_cost)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-base font-bold pt-2">
              <span>Total</span>
              <span className="text-red-700">
                {formatCurrency(order.total_price)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment & Delivery */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Payment Method</p>
            <p className="font-medium text-gray-800 capitalize">
              {order.payment_method
                ? order.payment_method.replace('_', ' ')
                : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Delivery Type</p>
            <p className="font-medium text-gray-800">
              {order.delivery_type || '-'}
            </p>
          </div>
        </div>

        {/* Shipping */}
        {OrderRequest?.shipping_address && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
            <p className="font-medium text-gray-800">
              {OrderRequest.shipping_address.recipient_name}
            </p>
            <p className="text-sm text-gray-600">
              {OrderRequest.shipping_address.address}
              {OrderRequest.shipping_address.detail &&
                `, ${OrderRequest.shipping_address.detail}`}
            </p>
            <p className="text-sm text-gray-600">
              {OrderRequest.shipping_address.city}{' '}
              {OrderRequest.shipping_address.postal_code}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {OrderRequest.shipping_address.phone_number}
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && (onPrint || onDownload) && (
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {onPrint && (
              <button
                onClick={onPrint}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <FaPrint className="w-4 h-4" />
                Print Receipt
              </button>
            )}
            {onDownload && (
              <button
                onClick={onDownload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
              >
                <FaDownload className="w-4 h-4" />
                Download PDF
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderReceipt;