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
  return (
    <aside className="w-full">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="font-bold text-xl text-gray-900 mb-6 border-b pb-3">
          Categories
        </h2>

        {/* Drinks */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Drinks</h3>
          <ul className="space-y-1">
            {drinkCategories.map((cat) => (
              <li key={cat.label}>
                <NavLink to={`/category/${cat.id}`} className={linkClass}>
                  {cat.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Food */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Food</h3>
          <ul className="space-y-1">
            {foodCategories.map((cat) => (
              <li key={cat.label}>
                <NavLink to={`/category/${cat.label}`} className={linkClass}>
                  {cat.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default MenuSidebar;
