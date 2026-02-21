import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

type MenuItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
  hasBadge?: boolean;
  badgeCount?: number;
};

interface DashboardSidebarProps {
  ordersCount: number;
  favoritesCount: number;
  onBackToHome?: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  ordersCount,
  favoritesCount,
  onBackToHome,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      navigate("/"); // default ke home
    }
  };

  const menuItems: MenuItem[] = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z"
          />
        </svg>
      ),
    },
    {
      path: "/dashboard/menu",
      label: "Menu",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"
          />
        </svg>
      ),
    },
    {
      path: "/dashboard/checkout",
      label: "Checkout",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      hasBadge: true,
      badgeCount: ordersCount,
    },
    // {
    //   path: "/dashboard/favorites",
    //   label: "Favorites",
    //   icon: (
    //     <svg
    //       className="w-5 h-5"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth="2"
    //         d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    //       />
    //     </svg>
    //   ),
    //   hasBadge: true,
    //   badgeCount: favoritesCount,
    // },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="p-6">
        {/* Back to Home Button */}
        {onBackToHome && (
          <div className="mb-8 pb-6 border-b border-gray-100">
            <button
              onClick={handleBackToHome}
              className="flex items-center space-x-2 text-gray-700 hover:text-red-700 hover:bg-red-50 px-4 py-3 rounded-lg transition-all duration-300 w-full text-left group border border-gray-200 hover:border-red-200"
            >
              <svg
                className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="font-medium">Back to Home</span>
            </button>
          </div>
        )}

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 hover:text-red-700 transition-all duration-300 w-full text-left ${
                  isActive
                    ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                    : "text-gray-700 border-l-4 border-transparent"
                }`}
              >
                <div className={isActive ? "text-red-600" : "text-gray-500"}>
                  {item.icon}
                </div>

                <span className="font-medium">{item.label}</span>

                {item.hasBadge && item.badgeCount! > 0 && (
                  <span
                    className={`ml-auto text-xs font-medium px-2 py-1 rounded-full ${
                      isActive
                        ? "bg-red-600 text-white"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
