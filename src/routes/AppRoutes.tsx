import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import MenuLayout from "../layouts/MenuLayouts";
import DashboardLayout from "../layouts/DashboardLayout";

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
        {/* Layout */}
        <Route element={<MainLayout />}>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/reward" element={<Reward />} />
        </Route>

        <Route element={<MenuLayout />}>
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/menu" element={<Menu />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="menu" element={<Menu />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="profile" element={<Profile />} />
            <Route path="checkout" element={<CheckoutPages />} />
          </Route>

          {/* Hapus route /order/:orderId */}
        </Route>

        {/* Auth */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
