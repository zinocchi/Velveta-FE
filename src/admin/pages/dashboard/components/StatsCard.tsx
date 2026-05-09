import React from 'react';
import { FaShoppingBag, FaWallet } from 'react-icons/fa';
import StatsCard from '../../../components/common/StatsCard';
import { DashboardStats } from '../../../types/dashboard';
import { formatCurrency } from '../../../../utils/formatters';

interface StatsCardsProps {
  stats: DashboardStats | null;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Total Revenue */}
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(stats?.totalRevenue || 0)}
        icon={<FaWallet />}
        iconBgColor="bg-red-50"
        iconColor="text-red-500"
        hoverColor="hover:border-red-200"
        trend={7}
        trendLabel="From last month"
      />

      {/* Total Orders */}
      <StatsCard
        title="Total Orders"
        value={stats?.totalOrders?.toLocaleString() || '0'}
        icon={<FaShoppingBag />}
        iconBgColor="bg-red-50"
        iconColor="text-red-500"
        hoverColor="hover:border-red-200"
        trend={7}
        trendLabel="From last month"
      />
    </div>
  );
};

export default StatsCards;