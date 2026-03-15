import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/axios";
import type { Order } from "../../types";
import OrderList from "./OrderList";
import OrderDetail from "./OrderDetail";
import { 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaInfoCircle,
  FaSpinner,
  FaTimesCircle  // Tambahkan ini
} from "react-icons/fa";

const OrdersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);  // Tambahkan state updating
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [bulkStatus, setBulkStatus] = useState("");
  
  // State untuk konfirmasi
  const [showConfirm, setShowConfirm] = useState<{
    show: boolean;
    type: 'single' | 'bulk';
    orderId?: number;
    currentStatus?: string;
    newStatus: string;
    orderNumber?: string;
  }>({
    show: false,
    type: 'single',
    newStatus: ''
  });

  // State untuk notifikasi
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    show: false,
    message: '',
    type: 'info'
  });

  useEffect(() => {
    if (!id) {
      fetchOrders();
    }
  }, [filter, search, id]);

  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'success'
  ) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== "all") params.append("status", filter.toUpperCase());
      if (search) params.append("search", search);

      const response = await api.get(`/admin/orders?${params.toString()}`);
      setOrders(response.data.data.data || response.data.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      showNotification("Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi onStatusUpdate dengan cara yang sama seperti di OrderDetail
  const onStatusUpdate = async (orderId: number, newStatus: string) => {
    // Cari order untuk mendapatkan current status
    const order = orders.find(o => o.id === orderId);
    
    setShowConfirm({
      show: true,
      type: 'single',
      orderId,
      currentStatus: order?.status,  // Set currentStatus dari orders
      newStatus,
      orderNumber: order?.order_number
    });
  };

  // Handle update status setelah konfirmasi
  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      
      if (showConfirm.type === 'single' && showConfirm.orderId) {
        // Single update
        await api.put(`/admin/orders/${showConfirm.orderId}/status`, { 
          status: showConfirm.newStatus 
        });
        
        showNotification(
          `Order #${showConfirm.orderNumber || showConfirm.orderId} status updated to ${showConfirm.newStatus}`,
          "success"
        );
        
        if (id) {
          // Refresh detail page
          window.location.reload();
        } else {
          fetchOrders();
        }
      } else if (showConfirm.type === 'bulk') {
        // Bulk update
        await api.post("/admin/orders/bulk-status", {
          order_ids: selectedOrders,
          status: showConfirm.newStatus,
        });
        
        showNotification(
          `${selectedOrders.length} orders updated to ${showConfirm.newStatus}`,
          "success"
        );
        
        setSelectedOrders([]);
        setBulkStatus("");
        fetchOrders();
      }
    } catch (error: any) {
      console.error("Failed to update order status:", error);
      showNotification(
        error.response?.data?.message || "Failed to update order status",
        "error"
      );
    } finally {
      setUpdating(false);
      setShowConfirm({ show: false, type: 'single', newStatus: '' });
    }
  };

  const handleStatusCancel = () => {
    setShowConfirm({ show: false, type: 'single', newStatus: '' });
  };

  const handleBulkUpdate = () => {
    if (!bulkStatus || selectedOrders.length === 0) return;
    
    setShowConfirm({
      show: true,
      type: 'bulk',
      newStatus: bulkStatus
      // Untuk bulk, currentStatus tidak perlu karena multiple orders bisa beda status
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-700';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PROCESSING':
        return <FaSpinner className="w-5 h-5 animate-spin" />;
      case 'COMPLETED':
        return <FaCheckCircle className="w-5 h-5" />;
      case 'CANCELLED':
        return <FaTimesCircle className="w-5 h-5" />;
      default:
        return <FaInfoCircle className="w-5 h-5" />;
    }
  };

  // If there's an ID, show detail page
  if (id) {
    return <OrderDetail orderId={parseInt(id)} onStatusUpdate={onStatusUpdate} />;
  }

  return (
    <div className="p-8">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slideIn ${
            notification.type === 'success' ? 'bg-green-600' :
            notification.type === 'error' ? 'bg-red-600' :
            notification.type === 'warning' ? 'bg-yellow-600' :
            'bg-blue-600'
          } text-white`}>
          {notification.type === 'success' && <FaCheckCircle className="w-5 h-5" />}
          {notification.type === 'error' && <FaExclamationTriangle className="w-5 h-5" />}
          {notification.type === 'warning' && <FaExclamationTriangle className="w-5 h-5" />}
          {notification.type === 'info' && <FaInfoCircle className="w-5 h-5" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleStatusCancel}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              showConfirm.newStatus === 'CANCELLED' ? 'bg-red-100' :
              showConfirm.newStatus === 'COMPLETED' ? 'bg-green-100' :
              'bg-blue-100'
            }`}>
              {getStatusIcon(showConfirm.newStatus)}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Confirm Status Update
            </h3>
            
            <p className="text-gray-600 text-center mb-6">
              {showConfirm.type === 'single' ? (
                <>
                  Are you sure you want to change this order status<br />
                  from <span className={`px-2 py-0.5 rounded-full text-sm ${getStatusColor(showConfirm.currentStatus || '')}`}>
                    {showConfirm.currentStatus}
                  </span> to <span className={`px-2 py-0.5 rounded-full text-sm ${getStatusColor(showConfirm.newStatus)}`}>
                    {showConfirm.newStatus}
                  </span>?
                </>
              ) : (
                <>
                  Are you sure you want to change <span className="font-semibold">{selectedOrders.length}</span> selected orders<br />
                  to <span className={`px-2 py-0.5 rounded-full text-sm ${getStatusColor(showConfirm.newStatus)}`}>
                    {showConfirm.newStatus}
                  </span>?
                </>
              )}
            </p>

            {showConfirm.newStatus === 'CANCELLED' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-yellow-700 flex items-center gap-2">
                  <FaExclamationTriangle className="w-4 h-4 flex-shrink-0" />
                  Cancelling an order will restore stock for all items.
                </p>
              </div>
            )}

            {showConfirm.newStatus === 'COMPLETED' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4 flex-shrink-0" />
                  Marking as completed will finalize the order.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleStatusCancel}
                disabled={updating}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={updating}
                className={`flex-1 px-4 py-3 rounded-xl text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                  showConfirm.newStatus === 'CANCELLED' ? 'bg-red-600 hover:bg-red-700' :
                  showConfirm.newStatus === 'COMPLETED' ? 'bg-green-600 hover:bg-green-700' :
                  'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {updating ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Order Management</h1>
          <p className="text-gray-500">Manage and track customer orders</p>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-amber-800">
              {selectedOrders.length} orders selected
            </span>
            <div className="flex items-center gap-3">
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="px-3 py-1.5 border border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                <option value="">Change status to...</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <button
                onClick={handleBulkUpdate}
                disabled={!bulkStatus}
                className="px-4 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
              <button
                onClick={() => setSelectedOrders([])}
                className="px-4 py-1.5 bg-white border border-amber-200 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <OrderList
        orders={orders}
        loading={loading}
        filter={filter}
        onFilterChange={setFilter}
        search={search}
        onSearchChange={setSearch}
        selectedOrders={selectedOrders}
        onSelectOrder={(orderId, checked) => {
          if (checked) {
            setSelectedOrders([...selectedOrders, orderId]);
          } else {
            setSelectedOrders(selectedOrders.filter(id => id !== orderId));
          }
        }}
        onSelectAll={(checked) => {
          if (checked) {
            setSelectedOrders(orders.map(o => o.id));
          } else {
            setSelectedOrders([]);
          }
        }}
        onUpdateStatus={onStatusUpdate}
      />

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OrdersPage;