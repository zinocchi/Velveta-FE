import { IconType } from 'react-icons';
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaClock,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTruck,
  FaStore,
} from 'react-icons/fa';
import { SiVisa, SiMastercard } from 'react-icons/si';
import { MenuCategory } from './menu';

// ============= MENU CATEGORIES =============

export const DRINK_CATEGORIES: MenuCategory[] = [
  {
    id: 'hot-coffee',
    name: 'Hot Coffee',
    description: 'Rich, aromatic coffee served hot',
    image: 'https://globalassets.starbucks.com/digitalassets/products/bev/CaffeLatte.jpg',
    route: '/menu/drinks/hot-coffee',
  },
  {
    id: 'cold-coffee',
    name: 'Cold Coffee',
    description: 'Refreshing iced coffee creations',
    image: 'https://globalassets.starbucks.com/digitalassets/products/bev/VanillaSweetCreamColdBrew.jpg',
    route: '/menu/drinks/cold-coffee',
  },
  {
    id: 'hot-tea',
    name: 'Hot Tea',
    description: 'Soothing herbal and classic teas',
    image: 'https://globalassets.starbucks.com/digitalassets/products/bev/HoneyCitrusMintTea.jpg',
    route: '/menu/drinks/hot-tea',
  },
  {
    id: 'cold-tea',
    name: 'Cold Tea',
    description: 'Refreshing iced tea varieties',
    image: 'https://globalassets.starbucks.com/digitalassets/products/bev/IcedBlackTea.jpg',
    route: '/menu/drinks/cold-tea',
  },
  {
    id: 'hot-chocolate',
    name: 'Hot Chocolate & More',
    description: 'Rich, creamy chocolate drinks',
    image: 'https://globalassets.starbucks.com/digitalassets/products/bev/HotChocolate.jpg',
    route: '/menu/drinks/hot-chocolate',
  },
];

export const FOOD_CATEGORIES: MenuCategory[] = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    description: 'Morning favorites to start your day',
    image: 'https://globalassets.starbucks.com/digitalassets/products/food/EggPestoMozzarellaSandwich.jpg',
    route: '/menu/food/breakfast',
  },
  {
    id: 'bakery',
    name: 'Bakery',
    description: 'Freshly baked pastries and breads',
    image: 'https://globalassets.starbucks.com/digitalassets/products/food/SBX20210915_Croissant-onGreen.jpg',
    route: '/menu/food/bakery',
  },
  {
    id: 'treats',
    name: 'Treats',
    description: 'Sweet indulgences for any time',
    image: 'https://globalassets.starbucks.com/digitalassets/products/food/SBX20181129_BirthdayCakePop.jpg',
    route: '/menu/food/treats',
  },
  {
    id: 'lunch',
    name: 'Lunch',
    description: 'Satisfying midday meals',
    image: 'https://globalassets.starbucks.com/digitalassets/products/food/SBX20220207_GrilledCheaseOnSourdough_US.jpg',
    route: '/menu/food/lunch',
  },
  {
    id: 'snack',
    name: 'Snacks',
    description: 'Light bites and savory snacks',
    image: 'https://globalassets.starbucks.com/digitalassets/products/food/SBX20190903_SmokedTurkeyProteinBox.jpg',
    route: '/menu/food/snack',
  },
];

export const ALL_CATEGORIES = [...DRINK_CATEGORIES, ...FOOD_CATEGORIES];

/**
 * Utility function to get category fallback image
 */
export const getCategoryFallbackImage = (category?: string): string => {
  if (!category) return 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085';
  
  return ALL_CATEGORIES.find((cat) => cat.id === category)?.image ?? 
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085';
};

// ============= PAYMENT METHODS =============

export interface PaymentMethodConfig {
  id: string;
  label: string;
  icon: IconType;
  description: string;
  brands?: IconType[];
  minAmount?: number;
  maxAmount?: number;
  fee?: number;
  feeType?: 'fixed' | 'percentage';
}

export const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: 'cash',
    label: 'Cash',
    icon: FaMoneyBillWave,
    description: 'Pay with cash at the counter',
    minAmount: 0,
    maxAmount: 10000000,
    fee: 0,
  },
  {
    id: 'debit',
    label: 'Debit / Credit Card',
    icon: FaCreditCard,
    description: 'Visa, Mastercard supported',
    brands: [SiVisa, SiMastercard],
    fee: 0.02,
    feeType: 'percentage',
  },
];

// ============= ORDER STATUS CONFIG =============

export const ORDER_STATUS_CONFIG = {
  PENDING: {
    color: 'yellow',
    label: 'Pending',
    icon: FaClock,
  },
  PROCESSING: {
    color: 'blue',
    label: 'Processing',
    icon: FaSpinner,
  },
  COMPLETED: {
    color: 'green',
    label: 'Completed',
    icon: FaCheckCircle,
  },
  CANCELLED: {
    color: 'red',
    label: 'Cancelled',
    icon: FaExclamationTriangle,
  },
} as const;

// ============= DELIVERY TYPE CONFIG =============

export const DELIVERY_TYPE_CONFIG = {
  delivery: {
    label: 'Delivery',
    icon: FaTruck,
    time: 45,
  },
  pickup: {
    label: 'Pickup',
    icon: FaStore,
    time: 15,
  },
} as const;