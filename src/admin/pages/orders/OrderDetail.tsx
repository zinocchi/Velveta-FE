import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaReceipt, FaBox } from 'react-icons/fa';
import { useOrders } from '../../hooks/useOrders';
import OrderDetailCard from './components/OrderDetailCard';
import OrderItemsList from './components/OrderItemList';
import CustomerInfoCard from './components/CustomerInfoCard';
import DeliveryInfoCard from './components/DeliveryInfoCard';
import PaymentInfoCard from './components/PaymentInfoCard';
import StatusUpdateButtons from './components/StatusUpdateButton';
import OrderTimeline from './components/OrderTimeLine';
import ConfirmationModal from './components/ConfirmationModal';
import ReceiptModal from '../../components/ReceiptModal';
import { Order } from '../../types/order';
import { LoadingSpinner } from '../../../components/ui/Loading';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus } = useOrders();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showConfirm, setShowConfirm] = useState<{
    show: boolean;
    newStatus: string;
  }>({
    show: false,
    newStatus: '',
  });

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(parseInt(id!));
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusClick = (status: string) => {
    setShowConfirm({
      show: true,
      newStatus: status,
    });
  };

  const handleStatusConfirm = async () => {
    if (!order || !showConfirm.newStatus) return;

    setUpdating(true);
    const success = await updateOrderStatus(order.id, showConfirm.newStatus);
    
    if (success) {
      await fetchOrder();
    }
    
    setUpdating(false);
    setShowConfirm({ show: false, newStatus: '' });
  };

  const handleStatusCancel = () => {
    setShowConfirm({ show: false, newStatus: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading order details..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaBox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-6">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/admin/orders')}
            className="px-6 py-3 bg-red-700 text-white rounded-xl font-medium hover:bg-red-800 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/admin/orders')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-white shadow-sm group-hover:bg-gray-50 transition-colors">
              <FaArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium">Back to Orders</span>
          </button>

          <button
            onClick={() => setShowReceipt(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FaReceipt className="w-4 h-4 text-gray-500" />
            <span className="font-medium">View Receipt</span>
          </button>
        </div>

        {/* Order Detail Card */}
        <OrderDetailCard order={order} />

        {/* Status Update Buttons */}
        <StatusUpdateButtons
          order={order}
          onStatusClick={handleStatusClick}
          updating={updating}
        />

        {/* Order Timeline */}
        <OrderTimeline order={order} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <OrderItemsList order={order} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <CustomerInfoCard order={order} />
            <DeliveryInfoCard order={order} />
            <PaymentInfoCard order={order} />
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirm.show}
        type="single"
        newStatus={showConfirm.newStatus}
        currentStatus={order.status}
        orderNumber={order.order_number}
        onConfirm={handleStatusConfirm}
        onCancel={handleStatusCancel}
        updating={updating}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        order={order}
      />
    </div>
  );
};

export default OrderDetailPage;