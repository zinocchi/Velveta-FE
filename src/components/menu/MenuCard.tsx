import React from "react";
import { type Menu } from "../../types/index";
import { useCart } from "../../context/CartContext";

interface MenuCardProps {
  menu: Menu;
  item?: never;
}

const MenuCard: React.FC<MenuCardProps> = ({ menu }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(menu);
  };

  const formatPrice = (price: number): string => {
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  return (
    <div className="menu-item bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100">
      {/* Image with fixed aspect ratio */}
      <div className="relative overflow-hidden">
        <img
          src={
            menu.image_url ||
            "https://globalassets.starbucks.com/digitalassets/products/bev/LavenderOatmilkLatte.jpg"
          }
          alt={menu.name}
          className="w-full h-48 object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {menu.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {menu.description || "No description available"}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-lg">
              {formatPrice(menu.price)}
            </span>
            
            {/* Stock status - only show if low or out of stock */}
            {menu.stock <= 10 && menu.stock > 0 && (
              <span className="text-amber-600 text-xs font-medium mt-1">
                Only {menu.stock} left
              </span>
            )}
            
            {menu.stock === 0 && (
              <span className="text-red-600 text-xs font-medium mt-1">
                Out of stock
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={menu.stock === 0}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium 
              transition-all duration-200 min-w-[80px]
              ${
                menu.stock === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[#FFE8E8] text-[#C51605] hover:bg-[#FFD6D6] active:scale-95"
              }
            `}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;