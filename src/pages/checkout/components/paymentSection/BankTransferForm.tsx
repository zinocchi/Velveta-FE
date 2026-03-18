import React from 'react';
import { PaymentMethodFromAPI } from '../../../../types/checkout';
import { FaInfoCircle } from 'react-icons/fa';

interface BankTransferFormProps {
  banks?: PaymentMethodFromAPI['banks'];
  selectedBank: string;
  onBankChange: (bank: string) => void;
}

const BankTransferForm: React.FC<BankTransferFormProps> = ({
  banks = [],
  selectedBank,
  onBankChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Bank</label>
        <div className="grid grid-cols-2 gap-3">
          {banks.map((bank) => (
            <button
              key={bank.id}
              onClick={() => onBankChange(bank.name)}
              className={`py-2.5 border rounded-lg transition-all text-sm font-medium ${
                selectedBank === bank.name
                  ? 'border-red-700 bg-red-50 text-red-700'
                  : 'border-gray-200 text-gray-600 hover:border-red-300 hover:bg-gray-50'
              }`}
            >
              {bank.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-start gap-3">
          <FaInfoCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800 mb-1">Bank Transfer Instructions</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              After placing your order, you will receive bank account details to complete the transfer.
              Please complete the payment within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankTransferForm;