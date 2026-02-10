import { useState } from "react";
import { NavLink } from "react-router-dom";

const drinkCategories = [
  { id: "hot_coffee", label: "Hot Coffee" },
  { id: "cold_coffee", label: "Cold Coffee" },
  { id: "hot_tea", label: "Hot Tea" },
  { id: "cold_tea", label: "Cold Tea" },
  { id: "hot_chocolate", label: "Hot Chocolate & More" },
];

const foodCategories = [
  { id: "breakfast", label: "Breakfast" },
  { id: "bakery", label: "Bakery" },
  { id: "treats", label: "Treats" },
  { id: "lunch", label: "Lunch" },
  { id: "snack", label: "Snacks" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block py-2 px-3 rounded-lg transition-all duration-200 ${
    isActive
      ? "text-red-700 font-semibold bg-red-50 border-l-4 border-red-500"
      : "text-gray-600 hover:text-red-700 hover:bg-gray-50"
  }`;

const MenuSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-200"
        >
          <span className="font-semibold text-gray-900">Browse Categories</span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              isMobileMenuOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:block w-full">
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <h2 className="font-bold text-lg md:text-xl text-gray-900 mb-4 md:mb-6 border-b pb-3">
            Categories
          </h2>

          {/* Drinks */}
          <div className="mb-6 md:mb-8">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-3">
              Drinks
            </h3>
            <ul className="space-y-1">
              {drinkCategories.map((cat) => (
                <li key={cat.id}>
                  <NavLink to={`/category/${cat.id}`} className={linkClass}>
                    <span className="text-sm md:text-base">{cat.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Food */}
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-3">
              Food
            </h3>
            <ul className="space-y-1">
              {foodCategories.map((cat) => (
                <li key={cat.id}>
                  <NavLink to={`/category/${cat.id}`} className={linkClass}>
                    <span className="text-sm md:text-base">{cat.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white rounded-xl shadow-lg mb-6 animate-fadeIn">
          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 px-2">
                Drinks
              </h3>
              <ul className="space-y-1">
                {drinkCategories.map((cat) => (
                  <li key={cat.id}>
                    <NavLink
                      to={`/category/${cat.id}`}
                      className={linkClass}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {cat.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 px-2">
                Food
              </h3>
              <ul className="space-y-1">
                {foodCategories.map((cat) => (
                  <li key={cat.id}>
                    <NavLink
                      to={`/category/${cat.id}`}
                      className={linkClass}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {cat.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Horizontal Scroll Navigation */}
      <div className="lg:hidden mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {/* All Categories Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isMobileMenuOpen
                ? "bg-red-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Categories
          </button>

          {/* Quick Access Categories */}
          {drinkCategories.slice(0, 3).map((cat) => (
            <NavLink
              key={cat.id}
              to={`/category/${cat.id}`}
              className={({ isActive }) =>
                `flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-red-700 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              {cat.label.split(" ")[0]}
            </NavLink>
          ))}

          {foodCategories.slice(0, 2).map((cat) => (
            <NavLink
              key={cat.id}
              to={`/category/${cat.id}`}
              className={({ isActive }) =>
                `flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-red-700 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              {cat.label}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default MenuSidebar;