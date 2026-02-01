import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import MenuLayout from "../layouts/MenuLayouts";

// pages
import Home from "../pages/home/Home";
import About from "../pages/about/About";
import Reward from "../pages/reward/Reward";
// import Dashboard from "../pages/dashboard/Dashboard";
import Menu from "../pages/menu/Menu";
import CategoryPage from "../pages/menu/CategoryPage";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import AuthCallback from "../pages/auth/AuthCallback";

// auth
import ProtectedRoute from "../components/ProtectedRoute";
import ScrollToTop from "../components/ScrollToTop";
import DashboardLayout from "../layouts/DashboardLayout";
// import Dashboard from "../pages/dashboard/Dashboard";

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

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>

          }
        />

        {/* Auth */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
