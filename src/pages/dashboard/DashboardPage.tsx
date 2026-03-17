// src/pages/dashboard/DashboardPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useDashboard } from "../../hooks/useDashboard";

// Components
import { LoadingPage } from "../../components/ui/loading";
import { Alert } from "../../components/ui/Alert";
import WelcomeHeader from "../../components/dashboard/WelcomeHeader";
import StatsOverview from "../../components/dashboard/StatsOverview";
import RecentOrders from "../../components/dashboard/RecentOrder";

// Icons
import { FaFire, FaChevronRight } from "react-icons/fa";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { stats, loading, error, refetch } = useDashboard();

  if (loading) {
    return <LoadingPage message="Loading dashboard..." fullScreen />;
  }

  if (error) {
    return (
      <main className="flex-1 p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <Alert
            type="error"
            title="Failed to Load Dashboard"
            message={error}
            className="mb-4"
          />
          <button
            onClick={refetch}
            className="px-6 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="dashboard-content active">
      {/* Welcome Header */}
      <WelcomeHeader user={user} />

      {/* Stats Overview */}
      <StatsOverview
        totalOrders={stats.totalOrders}
        totalSpent={stats.totalSpent}
        favoriteDrink={stats.favoriteDrink}
        favoriteCount={stats.favoriteCount}
        points={stats.points}
      />

      {/* Recent Orders Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
          {stats.totalOrders > 0 && (
            <button
              onClick={() => navigate("/dashboard/orders")}
              className="text-red-700 hover:text-red-800 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              View All
              <FaChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <RecentOrders
          orders={stats.recentOrders}
          onOrderClick={(orderId) => navigate(`/dashboard/orders/${orderId}`)}
        />
      </div>

      {/* Quick Action - Show only if no orders */}
      {stats.totalOrders === 0 && (
        <div className="grid grid-cols-1">
          <button
            onClick={() => navigate("/menu")}
            className="p-4 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-xl hover:from-red-800 hover:to-red-900 transition-all duration-300 flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <FaFire className="w-5 h-5" />
              <span className="font-medium">Start Your Coffee Journey</span>
            </div>
            <FaChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;