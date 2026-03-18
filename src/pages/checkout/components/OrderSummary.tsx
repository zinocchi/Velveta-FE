import React from 'react';
import { DeliveryType, DeliveryEstimate } from '../../../types/checkout';
import { FaMotorcycle, FaWalking, FaClock } from 'react-icons/fa';
import { formatCurrency } from '../../../utils/formatters';

interface OrderSummaryProps {
  subtotal: number;
  shippingCost: number;
  total: number;
  deliveryType: DeliveryType;
  deliveryEstimate: DeliveryEstimate | null;
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
  onConfirm: () => void;
  isCartEmpty: boolean;
  paymentMethods?: any[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shippingCost,
  total,
  deliveryType,
  deliveryEstimate,
  termsAccepted,
  onTermsChange,
  onConfirm,
  isCartEmpty,
  paymentMethods = [],
}) => {
  const formatEstimate = (min: number, max: number) => {
    if (max < 60) {
      return `${min}-${max} minutes`;
    } else if (min >= 60) {
      return `${Math.floor(min / 60)}-${Math.floor(max / 60)} hour${
        Math.floor(max / 60) > 1 ? 's' : ''
      }`;
    } else {
      return `${min} minutes - ${Math.floor(max / 60)} hour${
        Math.floor(max / 60) > 1 ? 's' : ''
      }`;
    }
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 sticky top-24 hover:shadow-md transition-shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-red-700 rounded-full"></span>
          Order Summary
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-800">{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center gap-1">
              {deliveryType === 'pickup' ? (
                <FaWalking className="w-3 h-3" />
              ) : (
                <FaMotorcycle className="w-3 h-3" />
              )}
              {deliveryType === 'pickup' ? 'Pickup' : 'Shipping'}
            </span>
            {shippingCost === 0 ? (
              <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full text-xs">
                Free
              </span>
            ) : (
              <span className="font-medium text-gray-800">{formatCurrency(shippingCost)}</span>
            )}
          </div>

          {deliveryType === 'delivery' && deliveryEstimate && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-100">
              <p className="text-xs text-red-700 font-medium mb-1 flex items-center gap-1">
                <FaClock className="w-3 h-3" />
                Estimated delivery
              </p>
              <p className="text-sm text-red-700 font-semibold">{deliveryEstimate.timeRange}</p>
              <p className="text-xs text-gray-500 mt-1">
                ({formatEstimate(deliveryEstimate.minMinutes, deliveryEstimate.maxMinutes)})
              </p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">Total</span>
              <div className="text-right">
                <span className="font-bold text-xl text-red-700">{formatCurrency(total)}</span>
                <p className="text-xs text-gray-500 mt-1">Including tax</p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mt-6">
          <label className="flex items-start gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => onTermsChange(e.target.checked)}
              className="mt-1 text-red-700 focus:ring-red-700 rounded"
            />
            <span className="text-sm text-gray-600">
              I Agree With{' '}
              <button className="text-red-700 hover:text-red-800 font-medium hover:underline">
                Terms & Conditions
              </button>{' '}
              and{' '}
              <button className="text-red-700 hover:text-red-800 font-medium hover:underline">
                Privacy Policy
              </button>
            </span>
          </label>
        </div>

        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          disabled={!termsAccepted || isCartEmpty}
          className="w-full bg-red-700 text-white py-3 rounded-xl font-semibold mt-4 
                   hover:bg-red-800 transition-colors disabled:opacity-50 
                   disabled:cursor-not-allowed disabled:hover:bg-red-700
                   relative overflow-hidden group"
        >
          <span className="relative z-10">Continue to Payment</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>

        {/* Payment Methods Icons */}
        {paymentMethods.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center mb-2">Secure payment via:</p>
            <div className="flex justify-center gap-3">
              {paymentMethods.slice(0, 4).map((method, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  title={method.name}
                >
                  <span className="text-xs font-medium text-gray-600">{method.code}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;