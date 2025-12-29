import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

// pages
import Home from "../pages/home/Home";
import About from "../pages/about/About";
import Reward from "../pages/reward/Reward";
import Dashboard from "../pages/dashboard/Dashboard";

// auth
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/reward" element={<Reward />} />
      </Route>

     <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
