import React, { useState, useRef, useEffect } from "react";
import VelvetaLogo from "../../assets/icon/velveta.png";
import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router-dom";
import CartModal from "../modal/CartModal";
import { useCart } from "../../context/CartContext";
import OrderHistoryModal from "../modal/OrderHistoryModal";

interface DashboardNavbarProps {
  onEditProfile?: () => void;
  onViewOrders?: () => void;
  onViewFavorites?: () => void;
  onLogout?: () => void;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  onEditProfile,
  onViewOrders,
  onViewFavorites,
  onLogout,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);

  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { totalItems } = useCart();

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
    const handleScrollClose = () => {
      setDropdownOpen(false);
    };

    window.addEventListener("scroll", handleScrollClose, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScrollClose);
    };
  }, []);

  useEffect(() => {
    if (showLogoutConfirm || showOrderHistory || isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLogoutConfirm, showOrderHistory, isCartOpen]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
    setDropdownOpen(false);
  };

  const confirmLogout = () => {
    logout();
    localStorage.removeItem("token");
    setShowLogoutConfirm(false);
    navigate("/");
    window.location.reload();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleOrderHistoryClick = () => {
    setShowOrderHistory(true);
    setDropdownOpen(false);
  };

  const handleEditProfileClick = () => {
    onEditProfile?.();
    setDropdownOpen(false);
    navigate("/dashboard/profile");
  };

  const handleViewOrdersClick = () => {
    onViewOrders?.();
    setDropdownOpen(false);
    navigate("/dashboard/checkout");
  };

  const handleViewFavoritesClick = () => {
    onViewFavorites?.();
    setDropdownOpen(false);
    navigate("/dashboard/favorites");
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-white shadow-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              {/* Logo */}
              <img
                src={VelvetaLogo}
                alt="Velveta Logo"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover transition-transform duration-300 hover:rotate-12 cursor-pointer"
                onClick={() => navigate("/dashboard")}
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Order History Button */}
              <button
                onClick={handleOrderHistoryClick}
                className="relative p-2 text-gray-600 hover:text-red-700 transition-colors duration-300"
                title="Order History">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              {/* Cart Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCartOpen(true);
                }}
                className="relative p-2 text-gray-700 hover:text-red-700 transition-colors duration-300"
                aria-label="Cart">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  <img
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.fullname || "User",
                      )}&background=random&color=fff&bold=true`
                    }
                    className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300"
                    alt={user?.fullname || "User"}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {user?.fullname}
                      </p>
                      <p className="text-gray-500 text-xs truncate">
                        {user?.email}
                      </p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      {/* <button
                        onClick={handleEditProfileClick}
                        className="flex items-center w-full px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors duration-150">
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Edit Profile
                      </button> */}

                      <button
                        onClick={handleOrderHistoryClick}
                        className="flex items-center w-full px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors duration-150">
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Order History
                      </button>

                      <button
                        onClick={handleViewOrdersClick}
                        className="flex items-center w-full px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors duration-150">
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                        My Orders
                      </button>

                      {/* <button
                        onClick={handleViewFavoritesClick}
                        className="flex items-center w-full px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors duration-150">
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        Favorites
                      </button> */}
                    </div>

                    {/* Logout section */}
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150">
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
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
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <OrderHistoryModal
        isOpen={showOrderHistory}
        onClose={() => setShowOrderHistory(false)}
      />

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
            onClick={cancelLogout}
          />
          <div
            ref={confirmRef}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 bg-white rounded-xl shadow-2xl z-[70] p-6 animate-scaleIn">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.73-.833-2.464 0L4.196 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Logout Confirmation
              </h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to logout? You'll need to sign in again to
                access your account.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium">
                Yes, Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardNavbar;
