import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import MenuLayout from "../layouts/MenuLayouts";
import DashboardLayout from "../layouts/DashboardLayout";

//admin

import AdminLayout from "../admin/layout/AdminLayout";
import AdminLogin from "../admin/pages/auth/Login";
import AdminRegister from "../admin/pages/auth/Register";
import AdminDashboardPage from "../admin/pages/dashboard/DashboardPage";
import MenuPage from "../admin/pages/menus/MenuPage";
import OrdersPage from "../admin/pages/orders/OrderPage";
// import ReportsPage from "../admin/pages/reports/ReportPage";
import AdminProtectedRoute from "../admin/components/ProtectedRoute";

// pages
import Home from "../pages/home/Home";
import About from "../pages/about/About";
import Reward from "../pages/reward/Reward";

// component
import ScrollToTop from "../components/ScrollToTop";
import ProtectedRoute from "../components/ProtectedRoute";

// menu
import Menu from "../pages/menu/Menu";
import CategoryPage from "../pages/menu/CategoryPage";

// auth
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import AuthCallback from "../pages/auth/AuthCallback";

// dashboard
import DashboardPage from "../pages/dashboard/Dashboard";
import Favorites from "../pages/dashboard/Favorites";
import Profile from "../pages/dashboard/Profile";
import CheckoutPages from "../pages/dashboard/CheckoutPages";

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* ===== USER LAYOUT ===== */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/reward" element={<Reward />} />
        </Route>

        <Route element={<MenuLayout />}>
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/menu" element={<Menu />} />
        </Route>

        {/* ===== USER PROTECTED ===== */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="menu" element={<Menu />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="profile" element={<Profile />} />
            <Route path="checkout" element={<CheckoutPages />} />
          </Route>
        </Route>

        {/* ===== AUTH ===== */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* ===== ADMIN ===== */}

        {/* Admin Auth - No Layout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Admin Protected Routes with Layout */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* Default redirect to dashboard */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            
            {/* Admin Pages */}
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="menus" element={<MenuPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrdersPage />} />
            {/* <Route path="reports" element={<ReportsPage />} /> */}
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;