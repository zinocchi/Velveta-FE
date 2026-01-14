import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

// pages
import Home from "../pages/home/Home";
import About from "../pages/about/About";
import Reward from "../pages/reward/Reward";
import Dashboard from "../pages/dashboard/Dashboard";
import Menu from "../pages/menu/Menu";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import GoogleSuccess from "../pages/Auth/Login";
import AuthCallback from "../pages/Auth/AuthCallback";

// auth
import ProtectedRoute from "../components/ProtectedRoute";
import ScrollToTop from "../components/ScrollToTop"; // <-- ⬅️ TAMBAH INI

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop /> {/* <-- ⬅️ TAMBAH INI */}
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/reward" element={<Reward />} />
          <Route path="/menu" element={<Menu />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        import AuthCallback from "../pages/Auth/AuthCallback";
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
