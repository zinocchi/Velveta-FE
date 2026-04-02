// src/App.tsx
// ✅ HAPUS import BrowserRouter as Router
// ✅ HAPUS import { AuthProvider }
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import MenuLayout from "./layouts/MenuLayouts";
import DashboardLayout from "./layouts/DashboardLayout";

// Admin Layouts & Components
import AdminLayout from "./admin/layout/AdminLayout";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";

// Admin Pages
import AdminDashboardPage from "./admin/pages/dashboard/DashboardPage";
import AdminMenuPage from "./admin/pages/menus/MenuPage";
import AdminOrdersPage from "./admin/pages/orders/OrderPage";
import AdminOrderDetailPage from "./admin/pages/orders/OrderDetail";

// User Pages
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Reward from "./pages/reward/Reward";

// Menu Pages
import { MenuPage, CategoryPage } from "./pages/menu";

// Auth Pages
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import AuthCallback from "./pages/auth/AuthCallback";

// Dashboard Pages
import DashboardPage from "./pages/dashboard/DashboardPage";
import FavoritesPage from "./pages/dashboard/Favorites";
import ProfilePage from "./pages/dashboard/Profile";
import CheckoutPage from "./pages/checkout/CheckoutPage";

// Components
import ScrollToTop from "./components/ScrollToTop";
import UserProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    // ✅ HAPUS <Router> wrapper
    // ✅ HAPUS <AuthProvider> wrapper (sudah ada di main.tsx)
    <>
      <ScrollToTop />

      <Routes>
        {/* ===== PUBLIC ROUTES (No Layout) ===== */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* ===== USER LAYOUT (Public) ===== */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/reward" element={<Reward />} />
        </Route>

        {/* ===== MENU LAYOUT (Public) ===== */}
        <Route element={<MenuLayout />}>
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/menu" element={<MenuPage />} />
        </Route>

        {/* ===== USER PROTECTED ROUTES ===== */}
        <Route element={<UserProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="checkout" element={<CheckoutPage />} />
          </Route>
        </Route>

        {/* ===== ADMIN PROTECTED ROUTES ===== */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="menus" element={<AdminMenuPage />} />
            <Route path="menus/create" element={<AdminMenuPage />} />
            <Route path="menus/:id/edit" element={<AdminMenuPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          </Route>
        </Route>

        {/* ===== 404 - NOT FOUND ===== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
    // ✅ HAPUS </Router> dan </AuthProvider>
  );
}

export default App;