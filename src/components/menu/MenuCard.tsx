import React from "react";
import { type Menu } from "../../types/index";
import AddIcon from "@mui/icons-material/Add";

interface MenuCardProps {
  menu: Menu;
}

const MenuCard: React.FC<MenuCardProps> = ({ menu }) => {
  const formatPrice = (price: number): string => {
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  // Handle add to cart (placeholder for now)
  const handleAddToCart = () => {
    console.log("Add to cart clicked for:", menu.name);
    alert(
      `"${menu.name}" added to cart! (Cart feature will be available in next phase)`,
    );
  };

  return (
    <div className="menu-item bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Image with hover effect */}
      <div className="relative overflow-hidden rounded-t-xl aspect-square">
        <img
          src={
            menu.image_url ||
            "https://globalassets.starbucks.com/digitalassets/products/bev/LavenderOatmilkLatte.jpg"
          }
          alt={menu.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-white font-semibold text-sm">View Details</span>
        </div>

        {/* Stock badge */}
        {menu.stock <= 10 && menu.stock > 0 && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Only {menu.stock} left
          </div>
        )}

        {menu.stock === 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Out of stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {menu.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {menu.description || "No description available"}
        </p>

        <div className="flex justify-between items-center">
          <span className="font-bold text-red-700">
            {formatPrice(menu.price)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={menu.stock === 0}
            className={`
              flex items-center gap-1 px-3 py-1.5 rounded-full text-sm 
              font-medium transition-colors duration-300
              ${
                menu.stock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-700 text-white hover:bg-red-800 active:bg-red-900"
              }
            `}
          >
            <AddIcon fontSize="small" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
