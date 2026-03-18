// src/pages/checkout/components/AddressSection/AddressSection.tsx

import React from 'react';
import { FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import { Address } from '../../../../types/checkout';
import AddressCard from './AddressCard';
import AddressForm from './AdressForm';

interface AddressSectionProps {
  addresses: Address[];
  selectedAddressId: string;
  onSelectAddress: (id: string) => void;
  onEditAddress: (address: Address) => void;
  onDeleteAddress: (addressId: string, addressLabel: string) => void;
  onSetDefault: (addressId: string) => void;
  showAddressForm: boolean;
  addressForm: any;
  onAddressFormChange: (data: any) => void;
  onAddressFormSubmit: (e: React.FormEvent) => void;
  onAddressFormCancel: () => void;
  onAddNewClick: () => void;
  isEditing?: boolean;
}

const AddressSection: React.FC<AddressSectionProps> = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onEditAddress,
  onDeleteAddress,
  onSetDefault,
  showAddressForm,
  addressForm,
  onAddressFormChange,
  onAddressFormSubmit,
  onAddressFormCancel,
  onAddNewClick,
  isEditing = false,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-red-700" />
          <h2 className="text-lg font-semibold text-gray-800">Shipping Address</h2>
        </div>
        <button
          onClick={onAddNewClick}
          className="flex items-center gap-1 text-sm text-red-700 hover:text-red-800 font-medium transition-colors"
        >
          <FaPlus className="w-3 h-3" />
          Add address
        </button>
      </div>

      {!showAddressForm ? (
        <div className="space-y-3">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isSelected={selectedAddressId === address.id}
              onSelect={() => onSelectAddress(address.id)}
              onEdit={() => onEditAddress(address)}
              onDelete={() => onDeleteAddress(address.id, address.label)}
              onSetDefault={() => onSetDefault(address.id)}
              showSetDefault={!address.isDefault}
            />
          ))}

          {addresses.length === 0 && (
            <div className="text-center py-8">
              <FaMapMarkerAlt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No addresses have been saved yet</p>
              <button
                onClick={onAddNewClick}
                className="mt-2 text-red-700 hover:text-red-800 font-medium"
              >
                Add first address
              </button>
            </div>
          )}
        </div>
      ) : (
        <AddressForm
          formData={addressForm}
          onChange={onAddressFormChange}
          onSubmit={onAddressFormSubmit}
          onCancel={onAddressFormCancel}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default AddressSection;