import React from 'react';
import { FaCheckCircle, FaClock } from 'react-icons/fa';

const SuccessState: React.FC = () => {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="bg-white rounded-xl shadow-lg p-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <FaCheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-2">Payment Successful!</h2>
        <p className="text-gray-600">Your order has been confirmed and is being processed.</p>
        <p className="text-sm text-green-600 mt-4 flex items-center justify-center gap-2">
          <FaClock className="w-4 h-4" />
          Redirecting to order details...
        </p>
      </div>
    </div>
  );
};

export default SuccessState;