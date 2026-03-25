// components/MenuGrid.tsx
import React from 'react';
import { Menu } from '../../../types/menu';
import MenuCard from './MenuCard';

interface MenuGridProps {
  items: Menu[];
  category?: string;
  quantities: Record<number, number>;
  isLoggedIn: boolean; // Tambahkan
  isAdminPreview: boolean; // Tambahkan
  onAddToCart: (item: Menu, e: React.MouseEvent) => void;
  onIncrease: (item: Menu, e: React.MouseEvent) => void;
  onDecrease: (itemId: number, e: React.MouseEvent) => void;
}

const MenuGrid: React.FC<MenuGridProps> = ({
  items,
  category,
  quantities,
  isLoggedIn,
  isAdminPreview,
  onAddToCart,
  onIncrease,
  onDecrease,
}) => {
  React.useEffect(() => {
    console.log('MenuGrid - Items length:', items.length);
    console.log('MenuGrid - Category:', category);
  }, [items, category]);

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <p className="text-gray-600">No menu items available in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
      {items.map((item) => (
        <MenuCard
          key={`${category}-${item.id}`}
          item={item}
          category={category}
          quantity={quantities[item.id] || 0}
          isLoggedIn={isLoggedIn}
          isAdminPreview={isAdminPreview}
          onAddToCart={onAddToCart}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
        />
      ))}
    </div>
  );
};

export default MenuGrid;