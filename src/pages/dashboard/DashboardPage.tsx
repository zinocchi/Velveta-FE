import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useDashboard } from "../../hooks/useDashboard";

import { Alert } from "../../components/ui/Alert";
import WelcomeHeader from "../../components/dashboard/WelcomeHeader";
import StatsOverview from "../../components/dashboard/StatsOverview";
import RecentOrders from "../../components/dashboard/RecentOrder";
import { Skeleton } from "../../components/ui/loading/Skeleton";

import { FaFire, FaChevronRight } from "react-icons/fa";

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="dashboard-content active">
      {/* Welcome Header Skeleton */}
      <div className="mb-8">
        <Skeleton variant="text" width="w-64" height="h-8" className="mb-2" />
        <Skeleton variant="text" width="w-96" height="h-4" />
      </div>

      {/* Stats Overview Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6">
            <Skeleton variant="text" width="w-24" height="h-4" className="mb-3" />
            <Skeleton variant="text" width="w-32" height="h-8" />
          </div>
        ))}
      </div>

      {/* Recent Orders Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton variant="text" width="w-40" height="h-7" />
          <Skeleton variant="text" width="w-20" height="h-4" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4">
              <Skeleton variant="text" width="w-48" height="h-5" className="mb-2" />
              <Skeleton variant="text" width="w-32" height="h-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { stats, loading, error, refetch } = useDashboard();

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

  if (loading) {
    return (
      <main className="flex-1 p-8">
        <DashboardSkeleton />
      </main>
    );
  }

  return (
    <main className="flex-1 p-8">
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
    </main>
  );
};

export default DashboardPage;