import React from 'react';
import { Menu } from '../../types/menu';
import MenuTableRow from './components/MenuTableRow';
import MenuFilters from './components/MenuFilters';
import { FaCoffee } from 'react-icons/fa';

interface MenuListProps {
  menus: Menu[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  onDelete: (id: number) => void;
  onToggleAvailability: (id: number) => void;
  onUpdateStock: (id: number, stock: number) => void;
  onEdit: (menu: Menu) => void;
}

const MenuList: React.FC<MenuListProps> = ({
  menus,
  loading,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  onDelete,
  onToggleAvailability,
  onUpdateStock,
  onEdit,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-700"></div>
      </div>
    );
  }

  if (menus.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCoffee className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg mb-2">No menus found</p>
        <p className="text-gray-400 text-sm">Try adjusting your search or filter</p>
      </div>
    );
  }

  return (
    <div>
      <MenuFilters
        search={search}
        onSearchChange={onSearchChange}
        category={category}
        onCategoryChange={onCategoryChange}
        categories={categories}
      />

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((menu) => (
                <MenuTableRow
                  key={menu.id}
                  menu={menu}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleAvailability={onToggleAvailability}
                  onUpdateStock={onUpdateStock}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MenuList;