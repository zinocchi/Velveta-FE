import React from 'react';
import { Order } from '../../../types/order';
import OrderStatusBadge from './OrderStatusBadges';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { FaBox, FaCalendarAlt, FaMotorcycle, FaStore } from 'react-icons/fa';

interface OrderDetailCardProps {
  order: Order;
}

const OrderDetailCard: React.FC<OrderDetailCardProps> = ({ order }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-50 rounded-xl">
            <FaBox className="w-6 h-6 text-red-700" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h1>
              <OrderStatusBadge status={order.status} size="md" />
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FaCalendarAlt className="w-4 h-4" />
                {formatDateTime(order.created_at)}
              </span>
              <span className="flex items-center gap-1">
                {order.delivery_type === 'delivery' ? (
                  <FaMotorcycle className="w-4 h-4" />
                ) : (
                  <FaStore className="w-4 h-4" />
                )}
                <span className="capitalize">{order.delivery_type}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">Total Amount</p>
          <p className="text-3xl font-bold text-red-700">{formatCurrency(order.total_price)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailCard;