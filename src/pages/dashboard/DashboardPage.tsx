import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../components/dashboard/DashboardNavbar";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import DashboardContent from "../dashboard/Dashboard";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user] = useState({
    name: "John Doe",
    username: "johndoe",
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 12,
    pointsEarned: 350,
    favoriteDrinksCount: 8,
    cartCount: 3,
    notificationCount: 2,
  });

  // Handler functions
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Navigate to corresponding route
    navigate(`/dashboard/${tab}`);
  };

  const handleBackToHome = () => {
    // Navigate back to home page
    navigate("/");
  };

  const handleNotificationClick = () => {
    console.log("Notification clicked");
    // Implement notification logic
  };

  const handleCartClick = () => {
    console.log("Cart clicked");
    // Implement cart logic
  };

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
    navigate("/dashboard/profile");
  };

  const handleViewOrders = () => {
    setActiveTab("orders");
    navigate("/dashboard/orders");
  };

  const handleViewFavorites = () => {
    setActiveTab("favorites");
    navigate("/dashboard/favorites");
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    // Implement logout logic
    navigate("/login");
  };

  const recentOrders = [
    {
      id: "1",
      date: "2024-01-15",
      items: "Americano, Croissant",
      total: 85000,
      status: "completed" as const,
    },
    {
      id: "2",
      date: "2024-01-14",
      items: "Latte, Chocolate Cake",
      total: 95000,
      status: "completed" as const,
    },
    {
      id: "3",
      date: "2024-01-13",
      items: "Cappuccino x2",
      total: 70000,
      status: "pending" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar
        user={user}
        cartCount={dashboardStats.cartCount}
        notificationCount={dashboardStats.notificationCount}
        onNotificationClick={handleNotificationClick}
        onCartClick={handleCartClick}
        onEditProfile={handleEditProfile}
        onViewOrders={handleViewOrders}
        onViewFavorites={handleViewFavorites}
        onLogout={handleLogout}
        logoUrl="/velveta.png"
      />

      <div className="flex pt-16">
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          ordersCount={dashboardStats.totalOrders}
          favoritesCount={dashboardStats.favoriteDrinksCount}
          onBackToHome={handleBackToHome}
        />
        <DashboardContent
          userName={user.name}
          activeTab={activeTab}
          totalOrders={dashboardStats.totalOrders}
          pointsEarned={dashboardStats.pointsEarned}
          favoriteDrinksCount={dashboardStats.favoriteDrinksCount}
          recentOrders={recentOrders}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
