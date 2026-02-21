import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  FaShoppingBag,
  FaStar,
  FaHeart,
  FaCalendarAlt,
  FaClock,
  FaMotorcycle,
  FaStore,
  FaChevronRight,
  FaSpinner,
  FaExclamationTriangle,
  FaCoffee,
  FaWallet,
  FaFire,
} from "react-icons/fa";

interface OrderItem {
  id: number;
  menu_id: number;
  qty: number;
  price: number;
  menu: {
    name: string;
    image_url: string | null;
  };
}

interface Order {
  id: number;
  order_number: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  total_price: number;
  payment_method: string;
  delivery_type: "delivery" | "pickup";
  created_at: string;
  items: OrderItem[];
}

interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  favoriteDrink: string;
  favoriteCount: number;
  recentOrders: Order[];
}

const DashboardContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.split("/")[2] || "dashboard";
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalSpent: 0,
    favoriteDrink: "-",
    favoriteCount: 0,
    recentOrders: [],
  });

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/orders/my");
      const ordersData = response.data.data || response.data;

      // Calculate stats
      const completedOrders = ordersData.filter(
        (o: Order) => o.status === "COMPLETED",
      );
      const totalSpent = completedOrders.reduce(
        (sum: number, o: Order) => sum + o.total_price,
        0,
      );

      // Find favorite drink
      const drinkCount: Record<string, { count: number; name: string }> = {};
      ordersData.forEach((order: Order) => {
        order.items.forEach((item: OrderItem) => {
          const drinkName = item.menu?.name || "Unknown";
          if (!drinkCount[drinkName]) {
            drinkCount[drinkName] = { count: 0, name: drinkName };
          }
          drinkCount[drinkName].count += item.qty;
        });
      });

      let favoriteDrink = "-";
      let favoriteCount = 0;
      Object.values(drinkCount).forEach((drink) => {
        if (drink.count > favoriteCount) {
          favoriteCount = drink.count;
          favoriteDrink = drink.name;
        }
      });

      // Get recent orders (last 5)
      const recentOrders = [...ordersData]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .slice(0, 5);

      setStats({
        totalOrders: ordersData.length,
        totalSpent,
        favoriteDrink,
        favoriteCount,
        recentOrders,
      });
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "PROCESSING":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "COMPLETED":
        return <FaShoppingBag className="w-3 h-3" />;
      case "PENDING":
        return <FaClock className="w-3 h-3" />;
      case "PROCESSING":
        return <FaSpinner className="w-3 h-3 animate-spin" />;
      case "CANCELLED":
        return <FaExclamationTriangle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "Completed";
      case "PENDING":
        return "Pending";
      case "PROCESSING":
        return "Processing";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays === 2) return "2 days ago";
    if (diffDays === 3) return "3 days ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleViewOrder = (orderId: number) => {
    navigate(`/dashboard/orders/${orderId}`);
  };

  if (loading) {
    return (
      <main className="pt-28 pb-16 max-w-7xl mx-auto px-4">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Failed to Load Dashboard
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const renderDashboardContent = () => (
    <div className="dashboard-content active">
      {/* Welcome Section - Simple */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Welcome back,{" "}
          <span className="text-red-700">
            {user?.fullname?.split(" ")[0] || "Coffee Lover"}
          </span>
        </h1>
        <p className="text-gray-500">Here's your activity overview</p>
      </div>

      {/* Stats Cards - Clean Design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Orders Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-red-200 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Total Orders
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {stats.totalOrders}
              </p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-gray-500">Total spent:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(stats.totalSpent)}
                </span>
              </div>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <FaShoppingBag className="w-6 h-6 text-red-700" />
            </div>
          </div>
        </div>

        {/* Points Earned Card - Coming Soon */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-amber-200 transition-all duration-300 shadow-sm hover:shadow-md opacity-75">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Points Earned
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-2">0</p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-gray-400">Coming soon</span>
              </div>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <FaStar className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Favorite Drink Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Favorite Drink
              </p>
              <p
                className="text-2xl font-bold text-gray-900 mb-2 truncate max-w-[180px]"
                title={stats.favoriteDrink}
              >
                {stats.favoriteDrink}
              </p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-gray-500">Ordered:</span>
                <span className="font-semibold text-gray-900">
                  {stats.favoriteCount} times
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <FaHeart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {stats.recentOrders.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {stats.recentOrders.map((order, index) => (
                <div
                  key={order.id}
                  onClick={() => handleViewOrder(order.id)}
                  className="p-5 hover:bg-gray-50/80 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Section - Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-gray-400">
                          #{order.order_number}
                        </span>
                        <span className="text-gray-300">•</span>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <FaCalendarAlt className="w-3 h-3" />
                          {formatDate(order.created_at)}
                        </p>
                        <span className="text-gray-300">•</span>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          {order.delivery_type === "delivery" ? (
                            <>
                              <FaMotorcycle className="w-3 h-3" />
                              Delivery
                            </>
                          ) : (
                            <>
                              <FaStore className="w-3 h-3" />
                              Pickup
                            </>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded-md"
                          >
                            {item.menu?.name}
                            {item.qty > 1 && (
                              <span className="text-gray-500 ml-1">
                                (x{item.qty})
                              </span>
                            )}
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Section - Status & Total */}
                    <div className="flex items-center gap-4 md:flex-col md:items-end">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </span>
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(order.total_price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCoffee className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 text-lg font-medium mb-2">
                No orders yet
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Ready to order your first coffee?
              </p>
              <button
                onClick={() => navigate("/menu")}
                className="px-6 py-3 bg-red-700 text-white rounded-xl font-medium hover:bg-red-800 transition-colors inline-flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <FaShoppingBag className="w-4 h-4" />
                Order Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action - Single Button */}
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

  const renderMenuContent = () => (
    <div className="text-center p-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Menu</h3>
      <p className="text-gray-600">Menu content coming soon...</p>
    </div>
  );

  const renderOrdersContent = () => (
    <div className="text-center p-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Orders</h3>
      <p className="text-gray-600">Orders content coming soon...</p>
    </div>
  );

  const renderFavoritesContent = () => (
    <div className="text-center p-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Favorites</h3>
      <p className="text-gray-600">Favorites content coming soon...</p>
    </div>
  );

  return (
    <main className="flex-1 p-8 bg-white min-h-screen">
      {activeTab === "dashboard" && renderDashboardContent()}
      {activeTab === "menu" && renderMenuContent()}
      {activeTab === "orders" && renderOrdersContent()}
      {activeTab === "favorites" && renderFavoritesContent()}
    </main>
  );
};

export default DashboardContent;
