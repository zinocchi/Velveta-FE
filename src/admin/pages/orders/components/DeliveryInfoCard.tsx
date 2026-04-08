// src/admin/pages/orders/components/DeliveryInfoCard.tsx

import React from 'react';
import { Order } from '../../../types/order';
import { FaMotorcycle, FaStore, FaClock, FaMapMarkerAlt, FaPhone, FaUser } from 'react-icons/fa';

interface DeliveryInfoCardProps {
  order: Order;
}

const DeliveryInfoCard: React.FC<DeliveryInfoCardProps> = ({ order }) => {
  const isDelivery = order.delivery_type === 'delivery';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 bg-gray-50/50 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          {isDelivery ? (
            <FaMotorcycle className="w-4 h-4 text-gray-500" />
          ) : (
            <FaStore className="w-4 h-4 text-gray-500" />
          )}
          Delivery Information
        </h3>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Method</p>
          <p className="font-medium text-gray-900 capitalize">{order.delivery_type}</p>
        </div>

        {isDelivery && order.shipping_address && (
          <>
            <div>
              <p className="text-xs text-gray-500 mb-1">Recipient</p>
              <p className="font-medium text-gray-900 flex items-center gap-1">
                <FaUser className="w-3 h-3 text-gray-400" />
                {order.shipping_address.recipient_name || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Phone Number</p>
              <p className="font-medium text-gray-900 flex items-center gap-1">
                <FaPhone className="w-3 h-3 text-gray-400" />
                {order.shipping_address.phone_number || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Address</p>
              <p className="font-medium text-gray-900 flex items-start gap-1">
                <FaMapMarkerAlt className="w-3 h-3 text-gray-400 mt-0.5" />
                {order.shipping_address.address || 'N/A'}
              </p>
              {order.shipping_address.detail && (
                <p className="text-sm text-gray-600 mt-1 ml-4">{order.shipping_address.detail}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">City</p>
                <p className="font-medium text-gray-900">{order.shipping_address.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Postal Code</p>
                <p className="font-medium text-gray-900">{order.shipping_address.postal_code || 'N/A'}</p>
              </div>
            </div>
          </>
        )}

        {order.estimated_minutes && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Est. Preparation Time</p>
            <p className="font-medium text-gray-900 flex items-center gap-1">
              <FaClock className="w-4 h-4 text-gray-400" />
              {order.estimated_minutes} minutes
            </p>
          </div>
        )}

        {!order.shipping_address && order.delivery_type === 'pickup' && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
            <p className="font-medium text-gray-900">
              Velveta Coffee - Jl. Sudirman No. 123, Jakarta Pusat
            </p>
            <p className="text-xs text-gray-500 mt-1">Please bring your order number for pickup</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryInfoCard;