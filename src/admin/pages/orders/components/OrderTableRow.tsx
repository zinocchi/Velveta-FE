import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaReceipt, FaCalendarAlt, FaMotorcycle, FaStore } from 'react-icons/fa';
import { Order } from '../../../types/order';
import OrderStatusBadge from './OrderStatusBadges';
import { formatCurrency, formatDateShort } from '../../../utils/formatters';

interface OrderTableRowProps {
  order: Order;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onStatusUpdate: (orderId: number, newStatus: string) => void;
  onViewReceipt: (order: Order) => void;
}

const OrderTableRow: React.FC<OrderTableRowProps> = ({
  order,
  isSelected,
  onSelect,
  onStatusUpdate,
  onViewReceipt,
}) => {
  const navigate = useNavigate();

  const getPaymentMethodName = (method: string) => {
    const methods: Record<string, string> = {
      credit_card: 'Credit Card',
      e_wallet: 'E-Wallet',
      bank_transfer: 'Bank Transfer',
      cash: 'Cash',
    };
    return methods[method] || method.replace('_', ' ');
  };

  return (
    <div className="p-5 hover:bg-gray-50/80 transition-all duration-200">
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="w-4 h-4 text-red-700 rounded border-gray-300 focus:ring-red-200"
          />
        </div>

        {/* Order Info */}
        <div className="flex-1 grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900">#{order.order_number}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <FaCalendarAlt className="w-3 h-3" />
              {formatDateShort(order.created_at)}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              {order.delivery_type === 'delivery' ? (
                <><FaMotorcycle className="w-3 h-3" /> Delivery</>
              ) : (
                <><FaStore className="w-3 h-3" /> Pickup</>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">{order.user?.username || 'N/A'}</p>
            <p className="text-xs text-gray-500">{order.user?.email || 'N/A'}</p>
          </div>

          <div>
            <div className="flex flex-wrap gap-1">
              {order.items.slice(0, 2).map((item, idx) => (
                <span key={idx} className="text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded-md">
                  {item.menu?.name || 'Unknown'} x{item.qty}
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
            <p className="text-sm font-bold text-gray-900">{formatCurrency(order.total_price)}</p>
            <p className="text-xs text-gray-500 mt-1">{getPaymentMethodName(order.payment_method)}</p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="w-40 flex flex-col items-end gap-2">
          <OrderStatusBadge status={order.status} />

          <div className="flex gap-1">
            <select
              value=""
              onChange={(e) => onStatusUpdate(order.id, e.target.value)}
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
              title="View Details"
            >
              <FaEye className="w-4 h-4 text-gray-500" />
            </button>

            <button
              onClick={() => onViewReceipt(order)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="View Receipt"
            >
              <FaReceipt className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTableRow;