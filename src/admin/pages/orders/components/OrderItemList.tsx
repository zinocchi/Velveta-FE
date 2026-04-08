import React from 'react';
import { Order } from '../../../types/order';
import { formatCurrency } from '../../../../utils/formatters';
import { FaBox } from 'react-icons/fa';

interface OrderItemsListProps {
  order: Order;
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({ order }) => {
  const subtotal = order.total_price - (order.shipping_cost || 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
      </div>

      <div className="divide-y divide-gray-100">
        {order.items.map((item) => (
          <div key={item.id} className="p-6 hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                {item.menu.image_url ? (
                  <img src={item.menu.image_url} alt={item.menu.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaBox className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{item.menu.name}</h4>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500">{formatCurrency(item.price)} × {item.qty}</span>
                  <span className="text-gray-300">|</span>
                  <span className="font-medium text-gray-900">{formatCurrency(item.price * item.qty)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-gray-50/50 border-t border-gray-100">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
          </div>
          {order.shipping_cost > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping Cost</span>
              <span className="font-medium text-gray-900">{formatCurrency(order.shipping_cost)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
            <span className="text-gray-900">Total</span>
            <span className="text-red-700 text-xl">{formatCurrency(order.total_price)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItemsList;