import React from 'react';
import { DeliveryType } from '../../../types/checkout';
import { FaTruck, FaStore } from 'react-icons/fa';

interface DeliveryTypeSelectorProps {
  deliveryType: DeliveryType;
  onChange: (type: DeliveryType) => void;
}

const DeliveryTypeSelector: React.FC<DeliveryTypeSelectorProps> = ({
  deliveryType,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-red-700 rounded-full"></span>
        Order Method
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onChange('delivery')}
          className={`p-4 border-2 rounded-xl transition-all ${
            deliveryType === 'delivery'
              ? 'border-red-700 bg-red-50'
              : 'border-gray-200 hover:border-red-300'
          }`}
        >
          <FaTruck
            className={`w-6 h-6 mx-auto mb-2 ${
              deliveryType === 'delivery' ? 'text-red-700' : 'text-gray-400'
            }`}
          />
          <p
            className={`font-medium ${
              deliveryType === 'delivery' ? 'text-red-700' : 'text-gray-600'
            }`}
          >
            Delivery
          </p>
          <p className="text-xs text-gray-500 mt-1">Delivered to the address</p>
        </button>

        <button
          onClick={() => onChange('pickup')}
          className={`p-4 border-2 rounded-xl transition-all ${
            deliveryType === 'pickup'
              ? 'border-red-700 bg-red-50'
              : 'border-gray-200 hover:border-red-300'
          }`}
        >
          <FaStore
            className={`w-6 h-6 mx-auto mb-2 ${
              deliveryType === 'pickup' ? 'text-red-700' : 'text-gray-400'
            }`}
          />
          <p
            className={`font-medium ${
              deliveryType === 'pickup' ? 'text-red-700' : 'text-gray-600'
            }`}
          >
            Pickup
          </p>
          <p className="text-xs text-gray-500 mt-1">Pick up at the store</p>
        </button>
      </div>
    </div>
  );
};

export default DeliveryTypeSelector;