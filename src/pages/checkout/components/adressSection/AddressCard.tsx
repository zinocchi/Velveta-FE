import React from 'react';
import { Address } from '../../../../types/checkout';
import { FaHome, FaBriefcase, FaHeart, FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';

interface AddressCardProps {
  address: Address;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
  showSetDefault?: boolean;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
  showSetDefault = true,
}) => {
  const getTypeIcon = () => {
    switch (address.type) {
      case 'home':
        return <FaHome className="w-4 h-4 text-red-700" />;
      case 'office':
        return <FaBriefcase className="w-4 h-4 text-orange-600" />;
      default:
        return <FaHeart className="w-4 h-4 text-purple-600" />;
    }
  };

  const getTypeBg = () => {
    switch (address.type) {
      case 'home':
        return 'bg-red-100';
      case 'office':
        return 'bg-orange-100';
      default:
        return 'bg-purple-100';
    }
  };

  return (
    <div
      className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
        isSelected ? 'border-red-700 bg-red-50' : 'border-gray-200 hover:border-red-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeBg()}`}>
          {getTypeIcon()}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-800">{address.label}</span>
            {address.isDefault && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                Default
              </span>
            )}
            {isSelected && <FaCheckCircle className="w-4 h-4 text-red-700 ml-auto" />}
          </div>
          <p className="text-sm font-medium text-gray-700">{address.recipientName}</p>
          <p className="text-sm text-gray-600 mt-1">
            {address.address}, {address.detail}
          </p>
          <p className="text-sm text-gray-600">
            {address.city} {address.postalCode}
          </p>
          <p className="text-sm text-gray-600 mt-1">{address.phoneNumber}</p>
        </div>
      </div>

      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          <FaEdit className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          <FaTrash className="w-4 h-4" />
        </button>
      </div>

      {showSetDefault && !address.isDefault && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSetDefault();
          }}
          className="mt-2 text-xs text-red-700 hover:text-red-800 font-medium transition-colors"
        >
          Set default
        </button>
      )}
    </div>
  );
};

export default AddressCard;