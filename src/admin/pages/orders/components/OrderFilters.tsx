import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface OrderFiltersProps {
  status: string;
  onStatusChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  status,
  onStatusChange,
  search,
  onSearchChange,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by order number or customer name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;