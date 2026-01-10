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

// Menu detail pages
// import HotCoffee from "../pages/menu/drinks/HotCoffee";
// import ColdCoffee from "../pages/menu/drinks/ColdCoffee";
// import HotTea from "../pages/menu/drinks/Hot-Tea";
// import ColdTea from "../pages/menu/drinks/Cold-Tea";
// import HotChocolate from "../pages/menu/drinks/Hot-Chocolate";
// import Breakfast from "../pages/menu/food/Breakfast";
// import Bakery from "../pages/menu/food/Bakery";
// import Treats from "../pages/menu/food/Treats";
// import Lunch from "../pages/menu/food/Lunch";
// import Snacks from "../pages/menu/food/Snacks";

// auth
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/reward" element={<Reward />} />
          <Route path="/menu" element={<Menu />} />

          {/* Menu Detail Routes */}
          {/* <Route path="/menu/drinks/hot-coffee" element={<HotCoffee />} />
          <Route path="/menu/drinks/cold-coffee" element={<ColdCoffee />} />
          <Route path="/menu/drinks/hot-tea" element={<HotTea />} />
          <Route path="/menu/drinks/cold-tea" element={<ColdTea />} />
          <Route path="/menu/drinks/hot-chocolate" element={<HotChocolate />} />
          <Route path="/menu/food/breakfast" element={<Breakfast />} />
          <Route path="/menu/food/bakery" element={<Bakery />} />
          <Route path="/menu/food/treats" element={<Treats />} />
          <Route path="/menu/food/lunch" element={<Lunch />} />
          <Route path="/menu/food/snack" element={<Snacks />} /> */}

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
      </Routes>

      {/* <Route path="/login" element={<Login />}>
    </Route> */}
    </>
  );
};

export default AppRoutes;
