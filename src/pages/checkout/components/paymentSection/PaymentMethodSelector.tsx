import React from 'react';
import { PaymentMethodFromAPI } from '../../../../types/checkout';
import { FaCreditCard, FaWallet, FaUniversity } from 'react-icons/fa';

interface PaymentMethodSelectorProps {
  methods: PaymentMethodFromAPI[];
  selectedMethod: string;
  onSelect: (code: string) => void;
}

const iconMap: Record<string, any> = {
  FaCreditCard,
  FaWallet,
  FaUniversity,
};

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  methods,
  selectedMethod,
  onSelect,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Select Payment Method</h3>
      <div className="grid grid-cols-3 gap-3">
        {methods.map((method) => {
          const Icon = iconMap[method.icon] || FaCreditCard;
          const isSelected = selectedMethod === method.code;

          return (
            <button
              key={method.id}
              onClick={() => onSelect(method.code)}
              className={`p-3 border rounded-lg transition-all flex flex-col items-center gap-1 ${
                isSelected ? 'border-red-700 bg-red-50' : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isSelected ? 'text-red-700' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium ${isSelected ? 'text-red-700' : 'text-gray-600'}`}>
                {method.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;