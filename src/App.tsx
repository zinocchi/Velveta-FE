import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import MainLayout from "./layouts/MainLayout";
import MenuLayout from "./layouts/MenuLayouts";
import DashboardLayout from "./layouts/DashboardLayout";

// Admin Layouts & Components
import AdminLayout from "./admin/layout/AdminLayout";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";

// Admin Pages
import AdminDashboardPage from "./admin/pages/dashboard/DashboardPage";
import adminMenuPage from "./admin/pages/menus/MenuPage";
import OrdersPage from "./admin/pages/orders/OrderPage";
// import ReportsPage from "../admin/pages/reports/ReportPage";

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
import Favorites from "./pages/dashboard/Favorites";
import Profile from "./pages/dashboard/Profile";
import CheckoutPages from "./pages/dashboard/CheckoutPages";

// Components
import ScrollToTop from "./components/ScrollToTop";
import UserProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
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
              <Route path="orders/:id" element={<OrdersPage />} />{" "}
              {/* Order detail */}
              {/* <Route path="favorites" element={<FavoritesPage />} />
              <Route path="profile" element={<ProfilePage />} /> */}
              <Route path="checkout" element={<CheckoutPages />} />
            </Route>
          </Route>

          {/* ===== ADMIN PROTECTED ROUTES ===== */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              {/* Default redirect to dashboard */}
              <Route index element={<Navigate to="dashboard" replace />} />

              {/* Admin Pages */}
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="menus" element={<MenuPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:id" element={<OrdersPage />} />
              {/* <Route path="reports" element={<ReportsPage />} /> */}
            </Route>
          </Route>

          {/* ===== 404 - NOT FOUND ===== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
