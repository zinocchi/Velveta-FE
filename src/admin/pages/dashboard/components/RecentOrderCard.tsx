import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaChevronRight } from 'react-icons/fa';
import StatusBadge from '../../../components/common/StatusBadge';
import { DashboardStats } from '../../../types/dashboard';
import { formatCurrency, formatDate } from '../../../../utils/formatters';

interface RecentOrdersCardProps {
  stats: DashboardStats | null;
}

const RecentOrdersCard: React.FC<RecentOrdersCardProps> = ({ stats }) => {
  const navigate = useNavigate();
  const orders = stats?.recentOrders || [];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
        <button
          onClick={() => navigate('/admin/orders')}
          className="text-red-700 hover:text-red-800 text-sm font-medium flex items-center gap-1"
        >
          View All
          <FaChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/admin/orders/${order.id}`)}
              className="p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-400">
                  #{order.order_number}
                </span>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {order.user?.name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.items?.length || 0} items • {formatDate(order.created_at)}
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {formatCurrency(order.total_price)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <FaShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No recent orders</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrdersCard;