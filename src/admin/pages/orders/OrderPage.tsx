import React, { useState } from "react";
import { useOrders } from "../../hooks/useOrders";
import OrderList from "./components/OrderList";
import ConfirmationModal from "./components/ConfirmationModal";
import ReceiptModal from "../../components/ReceiptModal";
import { Order } from "../../types/order";
import { useToast } from "../../hooks/useToast"; // Sesuaikan path dengan hook toast yang sudah ada

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

  const { addToast } = useToast(); // Gunakan hook toast yang sudah ada

  const [showConfirm, setShowConfirm] = useState<{
    show: boolean;
    type: "single" | "bulk";
    orderId?: number;
    newStatus: string;
    orderNumber?: string;
    currentStatus?: string;
  }>({
    show: false,
    type: "single",
    newStatus: "",
  });

  const [updating, setUpdating] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    const order = orders.find((o) => o.id === orderId);
    
    // Validasi: jika order sudah COMPLETED atau CANCELLED, tidak bisa diubah
    if (order?.status === 'COMPLETED') {
      addToast('Completed orders cannot be modified', 'error');
      return;
    }
    
    if (order?.status === 'CANCELLED') {
      addToast('Cancelled orders cannot be modified', 'error');
      return;
    }
    
    setShowConfirm({
      show: true,
      type: "single",
      orderId,
      newStatus,
      orderNumber: order?.order_number,
      currentStatus: order?.status,
    });
  };

  const handleBulkUpdate = (status: string) => {
    if (!status || selectedOrders.length === 0) return;
    
    // Validasi bulk: cek apakah ada order COMPLETED/CANCELLED yang dipilih
    const selectedOrdersData = orders.filter(o => selectedOrders.includes(o.id));
    const lockedOrders = selectedOrdersData.filter(o => 
      o.status === 'COMPLETED' || o.status === 'CANCELLED'
    );
    
    if (lockedOrders.length > 0) {
      const completedCount = lockedOrders.filter(o => o.status === 'COMPLETED').length;
      const cancelledCount = lockedOrders.filter(o => o.status === 'CANCELLED').length;
      
      let message = '';
      if (completedCount > 0 && cancelledCount > 0) {
        message = `${completedCount} completed and ${cancelledCount} cancelled order(s) cannot be modified.`;
      } else if (completedCount > 0) {
        message = `${completedCount} completed order(s) cannot be modified.`;
      } else {
        message = `${cancelledCount} cancelled order(s) cannot be modified.`;
      }
      
      if (lockedOrders.length === selectedOrders.length) {
        addToast(`All selected orders are locked. ${message}`, 'error');
      } else {
        addToast(`${message} Please deselect them first.`, 'warning');
      }
      return;
    }
    
    setShowConfirm({
      show: true,
      type: "bulk",
      newStatus: status,
    });
  };

  const handleConfirm = async () => {
    setUpdating(true);
    let success = false;

    try {
      if (showConfirm.type === "single" && showConfirm.orderId) {
        success = await updateOrderStatus(
          showConfirm.orderId,
          showConfirm.newStatus
        );
        if (success) {
          addToast(`Order #${showConfirm.orderNumber} status updated successfully`, 'success');
        }
      } else if (showConfirm.type === "bulk") {
        success = await bulkUpdateStatus(selectedOrders, showConfirm.newStatus);
        if (success) {
          addToast(`${selectedOrders.length} orders updated successfully`, 'success');
        }
      }

      if (success) {
        setSelectedOrders([]);
      }
    } catch (error) {
      addToast('Failed to update order status. Please try again.', 'error');
    } finally {
      setUpdating(false);
      setShowConfirm({ show: false, type: "single", newStatus: "" });
    }
  };

  const handleViewReceipt = (order: Order) => {
    setReceiptOrder(order);
    setShowReceipt(true);
  };

  const handleSelectOrder = (orderId: number, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Filter out locked orders when selecting all
      const selectableOrders = orders
        .filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED')
        .map((o) => o.id);
      setSelectedOrders(selectableOrders);
      
      const lockedCount = orders.filter(o => 
        o.status === 'COMPLETED' || o.status === 'CANCELLED'
      ).length;
      
      if (lockedCount > 0) {
        addToast(`${lockedCount} locked order(s) were not selected (cannot be modified)`, 'info');
      }
    } else {
      setSelectedOrders([]);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Order Management
          </h1>
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
        currentStatus={showConfirm.currentStatus}
        newStatus={showConfirm.newStatus}
        orderNumber={showConfirm.orderNumber}
        selectedCount={selectedOrders.length}
        onConfirm={handleConfirm}
        onCancel={() =>
          setShowConfirm({ show: false, type: "single", newStatus: "" })
        }
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