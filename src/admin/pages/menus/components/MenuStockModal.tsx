import React, { useState } from 'react';
import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import { Menu } from '../../../types/menu';

interface MenuStockModalProps {
  isOpen: boolean;
  menu: Menu;
  onClose: () => void;
  onUpdateStock: (id: number, stock: number) => void;
}

const MenuStockModal: React.FC<MenuStockModalProps> = ({
  isOpen,
  menu,
  onClose,
  onUpdateStock,
}) => {
  const [stock, setStock] = useState(menu.stock);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStock(menu.id, stock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Update Stock</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="font-medium text-gray-900">{menu.name}</p>
          <p className="text-sm text-gray-500">Current stock: {menu.stock}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Stock
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStock(prev => Math.max(0, prev - 1))}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <FaMinus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
                min={0}
                className="flex-1 px-4 py-2 text-center border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-700"
              />
              <button
                type="button"
                onClick={() => setStock(prev => prev + 1)}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <FaPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-700 text-white rounded-lg font-medium hover:bg-red-800"
            >
              Update Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuStockModal;