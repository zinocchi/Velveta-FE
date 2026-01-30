import React, { useState, useRef, useEffect } from "react";
import VelvetaLogo from "../../assets/icon/velveta.png";
import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  username: string;
  photo?: string;
  email?: string;
  fullname?: string;
  avatar?: string;
}

interface DashboardNavbarProps {
  user: User;
  cartCount?: number;
  notificationCount?: number;
  onNotificationClick?: () => void;
  onCartClick?: () => void;
  onEditProfile?: () => void;
  onViewOrders?: () => void;
  onViewFavorites?: () => void;
  onLogout?: () => void;
  logoUrl?: string;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  user,
  cartCount = 0,
  notificationCount = 0,
  onNotificationClick,
  onCartClick,
  onEditProfile,
  onViewOrders,
  onViewFavorites,
  onLogout,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (showLogoutConfirm) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [showLogoutConfirm]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
    setOpenMenu(false);
    setIsMobileMenuOpen(false);
  };

  const confirmLogout = () => {
    if (logout) {
      logout();
    }
    
    if (onLogout) {
      onLogout();
    }

    document.body.classList.remove("modal-open");

    localStorage.removeItem("token");
    setShowLogoutConfirm(false);
    navigate("/");
    window.location.reload();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
    document.body.classList.remove("modal-open");
  };

  const getInitial = () => {
    return user?.username?.charAt(0).toUpperCase() || 
           user?.name?.charAt(0).toUpperCase() || 
           "U";
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-white shadow-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              {/* Empty space for alignment - can be used for logo or other elements */}
            </div>

            <div className="absolute left-20 top-1/2 transform -translate-y-1/2">
              <img
                src={VelvetaLogo}
                alt="Velveta Logo"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover transition-transform duration-300 hover:rotate-12"
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Notification Button */}
              <button
                onClick={onNotificationClick}
                className="relative p-2 text-gray-600 hover:text-red-700 transition-colors duration-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={onCartClick}
                className="relative p-2 text-gray-600 hover:text-red-700 transition-colors duration-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 10H3m4 3a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  <img
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.fullname || user?.name || "User"
                      )}&background=random&color=fff&bold=true`
                    }
                    className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    alt={user?.fullname || user?.name || "User"}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 transition-all duration-200 animate-fadeIn">
                    {/* User info section */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {user?.fullname || user?.name || "User"}
                      </p>
                      <p className="text-gray-500 text-xs truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          onEditProfile?.();
                          setDropdownOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors duration-150"
                      >
                        <i className="fas fa-user-edit w-5 mr-3 "></i>
                        Edit Profile
                      </button>

                      <button
                        onClick={() => {
                          onViewOrders?.();
                          setDropdownOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors duration-150"
                      >
                        <i className="fas fa-history w-5 mr-3"></i>
                        Order History
                      </button>

                      <button
                        onClick={() => {
                          onViewFavorites?.();
                          setDropdownOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors duration-150"
                      >
                        <i className="fas fa-heart w-5 mr-3"></i>
                        Favorites
                      </button>
                    </div>

                    {/* Logout section */}
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                      >
                        <i className="fas fa-sign-out-alt w-5 mr-3"></i>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={cancelLogout}
                className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-2.5 px-4 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardNavbar;