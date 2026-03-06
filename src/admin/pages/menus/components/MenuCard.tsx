import React from "react";
import {
  FaImage,
  FaBoxes,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import type { Menu } from "../../../types";

interface MenuCardProps {
  menu: Menu;
  onDelete: (id: number) => void;
  onToggleAvailability: (id: number) => void;
  onUpdateStock: (id: number, stock: number) => void;
  onEdit: (menu: Menu) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({
  menu,
  onDelete,
  onToggleAvailability,
  onUpdateStock,
  onEdit,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="h-48 bg-gray-100 relative">
        {menu.image ? (
          <img
            src={menu.image}
            alt={menu.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaImage className="w-12 h-12 text-gray-300" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => onToggleAvailability(menu.id)}
            className={`p-2 rounded-lg ${
              menu.is_available
                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
          >
            {menu.is_available ? (
              <FaToggleOn className="w-5 h-5" />
            ) : (
              <FaToggleOff className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-gray-900">{menu.name}</h3>
            <p className="text-sm text-gray-500">{menu.category}</p>
          </div>
          <p className="text-lg font-bold text-red-700">
            {formatCurrency(menu.price)}
          </p>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {menu.description || "No description"}
        </p>

        {/* Stock */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <FaBoxes className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Stock:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={menu.stock}
              onChange={(e) => onUpdateStock(menu.id, parseInt(e.target.value))}
              className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
            />
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                menu.stock === 0
                  ? "bg-rose-50 text-rose-600"
                  : menu.stock < 10
                  ? "bg-amber-50 text-amber-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              {menu.stock === 0
                ? "Out"
                : menu.stock < 10
                ? "Low"
                : "Available"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(menu)}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
          >
            <FaEdit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(menu.id)}
            className="flex-1 px-3 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors flex items-center justify-center gap-1"
          >
            <FaTrash className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;