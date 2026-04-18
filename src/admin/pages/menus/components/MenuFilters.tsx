
import React, { useState } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';

interface MenuFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  isSearching?: boolean;
}

const MenuFilters: React.FC<MenuFiltersProps> = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  isSearching = false,
}) => {
  const [isTyping, setIsTyping] = useState(false);

  const handleSearchChange = (value: string) => {
    setIsTyping(true);
    onSearchChange(value);
    setTimeout(() => setIsTyping(false), 500);
  };

  const showSpinner = isSearching || isTyping;

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="flex-1 relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {showSpinner ? (
            <FaSpinner className="w-4 h-4 text-gray-400 animate-spin" />
          ) : (
            <FaSearch className="w-4 h-4 text-gray-400" />
          )}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by name or description..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-700 transition-all"
        />
      </div>

      {/* Category Filter */}
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-700 transition-all bg-white min-w-[180px]"
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MenuFilters;