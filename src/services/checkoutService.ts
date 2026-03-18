import api from '../services/api/config';
import { ApiResponse } from '../types/api';
import { 
  PaymentMethodFromAPI, 
  OrderPayload,
  Address,
  CartItem
} from '../types/checkout';

interface BuildOrderPayloadParams {
  items: CartItem[];
  deliveryType: 'delivery' | 'pickup';
  selectedAddress?: Address;
  deliveryOption?: any;
  paymentMethod: string;
  shippingCost: number;
  total: number;
  cardDetails?: any;
  selectedEWallet?: string;
  phoneNumber?: string;
  selectedBank?: string;
}

class CheckoutService {
  async getPaymentMethods(): Promise<PaymentMethodFromAPI[]> {
    const response = await api.get<ApiResponse<PaymentMethodFromAPI[]>>('/payment/methods');
    return response.data.data || response.data;
  }

  buildOrderPayload(params: BuildOrderPayloadParams): OrderPayload {
    const { 
      items, 
      deliveryType, 
      selectedAddress, 
      deliveryOption, 
      paymentMethod, 
      shippingCost, 
      total,
      cardDetails,
      selectedEWallet,
      phoneNumber,
      selectedBank
    } = params;

    const itemsPayload = items.map((item) => ({
      id: item.id,
      qty: item.qty,
    }));

    let shippingAddressPayload = null;

    if (deliveryType === 'delivery' && selectedAddress) {
      shippingAddressPayload = {
        id: selectedAddress.id,
        label: selectedAddress.label,
        recipientName: selectedAddress.recipientName,
        phoneNumber: selectedAddress.phoneNumber,
        address: selectedAddress.address,
        detail: selectedAddress.detail || '',
        city: selectedAddress.city,
        postalCode: selectedAddress.postalCode,
        province: 'DKI Jakarta',
        full_address:
          `${selectedAddress.address}, ${selectedAddress.detail || ''}, ${selectedAddress.city} ${selectedAddress.postalCode}`
            .replace(/, ,/g, ',')
            .replace(/,\s*$/, '')
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

    let paymentDetails = {};
    
    if (paymentMethod === 'credit_card' && cardDetails) {
      paymentDetails = {
        card_number: cardDetails.number,
        card_holder: cardDetails.name,
        expiry: cardDetails.expiry,
        cvv: cardDetails.cvv,
        save_card: cardDetails.saveCard,
      };
    } else if (paymentMethod === 'e_wallet') {
      paymentDetails = {
        provider: selectedEWallet,
        phone: phoneNumber,
      };
    } else if (paymentMethod === 'bank_transfer') {
      paymentDetails = {
        bank: selectedBank,
      };
    }

    return {
      items: itemsPayload,
      delivery_type: deliveryType,
      shipping_address: shippingAddressPayload,
      delivery_option: deliveryOptionPayload,
      payment_method: paymentMethod,
      shipping_cost: shippingCost,
      total: total,
      payment_details: paymentDetails,
    };
  }

  async createOrder(payload: OrderPayload): Promise<any> {
    const response = await api.post('/orders', payload);
    return response.data;
  }
}

export const checkoutService = new CheckoutService();