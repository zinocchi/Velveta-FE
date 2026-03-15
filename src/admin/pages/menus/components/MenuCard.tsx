import React, { useState } from "react";
import {
  FaImage,
  FaBoxes,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaPlus,
  FaMinus,
  FaCheck,
  FaTimes,
  FaUtensils,
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
  const [isEditingStock, setIsEditingStock] = useState(false);
  const [stockValue, setStockValue] = useState(menu.stock);
  const [tempStock, setTempStock] = useState(menu.stock);
  const [imageError, setImageError] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleStockSave = () => {
    if (tempStock >= 0) {
      onUpdateStock(menu.id, tempStock);
      setStockValue(tempStock);
      setIsEditingStock(false);
    }
  };

  const handleStockCancel = () => {
    setTempStock(stockValue);
    setIsEditingStock(false);
  };

  const handleQuickAdd = () => {
    const newStock = stockValue + 1;
    onUpdateStock(menu.id, newStock);
    setStockValue(newStock);
    setTempStock(newStock);
  };

  const handleQuickRemove = () => {
    if (stockValue > 0) {
      const newStock = stockValue - 1;
      onUpdateStock(menu.id, newStock);
      setStockValue(newStock);
      setTempStock(newStock);
    }
  };

  // Construct image URL properly
  const getImageUrl = () => {
    if (!menu.image_url || imageError) return null;

    // Jika sudah URL lengkap
    if (menu.image_url.startsWith("http")) {
      return menu.image_url;
    }

    // Base URL dari environment variable atau default
    const baseUrl =
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "http://localhost:8000";

    // Bersihkan path
    const cleanPath = menu.image_url
      .replace("public/", "")
      .replace("storage/", "")
      .replace(/^\//, "");

    return `${baseUrl}/storage/${cleanPath}`;
  };
  const imageUrl = getImageUrl();

  const getStockStatusColor = () => {
    if (stockValue === 0) return "text-red-600 bg-red-50";
    if (stockValue < 10) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  const getStockStatusText = () => {
    if (stockValue === 0) return "Out of Stock";
    if (stockValue < 10) return "Low Stock";
    return "In Stock";
  };

  const getStockProgressWidth = () => {
    return `${Math.min((stockValue / 50) * 100, 100)}%`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Image Container - Fixed aspect ratio */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={menu.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <FaUtensils className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400">No image</p>
            </div>
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => onToggleAvailability(menu.id)}
            className={`p-2 rounded-lg shadow-md transition-all hover:scale-110 ${
              menu.is_available
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-400 text-white hover:bg-gray-500"
            }`}
            title={
              menu.is_available
                ? "Click to make unavailable"
                : "Click to make available"
            }>
            {menu.is_available ? (
              <FaToggleOn className="w-5 h-5" />
            ) : (
              <FaToggleOff className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-lg">
            {menu.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1">
              {menu.name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
              {menu.description || "No description available"}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-3">
          <p className="text-xl font-bold text-red-700">
            {formatCurrency(menu.price)}
          </p>
        </div>

        {/* Stock Management */}
        <div className="mt-auto border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <FaBoxes className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Stock</span>
            </div>

            {!isEditingStock ? (
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-semibold px-2 py-0.5 rounded-full ${getStockStatusColor()}`}>
                  {stockValue} units
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleQuickRemove}
                    disabled={stockValue <= 0}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Decrease stock">
                    <FaMinus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleQuickAdd}
                    className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Increase stock">
                    <FaPlus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      setTempStock(stockValue);
                      setIsEditingStock(true);
                    }}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit stock">
                    <FaEdit className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  value={tempStock}
                  onChange={(e) =>
                    setTempStock(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 text-right"
                  autoFocus
                />
                <button
                  onClick={handleStockSave}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Save">
                  <FaCheck className="w-3 h-3" />
                </button>
                <button
                  onClick={handleStockCancel}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Cancel">
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Stock Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  stockValue === 0
                    ? "bg-red-500"
                    : stockValue < 10
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: getStockProgressWidth() }}
              />
            </div>
            <p className="text-xs text-gray-500 flex items-center justify-between">
              <span>{getStockStatusText()}</span>
              <span>{stockValue} / 50</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onEdit(menu)}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
            <FaEdit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => {
              if (
                window.confirm(
                  `Delete "${menu.name}"? This action cannot be undone.`,
                )
              ) {
                onDelete(menu.id);
              }
            }}
            className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
            <FaTrash className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
