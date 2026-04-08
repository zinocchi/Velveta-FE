import React from 'react';
import { Order } from '../../../types/order';
import { FaUser, FaEnvelope } from 'react-icons/fa';

interface CustomerInfoCardProps {
  order: Order;
}

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({ order }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 bg-gray-50/50 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <FaUser className="w-4 h-4 text-gray-500" />
          Customer Information
        </h3>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Username</p>
          <p className="font-medium text-gray-900">{order.user?.username || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Email Address</p>
          <p className="font-medium text-gray-900 flex items-center gap-1">
            <FaEnvelope className="w-3 h-3 text-gray-400" />
            {order.user?.email || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoCard;