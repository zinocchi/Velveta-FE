import { useCart } from "../../context/CartContext";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  FaWallet, 
  FaCreditCard, 
  FaMoneyBillWave,
  FaShieldAlt,
  FaTruck,
  FaStore,
  FaMapMarkerAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaHome,
  FaBriefcase,
  FaHeart,
  FaClock,
  FaInfoCircle
} from "react-icons/fa";
import { 
  SiMastercard,
  SiVisa
} from "react-icons/si";

interface Address {
  id: string;
  label: string;
  recipientName: string;
  phoneNumber: string;
  address: string;
  detail: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
  type: 'home' | 'office' | 'other';
  latitude?: number;
  longitude?: number;
}

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  estimatedDays: string;
  cost: number;
  icon: any;
}

const CheckoutPage = () => {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  // State untuk pengiriman
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('delivery');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  // State untuk form alamat
  const [addressForm, setAddressForm] = useState({
    label: '',
    recipientName: '',
    phoneNumber: '',
    address: '',
    detail: '',
    city: 'Jakarta Selatan',
    postalCode: '',
    type: 'home' as const,
    isDefault: false
  });

  // State untuk opsi pengiriman
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([
    {
      id: 'regular',
      name: 'Regular Shipping',
      description: 'Delivery within 3-5 days',
      estimatedDays: '3-5',
      cost: 15000,
      icon: FaTruck
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Delivery within 1-2 days',
      estimatedDays: '1-2',
      cost: 30000,
      icon: FaClock
    }
  ]);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('regular');

  // State untuk estimasi pengiriman
  const [deliveryEstimate, setDeliveryEstimate] = useState<{
    minDays: number;
    maxDays: number;
    date: string;
  } | null>(null);

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showAddressList, setShowAddressList] = useState(false);

  // Load saved addresses from localStorage on mount
  useEffect(() => {
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
          type: 'home'
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
          type: 'office'
        }
      ];
      setAddresses(mockAddresses);
      setSelectedAddressId('1');
    }
  }, []);

  // Save addresses to localStorage when updated
  useEffect(() => {
    if (addresses.length > 0) {
      localStorage.setItem('userAddresses', JSON.stringify(addresses));
    }
  }, [addresses]);

  // Calculate delivery estimate
  useEffect(() => {
    if (deliveryType === 'delivery' && selectedDeliveryOption) {
      const option = deliveryOptions.find(opt => opt.id === selectedDeliveryOption);
      if (option) {
        const [min, max] = option.estimatedDays.split('-').map(Number);
        const today = new Date();
        const minDate = new Date(today);
        minDate.setDate(today.getDate() + min);
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + (max || min));
        
        setDeliveryEstimate({
          minDays: min,
          maxDays: max || min,
          date: `${minDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${maxDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`
        });
      }
    }
  }, [selectedDeliveryOption, deliveryType, deliveryOptions]);

  const total = state.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const shippingCost = deliveryType === 'pickup' 
    ? 0 
    : (deliveryOptions.find(opt => opt.id === selectedDeliveryOption)?.cost || 0);
  
  const grandTotal = total + shippingCost;

  // Handle address form submission
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAddress: Address = {
      id: editingAddress?.id || Date.now().toString(),
      ...addressForm,
      isDefault: addressForm.isDefault || addresses.length === 0
    };

    let updatedAddresses: Address[];
    
    if (editingAddress) {
      // Update existing address
      updatedAddresses = addresses.map(addr => 
        addr.id === editingAddress.id ? newAddress : addr
      );
    } else {
      // Add new address
      updatedAddresses = [...addresses, newAddress];
    }

    // Handle default address logic
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === newAddress.id
      }));
    }

    setAddresses(updatedAddresses);
    setSelectedAddressId(newAddress.id);
    setShowAddressForm(false);
    setEditingAddress(null);
    resetAddressForm();
  };

  // Handle address deletion
  const handleDeleteAddress = (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      setAddresses(updatedAddresses);
      
      if (selectedAddressId === addressId) {
        const newDefault = updatedAddresses.find(addr => addr.isDefault) || updatedAddresses[0];
        if (newDefault) {
          setSelectedAddressId(newDefault.id);
        }
      }
    }
  };

  // Handle set as default
  const handleSetDefault = (addressId: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    setAddresses(updatedAddresses);
    setSelectedAddressId(addressId);
  };

  // Reset address form
  const resetAddressForm = () => {
    setAddressForm({
      label: '',
      recipientName: '',
      phoneNumber: '',
      address: '',
      detail: '',
      city: 'Jakarta Selatan',
      postalCode: '',
      type: 'home',
      isDefault: false
    });
  };

  // Edit address
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
      isDefault: address.isDefault
    });
    setShowAddressForm(true);
  };

  const handleCreateOrder = async () => {
    if (state.items.length === 0) return;
    if (!termsAccepted) {
      alert("Please accept the terms and conditions");
      return;
    }
    if (deliveryType === 'delivery' && !selectedAddressId) {
      alert("Please select a shipping address");
      return;
    }

    try {
      setLoading(true);

      const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
      const deliveryOption = deliveryOptions.find(opt => opt.id === selectedDeliveryOption);

      const res = await api.post("/orders", { 
        items: state.items.map((item) => ({ 
          id: item.id,
          qty: item.qty,
        })),
        delivery_type: deliveryType,
        shipping_address: deliveryType === 'delivery' ? {
          ...selectedAddress,
          full_address: `${selectedAddress?.address}, ${selectedAddress?.detail}, ${selectedAddress?.city} ${selectedAddress?.postalCode}`
        } : null,
        delivery_option: deliveryOption,
        payment_method: paymentMethod,
        shipping_cost: shippingCost,
        total: grandTotal,
      });

      dispatch({ type: "CLEAR_CART" });

      navigate(`/checkout/pay/${res.data.order_id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: "cash", name: "Cash on Delivery", icon: FaMoneyBillWave, description: "Pay when you receive" },
    { id: "debit", name: "Debit/Credit Card", icon: FaCreditCard, description: "Visa, Mastercard, JCB" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <span>Cart</span>
            <span>›</span>
            <span className="text-gray-800 font-medium">Checkout</span>
            <span>›</span>
            <span>Payment</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Type Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Method</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDeliveryType('delivery')}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    deliveryType === 'delivery'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FaTruck className={`w-6 h-6 mx-auto mb-2 ${
                    deliveryType === 'delivery' ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <p className={`font-medium ${
                    deliveryType === 'delivery' ? 'text-blue-600' : 'text-gray-600'
                  }`}>Delivery</p>
                  <p className="text-xs text-gray-500 mt-1">Delivered to your address</p>
                </button>

                <button
                  onClick={() => setDeliveryType('pickup')}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    deliveryType === 'pickup'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FaStore className={`w-6 h-6 mx-auto mb-2 ${
                    deliveryType === 'pickup' ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <p className={`font-medium ${
                    deliveryType === 'pickup' ? 'text-blue-600' : 'text-gray-600'
                  }`}>Pickup</p>
                  <p className="text-xs text-gray-500 mt-1">Pick up at store</p>
                </button>
              </div>
            </div>

            {/* Shipping Address Section (only for delivery) */}
            {deliveryType === 'delivery' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <h2 className="text-lg font-semibold text-gray-800">Shipping Address</h2>
                  </div>
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      resetAddressForm();
                      setShowAddressForm(true);
                    }}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <FaPlus className="w-3 h-3" />
                    Add New Address
                  </button>
                </div>

                {/* Address List */}
                {!showAddressForm ? (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          selectedAddressId === address.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedAddressId(address.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            address.type === 'home' ? 'bg-green-100' :
                            address.type === 'office' ? 'bg-orange-100' : 'bg-purple-100'
                          }`}>
                            {address.type === 'home' ? (
                              <FaHome className="w-4 h-4 text-green-600" />
                            ) : address.type === 'office' ? (
                              <FaBriefcase className="w-4 h-4 text-orange-600" />
                            ) : (
                              <FaHeart className="w-4 h-4 text-purple-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-800">
                                {address.label}
                              </span>
                              {address.isDefault && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                              {selectedAddressId === address.id && (
                                <FaCheckCircle className="w-4 h-4 text-blue-500 ml-auto" />
                              )}
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                              {address.recipientName}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {address.address}, {address.detail}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.city} {address.postalCode}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {address.phoneNumber}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAddress(address);
                            }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddress(address.id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Set as Default Button */}
                        {!address.isDefault && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetDefault(address.id);
                            }}
                            className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Set as default
                          </button>
                        )}
                      </div>
                    ))}

                    {addresses.length === 0 && (
                      <div className="text-center py-8">
                        <FaMapMarkerAlt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No addresses saved yet</p>
                        <button
                          onClick={() => {
                            setEditingAddress(null);
                            resetAddressForm();
                            setShowAddressForm(true);
                          }}
                          className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Add your first address
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Address Form */
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Label
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.label}
                        onChange={(e) => setAddressForm({...addressForm, label: e.target.value})}
                        placeholder="e.g., Home, Office, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Recipient Name
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.recipientName}
                          onChange={(e) => setAddressForm({...addressForm, recipientName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={addressForm.phoneNumber}
                          onChange={(e) => setAddressForm({...addressForm, phoneNumber: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.address}
                        onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                        placeholder="Street name, building, house no."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Detail (Optional)
                      </label>
                      <input
                        type="text"
                        value={addressForm.detail}
                        onChange={(e) => setAddressForm({...addressForm, detail: e.target.value})}
                        placeholder="RT/RW, block, unit no., etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <select
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option>Jakarta Selatan</option>
                          <option>Jakarta Pusat</option>
                          <option>Jakarta Utara</option>
                          <option>Jakarta Barat</option>
                          <option>Jakarta Timur</option>
                          <option>Bekasi</option>
                          <option>Tangerang</option>
                          <option>Depok</option>
                          <option>Bogor</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.postalCode}
                          onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Type
                      </label>
                      <div className="flex gap-4">
                        {(['home', 'office', 'other'] as const).map((type) => (
                          <label key={type} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="addressType"
                              value={type}
                              checked={addressForm.type === type}
                              onChange={(e) => setAddressForm({...addressForm, type: e.target.value as typeof type})}
                              className="text-blue-600"
                            />
                            <span className="capitalize text-sm text-gray-700">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="setDefault"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                        className="rounded text-blue-600"
                      />
                      <label htmlFor="setDefault" className="text-sm text-gray-700">
                        Set as default address
                      </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        {editingAddress ? 'Update Address' : 'Save Address'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddress(null);
                          resetAddressForm();
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Delivery Options (only for delivery) */}
            {deliveryType === 'delivery' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Options</h2>
                
                <div className="space-y-3">
                  {deliveryOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <label
                        key={option.id}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedDeliveryOption === option.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="delivery"
                          value={option.id}
                          checked={selectedDeliveryOption === option.id}
                          onChange={() => setSelectedDeliveryOption(option.id)}
                          className="hidden"
                        />
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            selectedDeliveryOption === option.id ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <Icon className={`w-6 h-6 ${
                              selectedDeliveryOption === option.id ? 'text-blue-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{option.name}</p>
                            <p className="text-sm text-gray-500">{option.description}</p>
                            {deliveryEstimate && selectedDeliveryOption === option.id && (
                              <p className="text-xs text-green-600 mt-1">
                                Estimated delivery: {deliveryEstimate.date}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">
                              Rp {option.cost.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {selectedDeliveryOption === option.id && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center ml-2">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pickup Info (only for pickup) */}
            {deliveryType === 'pickup' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaStore className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Store Pickup Location</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Toko Kita Official Store
                    </p>
                    <p className="text-sm text-gray-600">
                      Jl. Sudirman No. 123, Jakarta Pusat
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Pickup available today until 20:00 WIB
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-blue-600">
                      <FaInfoCircle />
                      <span>Bring your order number and ID for pickup</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaStore className="text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-800">Order Items</h2>
                </div>
                <span className="text-sm text-gray-500">
                  {state.items.length} item(s)
                </span>
              </div>

              <div className="space-y-4">
                {state.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0"
                  >
                    {/* Product Image Placeholder */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Image</span>
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">Qty: {item.qty}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          Rp {item.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        Rp {(item.qty * item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaWallet className="text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-800">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="hidden"
                      />
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          paymentMethod === method.id ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            paymentMethod === method.id ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                      </div>
                      {paymentMethod === method.id && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>

              {/* Security Badge */}
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <FaShieldAlt className="text-green-500" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-800">
                    Rp {total.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {deliveryType === 'pickup' ? 'Pickup' : 'Shipping'}
                  </span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    <span className="font-medium text-gray-800">
                      Rp {shippingCost.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Delivery Estimate */}
                {deliveryType === 'delivery' && deliveryEstimate && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-700">
                      Estimated delivery: {deliveryEstimate.date}
                    </p>
                  </div>
                )}
                
                {/* Free Shipping Progress */}
                {deliveryType === 'delivery' && shippingCost > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-700 mb-2">
                      Add Rp {(500000 - total).toLocaleString()} more for free shipping
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${Math.min((total / 500000) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span className="font-bold text-lg text-blue-600">
                      Rp {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="mt-6">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the{" "}
                    <button className="text-blue-600 hover:underline">
                      Terms & Conditions
                    </button>{" "}
                    and{" "}
                    <button className="text-blue-600 hover:underline">
                      Privacy Policy
                    </button>
                  </span>
                </label>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCreateOrder}
                disabled={loading || !termsAccepted || state.items.length === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold mt-4 
                         hover:bg-blue-700 transition-colors disabled:opacity-50 
                         disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Continue to Payment"
                )}
              </button>

              {/* Payment Methods Icons */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center mb-2">
                  We accept:
                </p>
                <div className="flex justify-center gap-3">
                  <FaCreditCard className="w-6 h-6 text-gray-400" />
                  <SiMastercard className="w-6 h-6 text-gray-400" />
                  <SiVisa className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;