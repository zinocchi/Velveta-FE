export interface CategoryInfo {
  id: string;
  displayName: string;
  description: string;
  image: string;
  section: 'drinks' | 'food';
}

export const CATEGORY_INFO: Record<string, CategoryInfo> = {
  hot_coffee: {
    id: 'hot_coffee',
    displayName: 'Hot Coffee',
    description: 'Rich, aromatic coffee served hot to warm your day.',
    image: 'https://globalassets.starbucks.com/digitalassets/products/bev/CaffeLatte.jpg',
    section: 'drinks',
  },
  cold_coffee: {
    id: 'cold_coffee',
    displayName: 'Cold Coffee',
    description: 'Refreshing iced coffee creations for any time.',
    image: 'https://globalassets.starbucks.com/digitalassets/products/bev/VanillaSweetCreamColdBrew.jpg',
    section: 'drinks',
  },
  hot_tea: {
    id: 'hot_tea',
    displayName: 'Hot Tea',
    description: 'Soothing herbal and classic tea selections.',
    image: 'https://globalassets.starbucks.com/digitalassets/products/bev/HoneyCitrusMintTea.jpg',
    section: 'drinks',
  },
  cold_tea: {
    id: 'cold_tea',
    displayName: 'Cold Tea',
    description: 'Fresh iced tea varieties to cool you down.',
    image: 'https://globalassets.starbucks.com/digitalassets/products/bev/IcedBlackTea.jpg',
    section: 'drinks',
  },
  hot_chocolate: {
    id: 'hot_chocolate',
    displayName: 'Hot Chocolate',
    description: 'Creamy and indulgent hot chocolate.',
    image: 'https://globalassets.starbucks.com/digitalassets/products/bev/HotChocolate.jpg',
    section: 'drinks',
  },
  bakery: {
    id: 'bakery',
    displayName: 'Bakery',
    description: 'Freshly baked pastries and breads.',
    image: 'https://globalassets.starbucks.com/digitalassets/products/food/SBX20210915_Croissant-onGreen.jpg',
    section: 'food',
  },
  treats: {
    id: 'treats',
    displayName: 'Treats',
    description: 'Sweet indulgences for any time.',
    image: 'https://globalassets.starbucks.com/digitalassets/products/food/SBX20181129_BirthdayCakePop.jpg',
    section: 'food',
  },
  lunch: {
    id: 'lunch',
    displayName: 'Lunch',
    description: 'Satisfying midday meals.',
    image: 'https://globalassets.starbucks.com/digitalassets/products/food/SBX20220207_GrilledCheeseOnSourdough_US.jpg',
    section: 'food',
  },
  breakfast: {
    id: 'breakfast',
    displayName: 'Breakfast',
    description: 'Hearty morning options to start your day.',
    image: 'https://globalassets.starbucks.com/digitalassets/products/food/SBX20190814_AvocadoSpread.jpg',
    section: 'food',
  },
};

export const DRINK_CATEGORIES = Object.values(CATEGORY_INFO).filter(c => c.section === 'drinks');
export const FOOD_CATEGORIES = Object.values(CATEGORY_INFO).filter(c => c.section === 'food');

export const getCategoryInfo = (categoryId: string): CategoryInfo => {
  return CATEGORY_INFO[categoryId] || {
    id: categoryId,
    displayName: categoryId.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    description: 'Delicious menu items available in this category.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
    section: 'food',
  };
};