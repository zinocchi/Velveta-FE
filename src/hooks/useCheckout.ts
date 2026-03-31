import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { checkoutService } from '../services/checkoutService';
import { 
  PaymentStep, 
  DeliveryType, 
  PaymentMethod,
  CardDetails,
  OrderSummary,
  DeliveryEstimate,
  Address,
  PaymentMethodFromAPI
} from '../types/checkout';

const DELIVERY_OPTIONS = [
  {
    id: 'regular',
    name: 'Regular Delivery',
    description: 'Standard delivery',
    estimateMinutes: { min: 45, max: 90 },
    cost: 15000,
    icon: 'FaMotorcycle',
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: 'Priority delivery',
    estimateMinutes: { min: 30, max: 45 },
    cost: 30000,
    icon: 'FaClock',
  },
];

export const useCheckout = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();

  const [paymentStep, setPaymentStep] = useState<PaymentStep>('confirmation');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodFromAPI[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);
  
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    saveCard: false,
  });
  const [cardErrors, setCardErrors] = useState<Partial<Record<keyof CardDetails, string>>>({});
  const [selectedEWallet, setSelectedEWallet] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  
  // Delivery
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('regular');
  const [deliveryEstimate, setDeliveryEstimate] = useState<DeliveryEstimate | null>(null);
  
  // Terms
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Processing
  const [processing, setProcessing] = useState(false);
  
  // Notification
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Order detail modal
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  // Fetch payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoadingPaymentMethods(true);
        const methods = await checkoutService.getPaymentMethods();
        setPaymentMethods(methods);
        if (methods.length > 0) {
          setPaymentMethod(methods[0].code as PaymentMethod);
        }
      } catch (error) {
        console.error('Failed to fetch payment methods:', error);
        showNotification('Failed to load payment methods', 'error');
      } finally {
        setLoadingPaymentMethods(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    if (deliveryType === 'delivery' && selectedDeliveryOption) {
      const option = DELIVERY_OPTIONS.find((opt) => opt.id === selectedDeliveryOption);
      if (option) {
        const now = new Date();
        const minTime = new Date(now.getTime() + option.estimateMinutes.min * 60000);
        const maxTime = new Date(now.getTime() + option.estimateMinutes.max * 60000);

        const formatTime = (date: Date) => {
          return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          });
        };

        setDeliveryEstimate({
          minMinutes: option.estimateMinutes.min,
          maxMinutes: option.estimateMinutes.max,
          timeRange: `${formatTime(minTime)} - ${formatTime(maxTime)}`,
        });
      }
    }
  }, [selectedDeliveryOption, deliveryType]);

  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'success'
  ) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const calculateTotals = (): OrderSummary => {
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shippingCost =
      deliveryType === 'pickup'
        ? 0
        : DELIVERY_OPTIONS.find((opt) => opt.id === selectedDeliveryOption)?.cost || 0;
    const total = subtotal + shippingCost;

    return { subtotal, shippingCost, total };
  };

  const { subtotal, shippingCost, total } = calculateTotals();

  const validateCardDetails = (): boolean => {
    const errors: Partial<Record<keyof CardDetails, string>> = {};

    if (!cardDetails.number.replace(/\s/g, '').match(/^\d{16}$/)) {
      errors.number = 'Card number must be 16 digits';
    }

    if (!cardDetails.name.trim()) {
      errors.name = 'Cardholder name is required';
    }

    if (!cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      errors.expiry = 'Invalid expiry date (MM/YY)';
    }

    if (!cardDetails.cvv.match(/^\d{3}$/)) {
      errors.cvv = 'CVV must be 3 digits';
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmOrder = (): boolean => {
    if (state.items.length === 0) {
      showNotification('Your cart is empty', 'error');
      return false;
    }

    if (!termsAccepted) {
      showNotification('Please accept the terms and conditions', 'error');
      return false;
    }

    setPaymentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  };

  const handleProcessPayment = async (
    addresses: Address[],
    selectedAddressId: string
  ) => {
    // Validate based on payment method
    if (paymentMethod === 'credit_card') {
      if (!validateCardDetails()) {
        showNotification('Please fill in all card details correctly', 'error');
        return;
      }
    } else if (paymentMethod === 'e_wallet') {
      if (!selectedEWallet || !phoneNumber) {
        showNotification('Please select e-wallet and enter phone number', 'error');
        return;
      }
    } else if (paymentMethod === 'bank_transfer') {
      if (!selectedBank) {
        showNotification('Please select a bank', 'error');
        return;
      }
    }

    // Validate address for delivery
    if (deliveryType === 'delivery' && !selectedAddressId) {
      showNotification('Please select a delivery address', 'error');
      return;
    }

    setPaymentStep('processing');

    try {
      setProcessing(true);

      const selectedAddress = deliveryType === 'delivery' 
        ? addresses.find((addr) => addr.id === selectedAddressId)
        : undefined;
        
      const deliveryOption = DELIVERY_OPTIONS.find((opt) => opt.id === selectedDeliveryOption);

      // Log payload untuk debugging
      console.log('Building order payload...');
      
      const orderPayload = checkoutService.buildOrderPayload({
        items: state.items,
        deliveryType,
        selectedAddress,
        deliveryOption,
        paymentMethod,
        shippingCost,
        total,
        cardDetails,
        selectedEWallet,
        phoneNumber,
        selectedBank,
      });

      console.log('Order payload:', JSON.stringify(orderPayload, null, 2));

      console.log('Creating order...');
      const response = await checkoutService.createOrder(orderPayload);
      
      console.log('Order response:', response);

      const orderId = response.order_id || response.data?.id || response.data?.order_id;

      setPaymentStep('success');

      setTimeout(() => {
        dispatch({ type: 'CLEAR_CART' });
        setLastOrderId(orderId);
        setShowOrderDetail(true);
      }, 2000);
      
    } catch (err: any) {
      console.error('Checkout error DETAILS:', err);
      
      // Log detail error untuk debugging
      if (err.response) {
        console.error('Error response status:', err.response.status);
        console.error('Error response data:', err.response.data);
        console.error('Error response headers:', err.response.headers);
      } else if (err.request) {
        console.error('Error request:', err.request);
      } else {
        console.error('Error message:', err.message);
      }
      
      // Extract error message dengan lebih baik
      let errorMessage = 'Failed to checkout. Please try again.';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Handle berbagai format error response
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.errors) {
          // Handle validation errors
          const validationErrors = Object.values(errorData.errors).flat();
          if (validationErrors.length > 0) {
            errorMessage = validationErrors.join(', ');
          }
        } else {
          errorMessage = JSON.stringify(errorData);
        }
      }

      showNotification(errorMessage, 'error');
      setPaymentStep('payment');
    } finally {
      setProcessing(false);
    }
  };

  const handleBackToConfirmation = () => {
    setPaymentStep('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleIncreaseQty = (itemId: number) => {
    const item = state.items.find((i) => i.id === itemId);
    if (!item || item.qty >= 10) return;
    dispatch({ type: 'INCREMENT', payload: itemId });
  };

  const handleDecreaseQty = (itemId: number) => {
    const item = state.items.find((i) => i.id === itemId);
    if (!item) return;
    if (item.qty === 1) {
      dispatch({ type: 'REMOVE', payload: itemId });
    } else {
      dispatch({ type: 'DECREMENT', payload: itemId });
    }
  };

  const handleCloseOrderDetail = () => {
    setShowOrderDetail(false);
    setLastOrderId(null);
    navigate('/dashboard');
  };

  return {
    // Core states
    paymentStep,
    deliveryType,
    setDeliveryType,
    paymentMethod,
    setPaymentMethod,
    paymentMethods,
    loadingPaymentMethods,
    
    // Payment details
    cardDetails,
    setCardDetails,
    cardErrors,
    selectedEWallet,
    setSelectedEWallet,
    phoneNumber,
    setPhoneNumber,
    selectedBank,
    setSelectedBank,
    
    // Delivery
    selectedDeliveryOption,
    setSelectedDeliveryOption,
    deliveryEstimate,
    deliveryOptions: DELIVERY_OPTIONS,
    
    // Terms
    termsAccepted,
    setTermsAccepted,
    
    // Processing
    processing,
    
    // Notifications
    notification,
    showNotification,
    
    // Order detail
    showOrderDetail,
    lastOrderId,
    handleCloseOrderDetail,
    
    // Calculations
    subtotal,
    shippingCost,
    total,
    
    handleIncreaseQty,
    handleDecreaseQty,
    
    handleConfirmOrder,
    handleProcessPayment,
    handleBackToConfirmation,
    
    validateCardDetails,
  };
};