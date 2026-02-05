import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/useAuth';
import { useLocation } from 'react-router-dom';

interface RecentOrder {
  id: string;
  date: string;
  items: string;
  total: number;
  status: 'completed' | 'pending' | 'processing';
}

const DashboardContent: React.FC = () => {
  const location = useLocation();
  const activeTab = location.pathname.split("/")[2] || "dashboard";

  const totalOrders = 12;
  const pointsEarned = 350;
  const favoriteDrinksCount = 8;
  const recentOrders: RecentOrder[] = [];

  const [orders, setOrders] = useState<RecentOrder[]>([
    { id: '1', date: '2026-01-28', items: 'Americano, Croissant', total: 85000, status: 'completed' },
    { id: '2', date: '2026-01-14', items: 'Latte, Chocolate Cake', total: 95000, status: 'completed' },
    { id: '3', date: '2026-01-13', items: 'Cappuccino x2', total: 70000, status: 'pending' },
    { id: '4', date: '2026-01-12', items: 'Espresso, Bagel', total: 65000, status: 'completed' },
  ]);

  const { user } = useAuth();



  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: RecentOrder['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: RecentOrder['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderDashboardContent = () => (
    <div className="dashboard-content active">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-montserrat">
          Welcome, <span id="welcomeName" className="text-red-600">{user?.fullname || "User"}</span>!
        </h2>
        <p className="text-gray-600">Ready to explore our premium coffee selection?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Orders Card */}
        <div className="dashboard-card bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p id="totalOrdersCount" className="text-2xl font-bold text-gray-900">
                {/* {stats.totalOrders} */}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Points Earned Card */}
        <div className="dashboard-card bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Points Earned</p>
              <p id="pointsEarned" className="text-2xl font-bold text-gray-900">
                {/* {stats.pointsEarned} */}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Favorite Drinks Card */}
        <div className="dashboard-card bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Favorite Drinks</p>
              <p id="favoriteDrinksCount" className="text-2xl font-bold text-gray-900">
                {/* {stats.favoriteDrinksCount} */}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 font-montserrat">Recent Orders</h3>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {orders.length > 0 ? (
            <div id="recentOrders" className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-4 md:mb-0">
                      <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                      <h4 className="text-lg font-medium text-gray-900 mt-1">{order.items}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Total: <span className="font-semibold">{formatCurrency(order.total)}</span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 text-lg">No recent orders found</p>
              <p className="text-gray-400 text-sm mt-2">Your order history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMenuContent = () => (
    <div id="menu" className="tab-content">
      <div className="text-center p-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">Menu</h3>
        <p className="text-gray-600">Menu content coming soon...</p>
      </div>
    </div>
  );

  const renderOrdersContent = () => (
    <div id="orders" className="tab-content">
      <div className="text-center p-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">Orders</h3>
        <p className="text-gray-600">Orders content coming soon...</p>
      </div>
    </div>
  );

  const renderFavoritesContent = () => (
    <div id="favorites" className="tab-content">
      <div className="text-center p-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">Favorites</h3>
        <p className="text-gray-600">Favorites content coming soon...</p>
      </div>
    </div>
  );

  return (
    <main className="flex-1 p-8">
      {activeTab === 'dashboard' && renderDashboardContent()}
      {activeTab === 'menu' && renderMenuContent()}
      {activeTab === 'orders' && renderOrdersContent()}
      {activeTab === 'favorites' && renderFavoritesContent()}
    </main>
  );
};

export default DashboardContent;