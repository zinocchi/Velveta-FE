import React from 'react';
import { formatCurrency } from '../../../../utils/formatters';

interface PaymentSummaryProps {
  subtotal: number;
  shippingCost: number;
  total: number;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  subtotal,
  shippingCost,
  total,
}) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Order Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-800">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-gray-800">
            {shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 mt-2">
          <span>Total</span>
          <span className="text-red-700">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;