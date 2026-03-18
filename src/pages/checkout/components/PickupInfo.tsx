import React from 'react';
import { FaStore, FaClock, FaInfoCircle } from 'react-icons/fa';

const PickupInfo: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <FaStore className="w-6 h-6 text-red-700" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">Pick up location</h3>
          <p className="text-sm text-gray-600 mt-1">Our official Coffee shop</p>
          <p className="text-sm text-gray-600">Jl. Sudirman No. 123, Jakarta Pusat</p>
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
            <FaClock className="w-3 h-3" />
            Ready in 15-30 minutes
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-red-700 bg-red-50 p-2 rounded-lg">
            <FaInfoCircle />
            <span>Bring your order number for pickup.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupInfo;