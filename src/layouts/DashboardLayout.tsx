import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname.split("/").pop();
    switch (path) {
      case "dashboard":
      case "":
        return "dashboard";
      case "menu":
        return "menu";
      case "orders":
        return "orders";
      case "favorites":
        return "favorites";
      default:
        return "dashboard";
    }
  };

  

  const activeTab = getActiveTab();

  const stats = {
    cartCount: 3,
    notificationCount: 2,
    totalOrders: 12,
    favoriteDrinksCount: 8,
  };

  // Event handlers
  const handleTabChange = (tabId: string) => {
    navigate(`/dashboard/${tabId}`);
  };

  const handleViewOrders = () => {
    navigate("/dashboard/orders");
  };

  const handleViewFavorites = () => {
    navigate("/dashboard/favorites");
  };

  const handleEditProfile = () => {
    navigate("/dashboard/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar
        cartCount={stats.cartCount}
        notificationCount={stats.notificationCount}
        onNotificationClick={() => console.log("Notification clicked")}
        onCartClick={() => console.log("Cart clicked")}
        onEditProfile={handleEditProfile}
        onViewOrders={handleViewOrders}
        onViewFavorites={handleViewFavorites}
        onLogout={handleLogout}
        logoUrl="/velveta.png"
      />

      <div className="flex pt-16">
        <DashboardSidebar
          onBackToHome={() => navigate("/")}
          ordersCount={stats.totalOrders}
          favoritesCount={stats.favoriteDrinksCount}
        />

        <main className="flex-1 p-6 md:p-8">
          <Outlet /> {/* This renders the dashboard page content */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
