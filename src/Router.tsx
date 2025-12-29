import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home";
import About from "../pages/about/About";
import Menu from "../pages/menu/Menu";
import Reward from "../pages/reward/Reward";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/menu", element: <Menu /> },
  { path: "/reward", element: <Reward /> },
]);
