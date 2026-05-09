import React from 'react';
import { FaExclamationTriangle, FaRefresh } from 'react-icons/fa';

interface OrderErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const OrderErrorState: React.FC<OrderErrorStateProps> = ({
  message = 'Failed to load orders',
  onRetry,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-red-100 overflow-hidden shadow-sm">
      <div className="p-12 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaExclamationTriangle className="w-10 h-10 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Orders</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-700 text-white rounded-xl font-medium hover:bg-red-800 transition-colors shadow-sm hover:shadow"
          >
            <FaRefresh className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderErrorState;