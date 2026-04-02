import React, { useState } from 'react';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaImage } from 'react-icons/fa';
import { Menu } from '../../../types/menu';
import MenuStockModal from './MenuStockModal';

interface MenuTableRowProps {
  menu: Menu;
  onEdit: (menu: Menu) => void;
  onDelete: (id: number) => void;
  onToggleAvailability: (id: number) => void;
  onUpdateStock: (id: number, stock: number) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const MenuTableRow: React.FC<MenuTableRowProps> = ({
  menu,
  onEdit,
  onDelete,
  onToggleAvailability,
  onUpdateStock,
}) => {
  const [showStockModal, setShowStockModal] = useState(false);

  const getStockBadge = (stock: number) => {
    if (stock <= 0) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Out of Stock</span>;
    }
    if (stock < 10) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">Low Stock ({stock})</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">In Stock ({stock})</span>;
  };

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        {/* Image */}
        <td className="px-4 py-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {menu.image ? (
              <img src={menu.image} alt={menu.name} className="w-full h-full object-cover" />
            ) : (
              <FaImage className="w-6 h-6 text-gray-400" />
            )}
          </div>
        </td>

        {/* Name & Description */}
        <td className="px-4 py-3">
          <div>
            <p className="font-medium text-gray-900">{menu.name}</p>
            <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">
              {menu.description || 'No description'}
            </p>
          </div>
        </td>

        {/* Category */}
        <td className="px-4 py-3">
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
            {menu.category?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Uncategorized'}
          </span>
        </td>

        {/* Price */}
        <td className="px-4 py-3">
          <span className="font-semibold text-gray-900">{formatCurrency(menu.price)}</span>
        </td>

        {/* Stock */}
        <td className="px-4 py-3">
          <button onClick={() => setShowStockModal(true)} className="hover:opacity-80 transition-opacity">
            {getStockBadge(menu.stock)}
          </button>
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <button
            onClick={() => onToggleAvailability(menu.id)}
            className={`flex items-center gap-2 px-2 py-1 rounded-lg text-sm font-medium transition-colors ${
              menu.is_available
                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {menu.is_available ? <FaToggleOn className="w-4 h-4" /> : <FaToggleOff className="w-4 h-4" />}
            {menu.is_available ? 'Active' : 'Inactive'}
          </button>
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(menu)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(menu.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Stock Modal */}
      <MenuStockModal
        isOpen={showStockModal}
        menu={menu}
        onClose={() => setShowStockModal(false)}
        onUpdateStock={onUpdateStock}
      />
    </>
  );
};

export default MenuTableRow;