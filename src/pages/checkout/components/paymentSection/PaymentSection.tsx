import React from 'react';
import { PaymentMethod, CardDetails, PaymentMethodFromAPI } from '../../../../types/checkout';
import { FaLock } from 'react-icons/fa';
import { formatCurrency } from '../../../../utils/formatters';
import PaymentMethodSelector from './PaymentMethodSelector';
import CreditCardForm from './CreditCard';
import EWalletForm from './E-WalletForm';
import BankTransferForm from './BankTransferForm';
import PaymentSummary from './PaymentSummary';

interface PaymentSectionProps {
  paymentMethod: PaymentMethod;
  paymentMethods: PaymentMethodFromAPI[];
  onPaymentMethodChange: (method: string) => void;
  
  // Credit Card
  cardDetails: CardDetails;
  cardErrors: Partial<Record<keyof CardDetails, string>>;
  onCardDetailsChange: (details: CardDetails) => void;
  
  // E-Wallet
  selectedEWallet: string;
  phoneNumber: string;
  onEWalletChange: (provider: string) => void;
  onPhoneChange: (phone: string) => void;
  
  // Bank Transfer
  selectedBank: string;
  onBankChange: (bank: string) => void;
  
  // Totals
  subtotal: number;
  shippingCost: number;
  total: number;
  
  // Actions
  onBack: () => void;
  onProcess: () => void;
  processing: boolean;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  paymentMethod,
  paymentMethods,
  onPaymentMethodChange,
  cardDetails,
  cardErrors,
  onCardDetailsChange,
  selectedEWallet,
  phoneNumber,
  onEWalletChange,
  onPhoneChange,
  selectedBank,
  onBankChange,
  subtotal,
  shippingCost,
  total,
  onBack,
  onProcess,
  processing,
}) => {
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
    onCardDetailsChange({ ...cardDetails, number: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    onCardDetailsChange({ ...cardDetails, expiry: value });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    onCardDetailsChange({ ...cardDetails, cvv: value });
  };

  const getCurrentMethod = () => {
    return paymentMethods.find(m => m.code === paymentMethod);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Details</h2>

        {/* Payment Method Selection */}
        <PaymentMethodSelector
          methods={paymentMethods}
          selectedMethod={paymentMethod}
          onSelect={onPaymentMethodChange}
        />

        {/* Credit Card Form */}
        {paymentMethod === 'credit_card' && (
          <CreditCardForm
            cardDetails={cardDetails}
            errors={cardErrors}
            onChange={onCardDetailsChange}
            onCardNumberChange={handleCardNumberChange}
            onExpiryChange={handleExpiryChange}
            onCvvChange={handleCvvChange}
          />
        )}

        {/* E-Wallet Form */}
        {paymentMethod === 'e_wallet' && (
          <EWalletForm
            providers={getCurrentMethod()?.providers}
            selectedProvider={selectedEWallet}
            phoneNumber={phoneNumber}
            onProviderChange={onEWalletChange}
            onPhoneChange={onPhoneChange}
          />
        )}

        {/* Bank Transfer Form */}
        {paymentMethod === 'bank_transfer' && (
          <BankTransferForm
            banks={getCurrentMethod()?.banks}
            selectedBank={selectedBank}
            onBankChange={onBankChange}
          />
        )}

        {/* Order Summary */}
        <PaymentSummary
          subtotal={subtotal}
          shippingCost={shippingCost}
          total={total}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onBack}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Back
          </button>
          <button
            onClick={onProcess}
            disabled={processing}
            className="flex-1 bg-red-700 text-white py-2.5 rounded-lg font-semibold hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            <FaLock className="w-4 h-4" />
            Pay {formatCurrency(total)}
          </button>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-gray-500 mt-4">
          🔒 Your payment information is encrypted and secure
        </p>
      </div>
    </div>
  );
};

export default PaymentSection;