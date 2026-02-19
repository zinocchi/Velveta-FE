// src/pages/CheckoutPage.tsx
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
  FaInfoCircle,
  FaMinus,
  FaPlus as FaPlusIcon,
  FaShoppingBag,
  FaArrowLeft,
  FaMotorcycle,
  FaWalking,
  FaCheck,
} from "react-icons/fa";
import { SiMastercard, SiVisa } from "react-icons/si";
import OrderStatusModal from "../dashboard/OrderStatusModal";

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
  type: "home" | "office" | "other";
}

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  estimateMinutes: { min: number; max: number };
  cost: number;
  icon: any;
}

const CheckoutPage = () => {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  // State untuk Order Status Modal
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<any>(null);

  // State untuk notifikasi
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // State untuk pengiriman
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">(
    "delivery",
  );
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // State untuk form alamat
  const [addressForm, setAddressForm] = useState({
    label: "",
    recipientName: "",
    phoneNumber: "",
    address: "",
    detail: "",
    city: "Jakarta Selatan",
    postalCode: "",
    type: "home" as const,
    isDefault: false,
  });

  // State untuk opsi pengiriman dengan estimasi menit
  const [deliveryOptions] = useState<DeliveryOption[]>([
    {
      id: "regular",
      name: "Regular Delivery",
      description: "Standard delivery",
      estimateMinutes: { min: 45, max: 90 },
      cost: 15000,
      icon: FaMotorcycle,
    },
    {
      id: "express",
      name: "Express Delivery",
      description: "Priority delivery",
      estimateMinutes: { min: 30, max: 45 },
      cost: 30000,
      icon: FaClock,
    },
  ]);
  const [selectedDeliveryOption, setSelectedDeliveryOption] =
    useState("regular");

  // State untuk estimasi pengiriman dalam menit
  const [deliveryEstimate, setDeliveryEstimate] = useState<{
    minMinutes: number;
    maxMinutes: number;
    timeRange: string;
  } | null>(null);

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    show: boolean;
    addressId: string;
    addressLabel: string;
  }>({
    show: false,
    addressId: "",
    addressLabel: "",
  });

  // Fungsi untuk menampilkan notifikasi
  const showNotification = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setNotification({ show: true, message, type });

    // Auto hide setelah 3 detik
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // Load saved addresses from localStorage on mount
  useEffect(() => {
    const savedAddresses = localStorage.getItem("userAddresses");
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
          id: "1",
          label: "Rumah",
          recipientName: "John Doe",
          phoneNumber: "081234567890",
          address: "Jl. Contoh Alamat No. 123",
          detail: "RT 01 RW 02",
          city: "Jakarta Selatan",
          postalCode: "12345",
          isDefault: true,
          type: "home",
        },
        {
          id: "2",
          label: "Kantor",
          recipientName: "John Doe",
          phoneNumber: "081234567891",
          address: "Jl. Sudirman No. 456",
          detail: "Gedung ABC Lantai 5",
          city: "Jakarta Pusat",
          postalCode: "67890",
          isDefault: false,
          type: "office",
        },
      ];
      setAddresses(mockAddresses);
      setSelectedAddressId("1");
    }
  }, []);

  // Save addresses to localStorage when updated
  useEffect(() => {
    if (addresses.length > 0) {
      localStorage.setItem("userAddresses", JSON.stringify(addresses));
    }
  }, [addresses]);

  // Calculate delivery estimate in minutes
  useEffect(() => {
    if (deliveryType === "delivery" && selectedDeliveryOption) {
      const option = deliveryOptions.find(
        (opt) => opt.id === selectedDeliveryOption,
      );
      if (option) {
        const now = new Date();
        const minTime = new Date(
          now.getTime() + option.estimateMinutes.min * 60000,
        );
        const maxTime = new Date(
          now.getTime() + option.estimateMinutes.max * 60000,
        );

        const formatTime = (date: Date) => {
          return date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          });
        };

        setDeliveryEstimate({
          minMinutes: option.estimateMinutes.min,
          maxMinutes: option.estimateMinutes.max,
          timeRange: `${formatTime(minTime)} - ${formatTime(maxTime)}`,
        });
      }
    }
  }, [selectedDeliveryOption, deliveryType, deliveryOptions]);

  const total = state.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  const shippingCost =
    deliveryType === "pickup"
      ? 0
      : deliveryOptions.find((opt) => opt.id === selectedDeliveryOption)
          ?.cost || 0;

  const grandTotal = total + shippingCost;

  // Quantity handlers
  const handleIncreaseQty = (itemId: number) => {
    const item = state.items.find((i) => i.id === itemId);
    if (!item || item.qty >= 10) return;

    dispatch({ type: "INCREMENT", payload: itemId });
  };

  const handleDecreaseQty = (itemId: number) => {
    const item = state.items.find((i) => i.id === itemId);
    if (!item) return;

    if (item.qty === 1) {
      dispatch({ type: "REMOVE", payload: itemId });
    } else {
      dispatch({ type: "DECREMENT", payload: itemId });
    }
  };

  // Handle address form submission
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
        addr.id === editingAddress.id ? newAddress : addr,
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

  // Handle address deletion
  const handleDeleteAddress = () => {
    const updatedAddresses = addresses.filter(
      (addr) => addr.id !== showDeleteConfirm.addressId,
    );
    setAddresses(updatedAddresses);

    if (selectedAddressId === showDeleteConfirm.addressId) {
      const newDefault =
        updatedAddresses.find((addr) => addr.isDefault) || updatedAddresses[0];
      if (newDefault) {
        setSelectedAddressId(newDefault.id);
      }
    }

    setShowDeleteConfirm({ show: false, addressId: "", addressLabel: "" });
  };

  // Handle set as default
  const handleSetDefault = (addressId: string) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));
    setAddresses(updatedAddresses);
    setSelectedAddressId(addressId);
  };

  // Reset address form
  const resetAddressForm = () => {
    setAddressForm({
      label: "",
      recipientName: "",
      phoneNumber: "",
      address: "",
      detail: "",
      city: "Jakarta Selatan",
      postalCode: "",
      type: "home",
      isDefault: false,
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
      isDefault: address.isDefault,
    });
    setShowAddressForm(true);
  };

  // Handler untuk close modal
  const handleCloseModal = () => {
    setShowOrderModal(false);
    // Optional: redirect ke halaman orders setelah modal ditutup
    // navigate('/orders/my');
  };

  // UPDATE HANDLECREATEORDER - Sesuai dengan backend
  const handleCreateOrder = async () => {
    if (state.items.length === 0) return;
    if (!termsAccepted) {
      showNotification("Please accept the terms and conditions", "error");
      return;
    }
    if (deliveryType === "delivery" && !selectedAddressId) {
      showNotification("Please select a shipping address", "error");
      return;
    }

    try {
      setLoading(true);

      const selectedAddress = addresses.find(
        (addr) => addr.id === selectedAddressId,
      );
      const deliveryOption = deliveryOptions.find(
        (opt) => opt.id === selectedDeliveryOption,
      );

      // Format items untuk backend
      const itemsPayload = state.items.map((item) => ({
        id: item.id,
        qty: item.qty,
        // Backend hanya butuh id dan qty, name dan price tidak perlu
      }));

      // Format shipping address SESUAI DENGAN BACKEND
      let shippingAddressPayload = null;

      if (deliveryType === "delivery" && selectedAddress) {
        // Backend mengharapkan array/object dengan struktur tertentu
        shippingAddressPayload = {
          id: selectedAddress.id,
          label: selectedAddress.label,
          recipientName: selectedAddress.recipientName,
          phoneNumber: selectedAddress.phoneNumber,
          address: selectedAddress.address,
          detail: selectedAddress.detail || "",
          city: selectedAddress.city,
          postalCode: selectedAddress.postalCode,
          province: "DKI Jakarta",
          full_address:
            `${selectedAddress.address}, ${selectedAddress.detail || ""}, ${selectedAddress.city} ${selectedAddress.postalCode}`
              .replace(/, ,/g, ",")
              .replace(/,\s*$/, "")
              .trim(),
        };
      }

      // Format delivery option
      let deliveryOptionPayload = null;
      if (deliveryOption) {
        deliveryOptionPayload = {
          id: deliveryOption.id,
          name: deliveryOption.name,
          price: deliveryOption.cost,
          estimate_minutes: deliveryOption.estimateMinutes, // perhatikan penamaan
          description: deliveryOption.description,
        };
      }

      // Hitung ulang total
      const itemsTotal = state.items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0,
      );
      const finalTotal = itemsTotal + shippingCost;

      // Payload SESUAI DENGAN BACKEND
      const orderPayload = {
        items: itemsPayload, // Array of {id, qty}
        delivery_type: deliveryType,
        shipping_address: shippingAddressPayload, // Harus object/array, bukan string
        delivery_option: deliveryOptionPayload,
        payment_method: paymentMethod,
        shipping_cost: shippingCost,
        total: finalTotal,
      };

      console.log("Sending order data:", JSON.stringify(orderPayload, null, 2));

      const response = await api.post("/orders", orderPayload);

      console.log("Order response:", response.data);

      // Handle response
      if (response.data.success || response.data.order_id) {
        const orderData = {
          order_id: response.data.order_id || response.data.data?.order_id,
          status: response.data.status || "PENDING",
          total: finalTotal,
          payment_method: paymentMethod,
          delivery_type: deliveryType,
          estimated_minutes: deliveryEstimate?.minMinutes || 30,
          shipping_address: shippingAddressPayload,
          items: state.items.map((item) => ({
            name: item.name,
            qty: item.qty,
            price: item.price,
          })),
          created_at: new Date().toISOString(),
        };

        setOrderSuccessData(orderData);
        showNotification(
          "Payment successful! Your order has been created.",
          "success",
        );
        dispatch({ type: "CLEAR_CART" });

        setTimeout(() => {
          setShowOrderModal(true);
        }, 1500);
      } else {
        throw new Error(response.data.message || "Failed to create order");
      }
    } catch (err: any) {
      console.error("Full error object:", err);
      console.error("Error response:", err.response);
      console.error("Error response data:", err.response?.data);
      console.error("Error status:", err.response?.status);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to checkout. Please try again.";

      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    {
      id: "cash",
      name: "Cash on Delivery",
      icon: FaMoneyBillWave,
      description: "Pay when you receive",
    },
    {
      id: "debit",
      name: "Debit/Credit Card",
      icon: FaCreditCard,
      description: "Visa, Mastercard, JCB",
    },
  ];

  // Format minutes to readable string
  const formatEstimate = (min: number, max: number) => {
    if (max < 60) {
      return `${min}-${max} minutes`;
    } else if (min >= 60) {
      return `${Math.floor(min / 60)}-${Math.floor(max / 60)} hour${
        Math.floor(max / 60) > 1 ? "s" : ""
      }`;
    } else {
      return `${min} minutes - ${Math.floor(max / 60)} hour${
        Math.floor(max / 60) > 1 ? "s" : ""
      }`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Custom Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slideDown ${
            notification.type === "success" ? "bg-green-600" : "bg-red-600"
          } text-white`}
        >
          {notification.type === "success" ? (
            <FaCheckCircle className="w-5 h-5" />
          ) : (
            <FaInfoCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() =>
              setShowDeleteConfirm({
                show: false,
                addressId: "",
                addressLabel: "",
              })
            }
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash className="w-8 h-8 text-red-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Hapus Alamat
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete?{" "}
              <span className="font-semibold">
                "{showDeleteConfirm.addressLabel}"
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setShowDeleteConfirm({
                    show: false,
                    addressId: "",
                    addressLabel: "",
                  })
                }
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteAddress}
                className="flex-1 px-4 py-3 bg-red-700 rounded-xl text-white font-medium hover:bg-red-800 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Status Modal */}
      <OrderStatusModal
        isOpen={showOrderModal}
        onClose={handleCloseModal}
        orderData={
          orderSuccessData || {
            order_id: "",
            status: "PENDING",
            total: 0,
            payment_method: "",
            delivery_type: "",
          }
        }
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Type Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-red-700 rounded-full"></span>
                Order Method
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDeliveryType("delivery")}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    deliveryType === "delivery"
                      ? "border-red-700 bg-red-50"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  <FaTruck
                    className={`w-6 h-6 mx-auto mb-2 ${
                      deliveryType === "delivery"
                        ? "text-red-700"
                        : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`font-medium ${
                      deliveryType === "delivery"
                        ? "text-red-700"
                        : "text-gray-600"
                    }`}
                  >
                    Delivery
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Delivered to the address
                  </p>
                </button>

                <button
                  onClick={() => setDeliveryType("pickup")}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    deliveryType === "pickup"
                      ? "border-red-700 bg-red-50"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  <FaStore
                    className={`w-6 h-6 mx-auto mb-2 ${
                      deliveryType === "pickup"
                        ? "text-red-700"
                        : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`font-medium ${
                      deliveryType === "pickup"
                        ? "text-red-700"
                        : "text-gray-600"
                    }`}
                  >
                    Pickup
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Pick up at the store
                  </p>
                </button>
              </div>
            </div>

            {/* Shipping Address Section */}
            {deliveryType === "delivery" && (
              <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-700" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Shipping Address
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      resetAddressForm();
                      setShowAddressForm(true);
                    }}
                    className="flex items-center gap-1 text-sm text-red-700 hover:text-red-800 font-medium transition-colors"
                  >
                    <FaPlus className="w-3 h-3" />
                    Add address
                  </button>
                </div>

                {!showAddressForm ? (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          selectedAddressId === address.id
                            ? "border-red-700 bg-red-50"
                            : "border-gray-200 hover:border-red-300"
                        }`}
                        onClick={() => setSelectedAddressId(address.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              address.type === "home"
                                ? "bg-red-100"
                                : address.type === "office"
                                  ? "bg-orange-100"
                                  : "bg-purple-100"
                            }`}
                          >
                            {address.type === "home" ? (
                              <FaHome className="w-4 h-4 text-red-700" />
                            ) : address.type === "office" ? (
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
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                              {selectedAddressId === address.id && (
                                <FaCheckCircle className="w-4 h-4 text-red-700 ml-auto" />
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

                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAddress(address);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm({
                                show: true,
                                addressId: address.id,
                                addressLabel: address.label,
                              });
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>

                        {!address.isDefault && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetDefault(address.id);
                            }}
                            className="mt-2 text-xs text-red-700 hover:text-red-800 font-medium transition-colors"
                          >
                            Set default
                          </button>
                        )}
                      </div>
                    ))}

                    {addresses.length === 0 && (
                      <div className="text-center py-8">
                        <FaMapMarkerAlt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">
                          No addresses have been saved yet
                        </p>
                        <button
                          onClick={() => {
                            setEditingAddress(null);
                            resetAddressForm();
                            setShowAddressForm(true);
                          }}
                          className="mt-2 text-red-700 hover:text-red-800 font-medium"
                        >
                          Add first address
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address label
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.label}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            label: e.target.value,
                          })
                        }
                        placeholder="Contoh: Rumah, Kantor"
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
                          required
                          value={addressForm.recipientName}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              recipientName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone number
                        </label>
                        <input
                          type="tel"
                          required
                          value={addressForm.phoneNumber}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              phoneNumber: e.target.value,
                            })
                          }
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
                        required
                        value={addressForm.address}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            address: e.target.value,
                          })
                        }
                        placeholder="Nama jalan, gedung, no. rumah"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address details (Opsional)
                      </label>
                      <input
                        type="text"
                        value={addressForm.detail}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            detail: e.target.value,
                          })
                        }
                        placeholder="RT/RW, blok, no. unit"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <select
                          value={addressForm.city}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              city: e.target.value,
                            })
                          }
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pos code
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.postalCode}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              postalCode: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address type
                      </label>
                      <div className="flex gap-4">
                        {(["home", "office", "other"] as const).map((type) => (
                          <label
                            key={type}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="addressType"
                              value={type}
                              checked={addressForm.type === type}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  type: e.target.value as typeof type,
                                })
                              }
                              className="text-red-700 focus:ring-red-700"
                            />
                            <span className="capitalize text-sm text-gray-700">
                              {type === "home"
                                ? "Rumah"
                                : type === "office"
                                  ? "Kantor"
                                  : "Lainnya"}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="setDefault"
                        checked={addressForm.isDefault}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            isDefault: e.target.checked,
                          })
                        }
                        className="rounded text-red-700 focus:ring-red-700"
                      />
                      <label
                        htmlFor="setDefault"
                        className="text-sm text-gray-700"
                      >
                        Set default address
                      </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-red-700 text-white py-2 rounded-lg font-medium hover:bg-red-800 transition-colors"
                      >
                        {editingAddress ? "Perbarui Alamat" : "Simpan Alamat"}
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

            {/* Delivery Options */}
            {deliveryType === "delivery" && (
              <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-red-700 rounded-full"></span>
                  Shipping Option
                </h2>

                <div className="space-y-3">
                  {deliveryOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <label
                        key={option.id}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedDeliveryOption === option.id
                            ? "border-red-700 bg-red-50"
                            : "border-gray-200 hover:border-red-300"
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
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              selectedDeliveryOption === option.id
                                ? "bg-red-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <Icon
                              className={`w-6 h-6 ${
                                selectedDeliveryOption === option.id
                                  ? "text-red-700"
                                  : "text-gray-600"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {option.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {option.description}
                            </p>
                            {deliveryEstimate &&
                              selectedDeliveryOption === option.id && (
                                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                  <FaClock className="w-3 h-3" />
                                  Estimated to: {deliveryEstimate.timeRange} (
                                  {formatEstimate(
                                    option.estimateMinutes.min,
                                    option.estimateMinutes.max,
                                  )}
                                  )
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
                          <div className="w-5 h-5 bg-red-700 rounded-full flex items-center justify-center ml-2">
                            <FaCheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pickup Info */}
            {deliveryType === "pickup" && (
              <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <FaStore className="w-6 h-6 text-red-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      Pick up location
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Our official Coffee shop
                    </p>
                    <p className="text-sm text-gray-600">
                      Jl. Sudirman No. 123, Jakarta Pusat
                    </p>
                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                      <FaClock className="w-3 h-3" />
                      Ready in 15-30 minutes
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-red-700 bg-red-50 p-2 rounded-lg">
                      <FaInfoCircle />
                      <span>Bring your order number for pickup.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items with Quantity Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaShoppingBag className="text-red-700" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Your order
                  </h2>
                </div>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                  {state.items.length}{" "}
                  {state.items.length === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="space-y-4">
                {state.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 rounded-lg transition-colors px-2"
                  >
                    {/* Product Image Placeholder */}
                    <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 rounded-lg flex items-center justify-center shadow-sm">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Rp {item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => handleDecreaseQty(item.id)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-700 disabled:opacity-50 disabled:hover:bg-gray-50 disabled:hover:text-gray-600 transition-colors"
                        >
                          <FaMinus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center font-medium text-gray-700">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => handleIncreaseQty(item.id)}
                          disabled={item.qty >= 10}
                          className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-700 disabled:opacity-50 disabled:hover:bg-gray-50 disabled:hover:text-gray-600 transition-colors"
                        >
                          <FaPlusIcon className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right min-w-[100px]">
                        <p className="font-semibold text-red-700">
                          Rp {(item.qty * item.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add More Items Button */}
              <button
                onClick={() => navigate("/menu")}
                className="w-full mt-4 py-3 border-2 border-red-700 text-red-700 rounded-xl font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2 group"
              >
                <FaPlusIcon className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                Add order
              </button>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <FaWallet className="text-red-700" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Payment method
                </h2>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? "border-red-700 bg-red-50"
                          : "border-gray-200 hover:border-red-300"
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
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            paymentMethod === method.id
                              ? "bg-red-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${
                              paymentMethod === method.id
                                ? "text-red-700"
                                : "text-gray-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {method.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {method.description}
                          </p>
                        </div>
                      </div>
                      {paymentMethod === method.id && (
                        <div className="w-5 h-5 bg-red-700 rounded-full flex items-center justify-center">
                          <FaCheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>

              {/* Security Badge */}
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <FaShieldAlt className="text-red-700" />
                <span>Your payment information is secure and encrypted.</span>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 sticky top-24 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-red-700 rounded-full"></span>
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-800">
                    Rp {total.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    {deliveryType === "pickup" ? (
                      <FaWalking className="w-3 h-3" />
                    ) : (
                      <FaMotorcycle className="w-3 h-3" />
                    )}
                    {deliveryType === "pickup" ? "Pickup" : "Ongkir"}
                  </span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full text-xs">
                      Free
                    </span>
                  ) : (
                    <span className="font-medium text-gray-800">
                      Rp {shippingCost.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Delivery Estimate in minutes */}
                {deliveryType === "delivery" && deliveryEstimate && (
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <p className="text-xs text-red-700 font-medium mb-1 flex items-center gap-1">
                      <FaClock className="w-3 h-3" />
                      Estimated to
                    </p>
                    <p className="text-sm text-red-700 font-semibold">
                      {deliveryEstimate.timeRange}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      (
                      {formatEstimate(
                        deliveryEstimate.minMinutes,
                        deliveryEstimate.maxMinutes,
                      )}
                      )
                    </p>
                  </div>
                )}

                {/* Free Shipping Progress */}
                {deliveryType === "delivery" && shippingCost > 0 && (
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                    <p className="text-xs text-orange-700 mb-2 flex items-center gap-1">
                      <FaMotorcycle className="w-3 h-3" />
                      Add Rp {(500000 - total).toLocaleString()} for Free
                      shipping cost
                    </p>
                    <div className="w-full bg-orange-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((total / 500000) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Pickup Estimate */}
                {deliveryType === "pickup" && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <p className="text-xs text-green-700 font-medium flex items-center gap-1">
                      <FaClock className="w-3 h-3" />
                      Ready in 15-30 minutes
                    </p>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Total</span>
                    <div className="text-right">
                      <span className="font-bold text-xl text-red-700">
                        Rp {grandTotal.toLocaleString()}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Including PPN
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="mt-6">
                <label className="flex items-start gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 text-red-700 focus:ring-red-700 rounded"
                  />
                  <span className="text-sm text-gray-600">
                    I Agree With{" "}
                    <button className="text-red-700 hover:text-red-800 font-medium hover:underline">
                      Terms & Conditions
                    </button>{" "}
                    and{" "}
                    <button className="text-red-700 hover:text-red-800 font-medium hover:underline">
                      Privacy Policy
                    </button>
                  </span>
                </label>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCreateOrder}
                disabled={loading || !termsAccepted || state.items.length === 0}
                className="w-full bg-red-700 text-white py-3 rounded-xl font-semibold mt-4 
                         hover:bg-red-800 transition-colors disabled:opacity-50 
                         disabled:cursor-not-allowed disabled:hover:bg-red-700
                         relative overflow-hidden group"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10">Proceed to Payment</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </>
                )}
              </button>

              {/* Payment Methods Icons */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center mb-2">
                  Secure payment via:
                </p>
                <div className="flex justify-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <FaCreditCard className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <SiMastercard className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <SiVisa className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-400">
                  🔒 256-bit SSL | ✓ Secure Payments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -100%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
