import React from 'react';
import { AddressFormData, AddressType } from '../../../../types/checkout';

interface AddressFormProps {
  formData: AddressFormData;
  onChange: (data: AddressFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    onChange({ ...formData, [name]: newValue });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address label
        </label>
        <input
          type="text"
          name="label"
          required
          value={formData.label}
          onChange={handleChange}
          placeholder="Example: Home, Office"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipient's name
          </label>
          <input
            type="text"
            name="recipientName"
            required
            value={formData.recipientName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            required
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street address
        </label>
        <input
          type="text"
          name="address"
          required
          value={formData.address}
          onChange={handleChange}
          placeholder="Street name, building, house number"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address details (Optional)
        </label>
        <input
          type="text"
          name="detail"
          value={formData.detail}
          onChange={handleChange}
          placeholder="RT/RW, block, unit number"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
          >
            <option>Jakarta Selatan</option>
            <option>Jakarta Pusat</option>
            <option>Jakarta Utara</option>
            <option>Jakarta Barat</option>
            <option>Jakarta Timur</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
          <input
            type="text"
            name="postalCode"
            required
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address type</label>
        <div className="flex gap-4">
          {(['home', 'office', 'other'] as AddressType[]).map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value={type}
                checked={formData.type === type}
                onChange={handleChange}
                className="text-red-700 focus:ring-red-700"
              />
              <span className="capitalize text-sm text-gray-700">
                {type === 'home' ? 'Home' : type === 'office' ? 'Office' : 'Other'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="setDefault"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="rounded text-red-700 focus:ring-red-700"
        />
        <label htmlFor="setDefault" className="text-sm text-gray-700">
          Set default address
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-red-700 text-white py-2 rounded-lg font-medium hover:bg-red-800 transition-colors"
        >
          {isEditing ? 'Update Address' : 'Save Address'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddressForm;