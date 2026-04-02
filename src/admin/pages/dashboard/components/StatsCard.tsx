import React from 'react';
import { FaShoppingBag, FaWallet, FaCoffee, FaUsers } from 'react-icons/fa';
import StatsCard from '../../../components/common/StatsCard';
import { DashboardStats } from '../../../types/dashboard';
import { formatCurrency } from '../../../../utils/formatters';

interface StatsCardsProps {
  stats: DashboardStats | null;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Orders */}
      <StatsCard
        title="Total Orders"
        value={stats?.totalOrders || 0}
        subtitle="Today"
        subtitleValue={stats?.todayOrders || 0}
        icon={<FaShoppingBag />}
        iconBgColor="bg-red-50"
        iconColor="text-red-700"
        hoverColor="hover:border-red-200"
      />

      {/* Total Revenue */}
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(stats?.totalRevenue || 0)}
        subtitle="All time"
        subtitleValue=""
        icon={<FaWallet />}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-600"
        hoverColor="hover:border-emerald-200"
      />

      {/* Total Menu */}
      <StatsCard
        title="Total Menu"
        value={stats?.totalMenu || 0}
        subtitle="Items"
        subtitleValue=""
        icon={<FaCoffee />}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
        hoverColor="hover:border-blue-200"
      />

      {/* Total Users */}
      <StatsCard
        title="Total Users"
        value={stats?.totalUsers || 0}
        subtitle="Registered"
        subtitleValue=""
        icon={<FaUsers />}
        iconBgColor="bg-purple-50"
        iconColor="text-purple-600"
        hoverColor="hover:border-purple-200"
      />
    </div>
  );
};

export default StatsCards;