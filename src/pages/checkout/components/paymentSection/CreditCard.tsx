import React from 'react';
import { CardDetails } from '../../../../types/checkout';
import { SiVisa, SiMastercard } from 'react-icons/si';

interface CreditCardFormProps {
  cardDetails: CardDetails;
  errors: Partial<Record<keyof CardDetails, string>>;
  onChange: (details: CardDetails) => void;
  onCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExpiryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCvvChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({
  cardDetails,
  errors,
  onChange,
  onCardNumberChange,
  onExpiryChange,
  onCvvChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Card Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
        <div className="relative">
          <input
            type="text"
            value={cardDetails.number}
            onChange={onCardNumberChange}
            placeholder="1234 5678 9012 3456"
            className={`w-full px-4 py-2.5 border ${
              errors.number ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-700 font-mono text-sm`}
            maxLength={19}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
            <SiVisa className="w-5 h-5 text-blue-600" />
            <SiMastercard className="w-5 h-5 text-orange-600" />
          </div>
        </div>
        {errors.number && <p className="text-xs text-red-500 mt-1">{errors.number}</p>}
      </div>

      {/* Cardholder Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
        <input
          type="text"
          value={cardDetails.name}
          onChange={(e) => onChange({ ...cardDetails, name: e.target.value })}
          placeholder="John Doe"
          className={`w-full px-4 py-2.5 border ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-700 text-sm`}
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* Expiry Date and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
          <input
            type="text"
            value={cardDetails.expiry}
            onChange={onExpiryChange}
            placeholder="MM/YY"
            className={`w-full px-4 py-2.5 border ${
              errors.expiry ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-700 text-sm`}
            maxLength={5}
          />
          {errors.expiry && <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
          <input
            type="password"
            value={cardDetails.cvv}
            onChange={onCvvChange}
            placeholder="123"
            className={`w-full px-4 py-2.5 border ${
              errors.cvv ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-700 text-sm`}
            maxLength={3}
          />
          {errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>}
        </div>
      </div>

      {/* Save Card Checkbox */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="saveCard"
          checked={cardDetails.saveCard}
          onChange={(e) => onChange({ ...cardDetails, saveCard: e.target.checked })}
          className="w-4 h-4 text-red-700 border-gray-300 rounded focus:ring-red-200"
        />
        <label htmlFor="saveCard" className="text-sm text-gray-600">
          Save card for future payments
        </label>
      </div>
    </div>
  );
};

export default CreditCardForm;