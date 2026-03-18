import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../../../types/checkout';
import { FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa';
import { formatCurrency } from '../../../utils/formatters';

interface OrderItemsListProps {
  items: CartItem[];
  onIncrease: (itemId: number) => void;
  onDecrease: (itemId: number) => void;
  onAddMore: () => void;
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({
  items,
  onIncrease,
  onDecrease,
  onAddMore,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaShoppingBag className="text-red-700" />
          <h2 className="text-lg font-semibold text-gray-800">Your order</h2>
        </div>
        <span className="text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-600">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 rounded-lg transition-colors px-2"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 rounded-lg flex items-center justify-center shadow-sm">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
            </div>

            <div className="flex-1">
              <p className="font-medium text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-500 mt-1">{formatCurrency(item.price)}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => onDecrease(item.id)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-700 disabled:opacity-50 disabled:hover:bg-gray-50 disabled:hover:text-gray-600 transition-colors"
                >
                  <FaMinus className="w-3 h-3" />
                </button>
                <span className="w-10 text-center font-medium text-gray-700">{item.qty}</span>
                <button
                  onClick={() => onIncrease(item.id)}
                  disabled={item.qty >= 10}
                  className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-700 disabled:opacity-50 disabled:hover:bg-gray-50 disabled:hover:text-gray-600 transition-colors"
                >
                  <FaPlus className="w-3 h-3" />
                </button>
              </div>

              <div className="text-right min-w-[100px]">
                <p className="font-semibold text-red-700">
                  {formatCurrency(item.qty * item.price)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onAddMore}
        className="w-full mt-4 py-3 border-2 border-red-700 text-red-700 rounded-xl font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2 group"
      >
        <FaPlus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
        Add order
      </button>
    </div>
  );
};

export default OrderItemsList;