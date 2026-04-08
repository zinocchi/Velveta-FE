import React from 'react';
import { Order } from '../../../types/order';
import { FaCreditCard, FaWallet, FaUniversity, FaMoneyBillWave } from 'react-icons/fa';
import { SiVisa, SiMastercard } from 'react-icons/si';

interface PaymentInfoCardProps {
  order: Order;
}

const PaymentInfoCard: React.FC<PaymentInfoCardProps> = ({ order }) => {
  const getPaymentMethodIcon = () => {
    const method = order.payment_method?.toLowerCase();
    switch (method) {
      case 'credit_card':
        return <FaCreditCard className="w-4 h-4 text-blue-600" />;
      case 'e_wallet':
        return <FaWallet className="w-4 h-4 text-purple-600" />;
      case 'bank_transfer':
        return <FaUniversity className="w-4 h-4 text-emerald-600" />;
      default:
        return <FaMoneyBillWave className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPaymentMethodName = () => {
    const method = order.payment_method?.toLowerCase();
    const methods: Record<string, string> = {
      credit_card: 'Credit Card',
      e_wallet: 'E-Wallet',
      bank_transfer: 'Bank Transfer',
      cash: 'Cash',
    };
    return methods[method] || order.payment_method?.replace('_', ' ') || 'Cash';
  };

  const getEWalletIcon = (provider?: string) => {
    if (!provider) return null;
    const providerLower = provider.toLowerCase();
    switch (providerLower) {
      case 'ovo':
        return <span className="text-blue-600 font-bold">OVO</span>;
      case 'gopay':
        return <span className="text-green-600 font-bold">GoPay</span>;
      case 'dana':
        return <span className="text-blue-500 font-bold">DANA</span>;
      default:
        return <span>{provider}</span>;
    }
  };

  const getCardBrandIcon = (brand?: string) => {
    if (!brand) return null;
    const brandLower = brand.toLowerCase();
    switch (brandLower) {
      case 'visa':
        return <SiVisa className="w-5 h-5 text-blue-600" />;
      case 'mastercard':
        return <SiMastercard className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 bg-gray-50/50 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <FaCreditCard className="w-4 h-4 text-gray-500" />
          Payment Information
        </h3>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">{getPaymentMethodIcon()}</div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Payment Method</p>
            <p className="font-medium text-gray-900">{getPaymentMethodName()}</p>
          </div>
        </div>

        {order.payment_method === 'e_wallet' && (
          <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Provider</span>
                <div className="flex items-center gap-2">
                  {getEWalletIcon(order.payment_details?.provider)}
                  <span className="text-sm font-medium text-gray-900">
                    {order.payment_details?.provider || 'N/A'}
                  </span>
                </div>
              </div>
              {order.payment_details?.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Phone Number</span>
                  <span className="text-sm font-medium text-gray-900">
                    {order.payment_details.phone}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {order.payment_method === 'bank_transfer' && (
          <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Bank</span>
              <span className="text-sm font-medium text-gray-900 uppercase">
                {order.payment_details?.bank || 'N/A'}
              </span>
            </div>
          </div>
        )}

        {order.payment_method === 'credit_card' && order.payment_details?.card_last4 && (
          <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getCardBrandIcon(order.payment_details?.card_brand)}
                <span className="text-sm font-medium text-gray-700">
                  •••• •••• •••• {order.payment_details.card_last4}
                </span>
              </div>
              {order.payment_details?.card_brand && (
                <span className="text-xs text-gray-500">{order.payment_details.card_brand}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentInfoCard;