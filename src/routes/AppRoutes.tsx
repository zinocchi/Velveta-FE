// routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Public pages
import Home from "../pages/home/Home";
import About from "../pages/about/About";
import Reward from "../pages/reward/Reward";
import Menu from "../pages/menu/Menu";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";

// Dashboard pages
import DashboardPage from "../pages/dashboard/DashboardPage"; // Updated import

// Uncomment these when you create the pages
// import OrdersPage from "../pages/dashboard/OrdersPage";
// import FavoritesPage from "../pages/dashboard/FavoritesPage";
// import ProfilePage from "../pages/dashboard/ProfilePage";
// import MenuDashboardPage from "../pages/dashboard/MenuDashboardPage";

// Auth
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/reward" element={<Reward />} />
        <Route path="/menu" element={<Menu />} />
      </Route>

      {/* Auth Routes without layout */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage /> {/* Use DashboardPage directly */}
          </ProtectedRoute>
        }
      >
        {/* You can add nested routes here if needed */}
        <Route path="orders" element={<div>Orders Page</div>} />
        <Route path="favorites" element={<div>Favorites Page</div>} />
        <Route path="menu" element={<div>Menu Dashboard</div>} />
        <Route path="profile" element={<div>Profile Page</div>} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;