import React from 'react';
import { Order } from '../../../types/order';
import OrderTableRow from './OrderTableRow';
import OrderFilters from './OrderFilters';
import BulkActionsBar from './BulkActionBar';
import { FaSearch } from 'react-icons/fa';

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  filters: { status: string; search: string };
  onFilterChange: (filters: Partial<{ status: string; search: string }>) => void;
  selectedOrders: number[];
  onSelectOrder: (orderId: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onStatusUpdate: (orderId: number, newStatus: string) => void;
  onBulkUpdate: (status: string) => void;
  onViewReceipt: (order: Order) => void;
  onClearSelected: () => void;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  loading,
  filters,
  onFilterChange,
  selectedOrders,
  onSelectOrder,
  onSelectAll,
  onStatusUpdate,
  onBulkUpdate,
  onViewReceipt,
  onClearSelected,
}) => {
  const allSelected = selectedOrders.length === orders.length && orders.length > 0;

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-700" />
        <p className="mt-2 text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <>
      <OrderFilters
        status={filters.status}
        onStatusChange={(value) => onFilterChange({ status: value })}
        search={filters.search}
        onSearchChange={(value) => onFilterChange({ search: value })}
      />

      <BulkActionsBar
        selectedCount={selectedOrders.length}
        onBulkUpdate={onBulkUpdate}
        onClearSelected={onClearSelected}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {orders.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {/* Header */}
            <div className="p-5 bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="w-4 h-4 text-red-700 rounded border-gray-300 focus:ring-red-200"
                  />
                </div>
                <div className="flex-1 grid grid-cols-4 gap-4 text-xs font-medium text-gray-500 uppercase">
                  <div>Order Info</div>
                  <div>Customer</div>
                  <div>Items</div>
                  <div>Total</div>
                </div>
                <div className="w-40">Status & Actions</div>
              </div>
            </div>

            {/* Rows */}
            {orders.map((order) => (
              <OrderTableRow
                key={order.id}
                order={order}
                isSelected={selectedOrders.includes(order.id)}
                onSelect={(checked) => onSelectOrder(order.id, checked)}
                onStatusUpdate={onStatusUpdate}
                onViewReceipt={onViewReceipt}
              />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-900 text-lg font-medium mb-2">No orders found</p>
            <p className="text-gray-500 text-sm">Orders will appear here when customers place them</p>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderList;