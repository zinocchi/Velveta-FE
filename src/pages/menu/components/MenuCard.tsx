// components/MenuCard.tsx
import React from 'react';
import { Menu } from '../../../types/menu';
import { getCategoryInfo } from '../../../types/category';
import QuantityControl from '../../../components/ui/QuantityControl';
import { flyToCart } from '../../../utils/flyToCart';

interface MenuCardProps {
  item: Menu;
  category?: string;
  quantity: number;
  isLoggedIn: boolean; // Terima dari props
  isAdminPreview: boolean; // Terima dari props
  onAddToCart: (item: Menu, e: React.MouseEvent) => void;
  onIncrease: (item: Menu, e: React.MouseEvent) => void;
  onDecrease: (itemId: number, e: React.MouseEvent) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({
  item,
  category,
  quantity,
  isLoggedIn,
  isAdminPreview,
  onAddToCart,
  onIncrease,
  onDecrease,
}) => {
  const fallbackImage = getCategoryInfo(category || '').image;

  // Debug
  React.useEffect(() => {
    console.log('MenuCard render:', item.name, 'category:', category);
  }, [item, category]);

  return (
    <div
      className={`cart-source bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden p-3 sm:p-4 md:p-5 h-full flex flex-col hover:shadow-md transition-shadow duration-300 ${
        isAdminPreview ? 'opacity-90' : ''
      }`}
    >
      {/* Image */}
      <div className="overflow-hidden rounded-md sm:rounded-lg mb-3 sm:mb-4">
        <img
          src={item.image_url ?? fallbackImage}
          alt={item.name}
          className="w-full h-32 sm:h-36 md:h-40 object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
          }}
        />
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
        {item.name}
      </h3>

      {/* Description */}
      {item.description && (
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
          {item.description}
        </p>
      )}

      {/* Price and Actions */}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-3">
          <p className="text-base sm:text-lg font-bold text-gray-900">
            Rp {item.price.toLocaleString('id-ID')}
          </p>

          {/* Add Button - Show if not logged in or not in cart */}
          {!isLoggedIn && (
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-md sm:rounded-lg transition-colors duration-300"
              onClick={(e) => onAddToCart(item, e)}
            >
              Add
            </button>
          )}
          
          {isLoggedIn && !isAdminPreview && quantity === 0 && (
            <button
              className="bg-red-700 hover:bg-red-800 text-white text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-md sm:rounded-lg transition-colors duration-300 active:scale-95"
              onClick={(e) => onIncrease(item, e)}
            >
              Add
            </button>
          )}
        </div>

        {/* Quantity Control - Show if in cart */}
        {isLoggedIn && !isAdminPreview && quantity > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-xs sm:text-sm text-gray-600">Quantity:</span>
            <QuantityControl
              quantity={quantity}
              onIncrease={(e) => onIncrease(item, e as any)}
              onDecrease={(e) => onDecrease(item.id, e as any)}
              maxQuantity={10}
            />
          </div>
        )}

        {/* Admin Preview - Show quantity but no controls */}
        {quantity > 0 && isAdminPreview && (
          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-xs sm:text-sm text-gray-600">In cart:</span>
            <span className="text-sm font-semibold text-gray-500">
              {quantity} items
            </span>
          </div>
        )}

        {/* Max quantity message */}
        {quantity >= 10 && !isAdminPreview && (
          <p className="text-xs text-red-600 mt-2 text-right animate-pulse">
            Max quantity reached
          </p>
        )}
      </div>
    </div>
  );
};

export default MenuCard;