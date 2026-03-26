import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import { DashboardNavbar, DashboardSidebar } from "../components/layout";

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const { totalItems } = useCart();

  const stats = {
    totalOrders: 12, 
    favoriteDrinksCount: 8, 
    cartCount: totalItems,
    notificationCount: 2, 
  };

  const handleEditProfile = () => {
    navigate("/dashboard/profile");
  };

  const handleViewOrders = () => {
    navigate("/dashboard/orders");
  };

  const handleViewFavorites = () => {
    navigate("/dashboard/favorites");
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleNotificationClick = () => {
    console.log("Notification clicked");
  };

  const handleCartClick = () => {
    navigate("/dashboard/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <DashboardNavbar
        cartCount={stats.cartCount}
        notificationCount={stats.notificationCount}
        onNotificationClick={handleNotificationClick}
        onCartClick={handleCartClick}
        onEditProfile={handleEditProfile}
        onViewOrders={handleViewOrders}
        onViewFavorites={handleViewFavorites}
        onLogout={handleLogout}
      />

      {/* Main Layout with Sidebar */}
      <div className="flex">
        <DashboardSidebar
          onBackToHome={() => navigate("/")}
          ordersCount={stats.totalOrders}
          favoritesCount={stats.favoriteDrinksCount}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 bg-white min-h-screen overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;