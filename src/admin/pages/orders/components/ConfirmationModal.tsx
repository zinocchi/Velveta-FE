import React from 'react';
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import { OrderStatus, STATUS_CONFIG } from '../../../types/order';

interface ConfirmationModalProps {
  isOpen: boolean;
  type: 'single' | 'bulk';
  newStatus: OrderStatus | string;
  currentStatus?: OrderStatus | string;
  orderNumber?: string;
  selectedCount?: number;
  onConfirm: () => void;
  onCancel: () => void;
  updating: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  type,
  newStatus,
  currentStatus,
  orderNumber,
  selectedCount,
  onConfirm,
  onCancel,
  updating,
}) => {
  if (!isOpen) return null;

  const newStatusConfig = STATUS_CONFIG[newStatus as OrderStatus] || {
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    label: newStatus,
  };

  const currentStatusConfig = currentStatus 
    ? STATUS_CONFIG[currentStatus as OrderStatus] 
    : null;

  const getStatusIcon = () => {
    if (newStatus === 'PROCESSING') return <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />;
    if (newStatus === 'COMPLETED') return <FaCheckCircle className="w-8 h-8 text-green-600" />;
    if (newStatus === 'CANCELLED') return <FaTimesCircle className="w-8 h-8 text-red-600" />;
    return <FaExclamationTriangle className="w-8 h-8 text-yellow-600" />;
  };

  const getBgColor = () => {
    if (newStatus === 'CANCELLED') return 'bg-red-100';
    if (newStatus === 'COMPLETED') return 'bg-green-100';
    return 'bg-blue-100';
  };

  const getButtonColor = () => {
    if (newStatus === 'CANCELLED') return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
    if (newStatus === 'COMPLETED') return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
    return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onCancel} 
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
        {/* Icon */}
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${getBgColor()}`}>
          {getStatusIcon()}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
          Confirm Status Update
        </h3>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">
          {type === 'single' ? (
            <>
              Are you sure you want to change order{' '}
              <span className="font-semibold">#{orderNumber}</span>
              <br />
              status from{' '}
              {currentStatusConfig ? (
                <span className={`inline-flex px-2 py-0.5 rounded-full text-sm ${currentStatusConfig.bgColor} ${currentStatusConfig.color}`}>
                  {currentStatusConfig.label}
                </span>
              ) : (
                <span className="inline-flex px-2 py-0.5 rounded-full text-sm bg-gray-100 text-gray-700">
                  {currentStatus || 'Unknown'}
                </span>
              )}
              {' '}to{' '}
              <span className={`inline-flex px-2 py-0.5 rounded-full text-sm ${newStatusConfig.bgColor} ${newStatusConfig.color}`}>
                {newStatusConfig.label}
              </span>
              ?
            </>
          ) : (
            <>
              Are you sure you want to change{' '}
              <span className="font-semibold">{selectedCount}</span> selected orders
              <br />
              status to{' '}
              <span className={`inline-flex px-2 py-0.5 rounded-full text-sm ${newStatusConfig.bgColor} ${newStatusConfig.color}`}>
                {newStatusConfig.label}
              </span>
              ?
            </>
          )}
        </p>

        {/* Warning Messages */}
        {newStatus === 'CANCELLED' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-yellow-700 flex items-center gap-2">
              <FaExclamationTriangle className="w-4 h-4 flex-shrink-0" />
              Cancelling this order will restore stock for all items.
            </p>
          </div>
        )}

        {newStatus === 'COMPLETED' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-green-700 flex items-center gap-2">
              <FaCheckCircle className="w-4 h-4 flex-shrink-0" />
              Marking as completed will finalize this order.
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={updating}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={updating}
            className={`flex-1 px-4 py-3 rounded-xl text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonColor()}`}
          >
            {updating ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;