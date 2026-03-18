import React from 'react';
import { PaymentMethodFromAPI } from '../../../../types/checkout';

interface EWalletFormProps {
  providers?: PaymentMethodFromAPI['providers'];
  selectedProvider: string;
  phoneNumber: string;
  onProviderChange: (provider: string) => void;
  onPhoneChange: (phone: string) => void;
}

const EWalletForm: React.FC<EWalletFormProps> = ({
  providers = [],
  selectedProvider,
  phoneNumber,
  onProviderChange,
  onPhoneChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select E-Wallet</label>
        <div className="grid grid-cols-3 gap-3">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => onProviderChange(provider.name)}
              className={`py-2.5 border rounded-lg transition-all text-sm font-medium ${
                selectedProvider === provider.name
                  ? 'border-red-700 bg-red-50 text-red-700'
                  : 'border-gray-200 text-gray-600 hover:border-red-300 hover:bg-gray-50'
              }`}
            >
              {provider.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="08xxxxxxxxxx"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-700 text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">Enter your e-wallet registered phone number</p>
      </div>
    </div>
  );
};

export default EWalletForm;