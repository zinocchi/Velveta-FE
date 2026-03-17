import React from "react";
import { Link } from "react-router-dom";
import { DashboardUserMenuProps } from "./types";

const DashboardUserMenu: React.FC<DashboardUserMenuProps> = ({
  user,
  isOpen,
  onClose,
  onLogout,
  onOrderHistory,
  onViewOrders,
  onEditProfile,
  onViewFavorites,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 animate-fadeIn">
      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="font-medium text-gray-900 text-sm truncate">
          {user?.fullname || user?.username}
        </p>
        <p className="text-gray-500 text-xs truncate">{user?.email}</p>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        {/* Order History */}
        <button
          onClick={() => {
            onOrderHistory();
            onClose();
          }}
          className="flex items-center w-full px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors duration-150"
        >
          <svg
            className="w-4 h-4 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Order History
        </button>

        {/* My Orders */}
        <button
          onClick={() => {
            onViewOrders();
            onClose();
          }}
          className="flex items-center w-full px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors duration-150"
        >
          <svg
            className="w-4 h-4 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          My Orders
        </button>

        {/* Edit Profile (optional) */}
        {onEditProfile && (
          <button
            onClick={() => {
              onEditProfile();
              onClose();
            }}
            className="flex items-center w-full px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors duration-150"
          >
            <svg
              className="w-4 h-4 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Edit Profile
          </button>
        )}

        {/* Favorites (optional) */}
        {onViewFavorites && (
          <button
            onClick={() => {
              onViewFavorites();
              onClose();
            }}
            className="flex items-center w-full px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors duration-150"
          >
            <svg
              className="w-4 h-4 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            Favorites
          </button>
        )}
      </div>

      {/* Logout Section */}
      <div className="border-t border-gray-100 pt-1">
        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
        >
          <svg
            className="w-4 h-4 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardUserMenu;