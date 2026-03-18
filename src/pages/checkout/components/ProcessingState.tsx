import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const ProcessingState: React.FC = () => {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="bg-white rounded-xl shadow-lg p-12">
        <div className="relative">
          <div className="w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>
          </div>
          <FaSpinner className="w-12 h-12 text-red-600 mx-auto mt-6 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-2">Processing Payment</h2>
        <p className="text-gray-600">Please wait while we process your payment...</p>
        <p className="text-sm text-gray-500 mt-4">Do not close this window</p>
      </div>
    </div>
  );
};

export default ProcessingState;