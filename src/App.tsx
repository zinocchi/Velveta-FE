// src/App.tsx

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import MainLayout from "./layouts/MainLayout";
import MenuLayout from "./layouts/MenuLayouts";
import DashboardLayout from "./layouts/DashboardLayout";

// // Admin Layouts & Components
// import AdminLayout from "./admin/layouts/AdminLayout"; // Perbaiki path (layouts plural)
// import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";

// // Admin Pages
// import AdminDashboardPage from "./admin/pages/dashboard/DashboardPage";
// import AdminMenuPage from "./admin/pages/menus/MenuPage"; // Perbaiki nama (capital M)
// import AdminOrdersPage from "./admin/pages/orders/OrdersPage"; // Perbaiki import
// import AdminOrderDetailPage from "./admin/pages/orders/OrderDetailPage"; // Tambah untuk detail

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
// import FavoritesPage from "./pages/dashboard/FavoritesPage"; // Perbaiki nama
// import ProfilePage from "./pages/dashboard/ProfilePage"; // Perbaiki nama
import OrdersPage from "./pages/checkout/CheckoutPage"; // Tambah halaman orders user
import CheckoutPage from "./pages/checkout/CheckoutPage"; // Pindah ke folder checkout

// Components
import ScrollToTop from "./components/ScrollToTop";
import UserProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
      <AuthProvider>
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
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:id" element={<OrdersPage />} /> {/* Order detail */}
              {/* <Route path="favorites" element={<FavoritesPage />} />
              <Route path="profile" element={<ProfilePage />} /> */}
              <Route path="checkout" element={<CheckoutPage />} />
            </Route>
          </Route>

          {/* ===== ADMIN PROTECTED ROUTES (DISABLED SEMENTARA) ===== */}
          {/* 
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="menus" element={<AdminMenuPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="orders/:id" element={<AdminOrderDetailPage />} />
            </Route>
          </Route>
          */}

          {/* ===== 404 - NOT FOUND ===== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
  );
}

export default App;