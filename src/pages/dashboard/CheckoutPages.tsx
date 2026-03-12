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
  FaLock,
  FaGooglePay,
  FaApplePay,
  FaQrcode,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import { SiMastercard, SiVisa, SiPaypal } from "react-icons/si";
import OrderDetailModal from "../../components/modal/OrderDetailModal";

// Types
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

interface CardDetails {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
  saveCard: boolean;
}

interface PaymentStep {
  id: "confirmation" | "payment" | "processing" | "success";
  label: string;
}

const CheckoutPage = () => {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  // State untuk payment flow
  const [paymentStep, setPaymentStep] = useState<
    "confirmation" | "payment" | "processing" | "success"
  >("confirmation");
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  // Notification state
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // Payment states
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">(
    "delivery",
  );
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
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

  // Payment methods
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    saveCard: false,
  });
  const [cardErrors, setCardErrors] = useState<
    Partial<Record<keyof CardDetails, string>>
  >({});

  // E-Wallet details
  const [selectedEWallet, setSelectedEWallet] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Bank transfer details
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [bankTransferCode, setBankTransferCode] = useState("");

  // Delivery options
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

  const [deliveryEstimate, setDeliveryEstimate] = useState<{
    minMinutes: number;
    maxMinutes: number;
    timeRange: string;
  } | null>(null);

  // UI States
  const [pageLoading, setPageLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
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

  // Payment steps
  const paymentSteps: PaymentStep[] = [
    { id: "confirmation", label: "Confirm Order" },
    { id: "payment", label: "Payment Details" },
    { id: "processing", label: "Processing" },
    { id: "success", label: "Success" },
  ];

  const showNotification = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "success",
  ) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setPageLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));

        const savedAddresses = localStorage.getItem("userAddresses");
        if (savedAddresses) {
          const parsed = JSON.parse(savedAddresses);
          setAddresses(parsed);
          const defaultAddress = parsed.find((addr: Address) => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
          }
        } else {
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
      } catch (error) {
        console.error("Failed to load addresses:", error);
        showNotification("Failed to load addresses", "error");
      } finally {
        setPageLoading(false);
      }
    };

    loadAddresses();
  }, []);

  useEffect(() => {
    if (addresses.length > 0) {
      localStorage.setItem("userAddresses", JSON.stringify(addresses));
    }
  }, [addresses]);

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

  // Payment validation
  const validateCardDetails = () => {
    const errors: Partial<Record<keyof CardDetails, string>> = {};

    if (!cardDetails.number.replace(/\s/g, "").match(/^\d{16}$/)) {
      errors.number = "Card number must be 16 digits";
    }

    if (!cardDetails.name.trim()) {
      errors.name = "Cardholder name is required";
    }

    if (!cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      errors.expiry = "Invalid expiry date (MM/YY)";
    }

    if (!cardDetails.cvv.match(/^\d{3}$/)) {
      errors.cvv = "CVV must be 3 digits";
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);

    // Add space every 4 digits
    const formatted = value.replace(/(\d{4})/g, "$1 ").trim();
    setCardDetails({ ...cardDetails, number: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);

    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }

    setCardDetails({ ...cardDetails, expiry: value });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    setCardDetails({ ...cardDetails, cvv: value });
  };

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

  const handleSetDefault = (addressId: string) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));
    setAddresses(updatedAddresses);
    setSelectedAddressId(addressId);
  };

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

  const handleOpenOrderDetail = (orderId: string) => {
    setLastOrderId(orderId);
    setShowOrderDetail(true);
  };

  const handleCloseOrderDetail = () => {
    setShowOrderDetail(false);
    setLastOrderId(null);
    navigate("/dashboard");
  };

  // Step 1: Confirm Order
  const handleConfirmOrder = () => {
    if (state.items.length === 0) {
      showNotification("Your cart is empty", "error");
      return;
    }

    if (!termsAccepted) {
      showNotification("Please accept the terms and conditions", "error");
      return;
    }

    if (deliveryType === "delivery" && !selectedAddressId) {
      showNotification("Please select a shipping address", "error");
      return;
    }

    setPaymentStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 2: Process Payment
  const handleProcessPayment = async () => {
    // Validate based on payment method
    if (paymentMethod === "credit_card") {
      if (!validateCardDetails()) {
        showNotification("Please fill in all card details correctly", "error");
        return;
      }
    } else if (paymentMethod === "e_wallet") {
      if (!selectedEWallet || !phoneNumber) {
        showNotification(
          "Please select e-wallet and enter phone number",
          "error",
        );
        return;
      }
    } else if (paymentMethod === "bank_transfer") {
      if (!selectedBank) {
        showNotification("Please select a bank", "error");
        return;
      }
    }

    setPaymentStep("processing");

    // Simulate payment processing
    setTimeout(async () => {
      try {
        setProcessing(true);

        // Create order
        const selectedAddress = addresses.find(
          (addr) => addr.id === selectedAddressId,
        );
        const deliveryOption = deliveryOptions.find(
          (opt) => opt.id === selectedDeliveryOption,
        );

        const itemsPayload = state.items.map((item) => ({
          id: item.id,
          qty: item.qty,
          price: item.price,
        }));

        let shippingAddressPayload = null;

        if (deliveryType === "delivery" && selectedAddress) {
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

        let deliveryOptionPayload = null;
        if (deliveryOption) {
          deliveryOptionPayload = {
            id: deliveryOption.id,
            name: deliveryOption.name,
            price: deliveryOption.cost,
            estimate_minutes: deliveryOption.estimateMinutes,
            description: deliveryOption.description,
          };
        }

        const itemsTotal = state.items.reduce(
          (sum, item) => sum + item.price * item.qty,
          0,
        );
        const finalTotal = itemsTotal + shippingCost;

        const orderPayload = {
          items: itemsPayload,
          delivery_type: deliveryType,
          shipping_address: shippingAddressPayload,
          delivery_option: deliveryOptionPayload,
          payment_method: paymentMethod,
          shipping_cost: shippingCost,
          total: finalTotal,
          payment_details:
            paymentMethod === "credit_card"
              ? {
                  card_last4: cardDetails.number.slice(-4),
                  card_brand: detectCardBrand(cardDetails.number),
                }
              : paymentMethod === "e_wallet"
                ? {
                    e_wallet: selectedEWallet,
                    phone_number: phoneNumber,
                  }
                : {
                    bank: selectedBank,
                  },
        };

        console.log(
          "Sending order data:",
          JSON.stringify(orderPayload, null, 2),
        );

        const response = await api.post("/orders", orderPayload);
        console.log("Order response:", response.data);

        if (
          response.data.success ||
          response.data.order_id ||
          response.data.data?.id
        ) {
          const orderId =
            response.data.order_id ||
            response.data.data?.id ||
            response.data.data?.order_id;

          setPaymentStep("success");

          setTimeout(() => {
            dispatch({ type: "CLEAR_CART" });
            handleOpenOrderDetail(orderId);
          }, 2000);
        } else {
          throw new Error(response.data.message || "Failed to create order");
        }
      } catch (err: any) {
        console.error("Checkout error:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data?.detail ||
          err.message ||
          "Failed to checkout. Please try again.";

        showNotification(errorMessage, "error");
        setPaymentStep("payment");
      } finally {
        setProcessing(false);
      }
    }, 3000);
  };

  const detectCardBrand = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (cleanNumber.startsWith("4")) return "Visa";
    if (cleanNumber.startsWith("5")) return "Mastercard";
    if (cleanNumber.startsWith("3")) return "Amex";
    return "Unknown";
  };

  const handleBackToConfirmation = () => {
    setPaymentStep("confirmation");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

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

  if (pageLoading) {
    return (
      <main className="pt-28 pb-16 max-w-7xl mx-auto px-4">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slideDown ${
            notification.type === "success"
              ? "bg-green-600"
              : notification.type === "error"
                ? "bg-red-600"
                : notification.type === "warning"
                  ? "bg-yellow-600"
                  : "bg-blue-600"
          } text-white`}>
          {notification.type === "success" ? (
            <FaCheckCircle className="w-5 h-5" />
          ) : notification.type === "error" ? (
            <FaExclamationTriangle className="w-5 h-5" />
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
              Delete Address
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
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleDeleteAddress}
                className="flex-1 px-4 py-3 bg-red-700 rounded-xl text-white font-medium hover:bg-red-800 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={showOrderDetail}
        orderId={lastOrderId}
        onClose={handleCloseOrderDetail}
      />

      {/* Payment Steps Progress */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {paymentSteps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      paymentStep === step.id
                        ? "bg-red-600 text-white"
                        : paymentSteps.findIndex((s) => s.id === paymentStep) >
                            index
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}>
                    {paymentSteps.findIndex((s) => s.id === paymentStep) >
                    index ? (
                      <FaCheck className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <p className="absolute top-12 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 whitespace-nowrap">
                    {step.label}
                  </p>
                </div>
                {index < paymentSteps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      paymentSteps.findIndex((s) => s.id === paymentStep) >
                      index
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {paymentStep === "confirmation" && (
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
                    }`}>
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
                      }`}>
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
                    }`}>
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
                      }`}>
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
                      className="flex items-center gap-1 text-sm text-red-700 hover:text-red-800 font-medium transition-colors">
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
                          onClick={() => setSelectedAddressId(address.id)}>
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                address.type === "home"
                                  ? "bg-red-100"
                                  : address.type === "office"
                                    ? "bg-orange-100"
                                    : "bg-purple-100"
                              }`}>
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
                              className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
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
                              className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>

                          {!address.isDefault && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetDefault(address.id);
                              }}
                              className="mt-2 text-xs text-red-700 hover:text-red-800 font-medium transition-colors">
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
                            className="mt-2 text-red-700 hover:text-red-800 font-medium">
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
                          value={addressForm.detail}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              detail: e.target.value,
                            })
                          }
                          placeholder="RT/RW, block, unit number"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700">
                            <option>Jakarta Selatan</option>
                            <option>Jakarta Pusat</option>
                            <option>Jakarta Utara</option>
                            <option>Jakarta Barat</option>
                            <option>Jakarta Timur</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Postal code
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
                          {(["home", "office", "other"] as const).map(
                            (type) => (
                              <label
                                key={type}
                                className="flex items-center gap-2 cursor-pointer">
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
                                    ? "Home"
                                    : type === "office"
                                      ? "Office"
                                      : "Other"}
                                </span>
                              </label>
                            ),
                          )}
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
                          className="text-sm text-gray-700">
                          Set default address
                        </label>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          className="flex-1 bg-red-700 text-white py-2 rounded-lg font-medium hover:bg-red-800 transition-colors">
                          {editingAddress ? "Update Address" : "Save Address"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(false);
                            setEditingAddress(null);
                            resetAddressForm();
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
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
                          }`}>
                          <input
                            type="radio"
                            name="delivery"
                            value={option.id}
                            checked={selectedDeliveryOption === option.id}
                            onChange={() =>
                              setSelectedDeliveryOption(option.id)
                            }
                            className="hidden"
                          />
                          <div className="flex items-center gap-4 flex-1">
                            <div
                              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                selectedDeliveryOption === option.id
                                  ? "bg-red-100"
                                  : "bg-gray-100"
                              }`}>
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

              {/* Order Items */}
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
                      className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 rounded-lg transition-colors px-2">
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
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => handleDecreaseQty(item.id)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-700 disabled:opacity-50 disabled:hover:bg-gray-50 disabled:hover:text-gray-600 transition-colors">
                            <FaMinus className="w-3 h-3" />
                          </button>
                          <span className="w-10 text-center font-medium text-gray-700">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => handleIncreaseQty(item.id)}
                            disabled={item.qty >= 10}
                            className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-700 disabled:opacity-50 disabled:hover:bg-gray-50 disabled:hover:text-gray-600 transition-colors">
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

                <button
                  onClick={() => navigate("/menu")}
                  className="w-full mt-4 py-3 border-2 border-red-700 text-red-700 rounded-xl font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2 group">
                  <FaPlusIcon className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                  Add order
                </button>
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
                      {deliveryType === "pickup" ? "Pickup" : "Shipping"}
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

                  {deliveryType === "delivery" && deliveryEstimate && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                      <p className="text-xs text-red-700 font-medium mb-1 flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        Estimated delivery
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

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">Total</span>
                      <div className="text-right">
                        <span className="font-bold text-xl text-red-700">
                          Rp {grandTotal.toLocaleString()}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Including tax
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

                {/* Confirm Button */}
                <button
                  onClick={handleConfirmOrder}
                  disabled={!termsAccepted || state.items.length === 0}
                  className="w-full bg-red-700 text-white py-3 rounded-xl font-semibold mt-4 
                           hover:bg-red-800 transition-colors disabled:opacity-50 
                           disabled:cursor-not-allowed disabled:hover:bg-red-700
                           relative overflow-hidden group">
                  <span className="relative z-10">Continue to Payment</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
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
              </div>
            </div>
          </div>
        )}

        {paymentStep === "payment" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Payment Details
              </h2>

              {/* Payment Method Selection */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Select Payment Method
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod("credit_card")}
                    className={`p-3 border rounded-lg transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === "credit_card"
                        ? "border-red-700 bg-red-50"
                        : "border-gray-200 hover:border-red-300 hover:bg-gray-50"
                    }`}>
                    <FaCreditCard
                      className={`w-5 h-5 ${
                        paymentMethod === "credit_card"
                          ? "text-red-700"
                          : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        paymentMethod === "credit_card"
                          ? "text-red-700"
                          : "text-gray-600"
                      }`}>
                      Credit Card
                    </span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("e_wallet")}
                    className={`p-3 border rounded-lg transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === "e_wallet"
                        ? "border-red-700 bg-red-50"
                        : "border-gray-200 hover:border-red-300 hover:bg-gray-50"
                    }`}>
                    <FaWallet
                      className={`w-5 h-5 ${
                        paymentMethod === "e_wallet"
                          ? "text-red-700"
                          : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        paymentMethod === "e_wallet"
                          ? "text-red-700"
                          : "text-gray-600"
                      }`}>
                      E-Wallet
                    </span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("bank_transfer")}
                    className={`p-3 border rounded-lg transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === "bank_transfer"
                        ? "border-red-700 bg-red-50"
                        : "border-gray-200 hover:border-red-300 hover:bg-gray-50"
                    }`}>
                    <FaMoneyBillWave
                      className={`w-5 h-5 ${
                        paymentMethod === "bank_transfer"
                          ? "text-red-700"
                          : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        paymentMethod === "bank_transfer"
                          ? "text-red-700"
                          : "text-gray-600"
                      }`}>
                      Bank Transfer
                    </span>
                  </button>
                </div>
              </div>

              {/* Credit Card Form */}
              {paymentMethod === "credit_card" && (
                <div className="space-y-4">
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardDetails.number}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        className={`w-full px-4 py-2.5 border ${
                          cardErrors.number
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-700 font-mono text-sm`}
                        maxLength={19}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                        <SiVisa className="w-5 h-5 text-blue-600" />
                        <SiMastercard className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>
                    {cardErrors.number && (
                      <p className="text-xs text-red-500 mt-1">
                        {cardErrors.number}
                      </p>
                    )}
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardDetails.name}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, name: e.target.value })
                      }
                      placeholder="John Doe"
                      className={`w-full px-4 py-2.5 border ${
                        cardErrors.name ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-700 text-sm`}
                    />
                    {cardErrors.name && (
                      <p className="text-xs text-red-500 mt-1">
                        {cardErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Expiry Date and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className={`w-full px-4 py-2.5 border ${
                          cardErrors.expiry
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-700 text-sm`}
                        maxLength={5}
                      />
                      {cardErrors.expiry && (
                        <p className="text-xs text-red-500 mt-1">
                          {cardErrors.expiry}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={handleCvvChange}
                        placeholder="123"
                        className={`w-full px-4 py-2.5 border ${
                          cardErrors.cvv ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-700 text-sm`}
                        maxLength={3}
                      />
                      {cardErrors.cvv && (
                        <p className="text-xs text-red-500 mt-1">
                          {cardErrors.cvv}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Save Card Checkbox */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="saveCard"
                      checked={cardDetails.saveCard}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          saveCard: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-red-700 border-gray-300 rounded focus:ring-red-200"
                    />
                    <label htmlFor="saveCard" className="text-sm text-gray-600">
                      Save card for future payments
                    </label>
                  </div>
                </div>
              )}

              {/* E-Wallet Form */}
              {paymentMethod === "e_wallet" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select E-Wallet
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["OVO", "GoPay", "DANA"].map((wallet) => (
                        <button
                          key={wallet}
                          onClick={() => setSelectedEWallet(wallet)}
                          className={`py-2.5 border rounded-lg transition-all text-sm font-medium ${
                            selectedEWallet === wallet
                              ? "border-red-700 bg-red-50 text-red-700"
                              : "border-gray-200 text-gray-600 hover:border-red-300 hover:bg-gray-50"
                          }`}>
                          {wallet}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-700 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your e-wallet registered phone number
                    </p>
                  </div>
                </div>
              )}

              {/* Bank Transfer Form */}
              {paymentMethod === "bank_transfer" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Bank
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["BCA", "Mandiri", "BNI", "BRI"].map((bank) => (
                        <button
                          key={bank}
                          onClick={() => setSelectedBank(bank)}
                          className={`py-2.5 border rounded-lg transition-all text-sm font-medium ${
                            selectedBank === bank
                              ? "border-red-700 bg-red-50 text-red-700"
                              : "border-gray-200 text-gray-600 hover:border-red-300 hover:bg-gray-50"
                          }`}>
                          {bank}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-3">
                      <FaInfoCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800 mb-1">
                          Bank Transfer Instructions
                        </p>
                        <p className="text-xs text-blue-700 leading-relaxed">
                          After placing your order, you will receive bank
                          account details to complete the transfer. Please
                          complete the payment within 24 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary for Payment */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-800">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-800">
                      {shippingCost === 0
                        ? "Free"
                        : formatCurrency(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 mt-2">
                    <span>Total</span>
                    <span className="text-red-700">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleBackToConfirmation}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                  Back
                </button>
                <button
                  onClick={handleProcessPayment}
                  disabled={processing}
                  className="flex-1 bg-red-700 text-white py-2.5 rounded-lg font-semibold hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm">
                  <FaLock className="w-4 h-4" />
                  Pay {formatCurrency(grandTotal)}
                </button>
              </div>

              {/* Security Note */}
              <p className="text-center text-xs text-gray-500 mt-4">
                🔒 Your payment information is encrypted and secure
              </p>
            </div>
          </div>
        )}

        {paymentStep === "processing" && (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-12">
              <div className="relative">
                <div className="w-24 h-24 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>
                </div>
                <FaSpinner className="w-12 h-12 text-red-600 mx-auto mt-6 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-2">
                Processing Payment
              </h2>
              <p className="text-gray-600">
                Please wait while we process your payment...
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Do not close this window
              </p>
            </div>
          </div>
        )}

        {paymentStep === "success" && (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <FaCheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600">
                Your order has been confirmed and is being processed.
              </p>
              <p className="text-sm text-green-600 mt-4 flex items-center justify-center gap-2">
                <FaClock className="w-4 h-4" />
                Redirecting to order details...
              </p>
            </div>
          </div>
        )}
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
