import React, { useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import OrderList from './components/OrderList';
import ConfirmationModal from './components/ConfirmationModal';
import ReceiptModal from '../../../pages/checkout/components/receipt/OrderReceipt'
import { Order } from '../../types/order';
import { FaSpinner } from 'react-icons/fa';

const OrdersPage: React.FC = () => {
  const {
    orders,
    loading,
    filters,
    selectedOrders,
    setSelectedOrders,
    updateFilters,
    updateOrderStatus,
    bulkUpdateStatus,
  } = useOrders();

  const [showConfirm, setShowConfirm] = useState<{
    show: boolean;
    type: 'single' | 'bulk';
    orderId?: number;
    newStatus: string;
    orderNumber?: string;
  }>({
    show: false,
    type: 'single',
    newStatus: '',
  });

  const [updating, setUpdating] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    const order = orders.find(o => o.id === orderId);
    setShowConfirm({
      show: true,
      type: 'single',
      orderId,
      newStatus,
      orderNumber: order?.order_number,
    });
  };

  const handleBulkUpdate = (status: string) => {
    if (!status || selectedOrders.length === 0) return;
    setShowConfirm({
      show: true,
      type: 'bulk',
      newStatus: status,
    });
  };

  const handleConfirm = async () => {
    setUpdating(true);
    let success = false;

    if (showConfirm.type === 'single' && showConfirm.orderId) {
      success = await updateOrderStatus(showConfirm.orderId, showConfirm.newStatus);
    } else if (showConfirm.type === 'bulk') {
      success = await bulkUpdateStatus(selectedOrders, showConfirm.newStatus);
    }

    if (success) {
      setSelectedOrders([]);
    }

    setUpdating(false);
    setShowConfirm({ show: false, type: 'single', newStatus: '' });
  };

  const handleViewReceipt = (order: Order) => {
    setReceiptOrder(order);
    setShowReceipt(true);
  };

  const handleSelectOrder = (orderId: number, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Order Management</h1>
          <p className="text-gray-500">Manage and track customer orders</p>
        </div>
      </div>

      {/* Order List */}
      <OrderList
        orders={orders}
        loading={loading}
        filters={filters}
        onFilterChange={updateFilters}
        selectedOrders={selectedOrders}
        onSelectOrder={handleSelectOrder}
        onSelectAll={handleSelectAll}
        onStatusUpdate={handleStatusUpdate}
        onBulkUpdate={handleBulkUpdate}
        onViewReceipt={handleViewReceipt}
        onClearSelected={() => setSelectedOrders([])}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirm.show}
        type={showConfirm.type}
        newStatus={showConfirm.newStatus}
        orderNumber={showConfirm.orderNumber}
        selectedCount={selectedOrders.length}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm({ show: false, type: 'single', newStatus: '' })}
        updating={updating}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        order={receiptOrder}
      />
    </div>
  );
};

export default OrdersPage;