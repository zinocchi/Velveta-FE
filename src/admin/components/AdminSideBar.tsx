import { NavLink } from "react-router-dom";
import {
  FaChartLine,
  FaCoffee,
  FaShoppingBag,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../auth/useAuth";

const AdminSidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { path: "/admin/dashboard", icon: FaChartLine, label: "Dashboard" },
    { path: "/admin/menus", icon: FaCoffee, label: "Menus" },
    { path: "/admin/orders", icon: FaShoppingBag, label: "Orders" },
    { path: "/admin/reports", icon: FaFileAlt, label: "Reports" },
    { path: "/admin/settings", icon: FaCog, label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-700">VELVETA</h1>
        <p className="text-xs text-gray-500">Admin Panel</p>
      </div>

      <nav className="flex-1 px-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors ${
                isActive
                  ? "bg-red-50 text-red-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;