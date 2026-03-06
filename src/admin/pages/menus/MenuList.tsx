import React from "react";
import { FaSearch, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import type { Menu } from "../../types";
import MenuCard from "./components/MenuCard";

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
  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search menus..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-700"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <MenuCard
              key={menu.id}
              menu={menu}
              onDelete={onDelete}
              onToggleAvailability={onToggleAvailability}
              onUpdateStock={onUpdateStock}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default MenuList;