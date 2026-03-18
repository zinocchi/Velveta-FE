import { useState, useEffect } from 'react';
import { Address, AddressFormData } from '../types/checkout';

const DEFAULT_ADDRESS_FORM: AddressFormData = {
  label: '',
  recipientName: '',
  phoneNumber: '',
  address: '',
  detail: '',
  city: 'Jakarta Selatan',
  postalCode: '',
  type: 'home',
  isDefault: false,
};

export const useAddress = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState<AddressFormData>(DEFAULT_ADDRESS_FORM);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    show: boolean;
    addressId: string;
    addressLabel: string;
  }>({
    show: false,
    addressId: '',
    addressLabel: '',
  });

  // Load addresses from localStorage
  useEffect(() => {
    const loadAddresses = () => {
      try {
        const savedAddresses = localStorage.getItem('userAddresses');
        if (savedAddresses) {
          const parsed = JSON.parse(savedAddresses);
          setAddresses(parsed);
          const defaultAddress = parsed.find((addr: Address) => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
          }
        } else {
          // Mock data for demo
          const mockAddresses: Address[] = [
            {
              id: '1',
              label: 'Rumah',
              recipientName: 'John Doe',
              phoneNumber: '081234567890',
              address: 'Jl. Contoh Alamat No. 123',
              detail: 'RT 01 RW 02',
              city: 'Jakarta Selatan',
              postalCode: '12345',
              isDefault: true,
              type: 'home',
            },
            {
              id: '2',
              label: 'Kantor',
              recipientName: 'John Doe',
              phoneNumber: '081234567891',
              address: 'Jl. Sudirman No. 456',
              detail: 'Gedung ABC Lantai 5',
              city: 'Jakarta Pusat',
              postalCode: '67890',
              isDefault: false,
              type: 'office',
            },
          ];
          setAddresses(mockAddresses);
          setSelectedAddressId('1');
        }
      } catch (error) {
        console.error('Failed to load addresses:', error);
      }
    };

    loadAddresses();
  }, []);

  // Save addresses to localStorage
  useEffect(() => {
    if (addresses.length > 0) {
      localStorage.setItem('userAddresses', JSON.stringify(addresses));
    }
  }, [addresses]);

  const resetAddressForm = () => {
    setAddressForm(DEFAULT_ADDRESS_FORM);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      label: address.label,
      recipientName: address.recipientName,
      phoneNumber: address.phoneNumber,
      address: address.address,
      detail: address.detail,
      city: address.city,
      postalCode: address.postalCode,
      type: address.type,
      isDefault: address.isDefault,
    });
    setShowAddressForm(true);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAddress: Address = {
      id: editingAddress?.id || Date.now().toString(),
      ...addressForm,
      isDefault: addressForm.isDefault || addresses.length === 0,
    };

    let updatedAddresses: Address[];

    if (editingAddress) {
      updatedAddresses = addresses.map((addr) =>
        addr.id === editingAddress.id ? newAddress : addr
      );
    } else {
      updatedAddresses = [...addresses, newAddress];
    }

    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === newAddress.id,
      }));
    }

    setAddresses(updatedAddresses);
    setSelectedAddressId(newAddress.id);
    setShowAddressForm(false);
    setEditingAddress(null);
    resetAddressForm();
  };

  const handleDeleteAddress = () => {
    const updatedAddresses = addresses.filter(
      (addr) => addr.id !== showDeleteConfirm.addressId
    );
    setAddresses(updatedAddresses);

    if (selectedAddressId === showDeleteConfirm.addressId) {
      const newDefault = updatedAddresses.find((addr) => addr.isDefault) || updatedAddresses[0];
      if (newDefault) {
        setSelectedAddressId(newDefault.id);
      }
    }

    setShowDeleteConfirm({ show: false, addressId: '', addressLabel: '' });
  };

  const handleSetDefault = (addressId: string) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));
    setAddresses(updatedAddresses);
    setSelectedAddressId(addressId);
  };

  return {
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    showAddressForm,
    setShowAddressForm,
    editingAddress,
    addressForm,
    setAddressForm,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleEditAddress,
    handleAddressSubmit,
    handleDeleteAddress,
    handleSetDefault,
    resetAddressForm,
  };
};