import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VelvetaLogo from "../../../assets/icon/velveta.png";

// Hooks & Context
import { useAuthContext } from "../../../../context/AuthContext";
import { useCart } from "../../../../context/CartContext";

// Components - Reusable dari Navbar
import CartIcon from "../../navbar/CartIcon";
import LogoutConfirm from "../../navbar/LogoutConfirm";

// Components - Dashboard Specific
import DashboardUserMenu from "./DashboardUserMenu";

// Modals
import CartModal from "../../../modal/CartModal";
import OrderHistoryModal from "../../../modal/OrderHistoryModal";
import { DashboardNavbarProps } from "./types";

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  onEditProfile,
  onViewOrders,
  onViewFavorites,
  onLogout: externalLogout,
  className = "",
}) => {
  const { user, logout } = useAuthContext();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setDropdownOpen(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const isModalOpen = showLogoutConfirm || showOrderHistory || isCartOpen;
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLogoutConfirm, showOrderHistory, isCartOpen]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setDropdownOpen(false);
  };

  const handleLogoutConfirm = async () => {
    await logout();
    setShowLogoutConfirm(false);
    navigate("/");
    
    if (externalLogout) {
      externalLogout();
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  const handleOrderHistoryClick = () => {
    setShowOrderHistory(true);
    setDropdownOpen(false);
  };

  const handleEditProfileClick = () => {
    if (onEditProfile) {
      onEditProfile();
    } else {
      navigate("/dashboard/profile");
    }
    setDropdownOpen(false);
  };

  const handleViewOrdersClick = () => {
    if (onViewOrders) {
      onViewOrders();
    } else {
      navigate("/dashboard/checkout");
    }
    setDropdownOpen(false);
  };

  const handleViewFavoritesClick = () => {
    if (onViewFavorites) {
      onViewFavorites();
    } else {
      navigate("/dashboard/favorites");
    }
    setDropdownOpen(false);
  };

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full bg-white shadow-md z-50 border-b border-gray-200 ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-6">
              <img
                src={VelvetaLogo}
                alt="Velveta Logo"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover transition-transform duration-300 hover:rotate-12 cursor-pointer"
                onClick={handleLogoClick}
              />
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Order History Button */}
              <button
                onClick={handleOrderHistoryClick}
                className="relative p-2 text-gray-600 hover:text-red-700 transition-colors duration-300"
                title="Order History"
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              {/* Cart Button - Menggunakan CartIcon component */}
              <CartIcon
                totalItems={totalItems}
                onClick={() => setIsCartOpen(true)}
              />

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  ref={buttonRef}
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  <img
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.fullname || user?.username || "User"
                      )}&background=random&color=fff&bold=true`
                    }
                    className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300"
                    alt={user?.fullname || user?.username || "User"}
                  />
                </button>

                {/* Dashboard User Menu */}
                <div ref={dropdownRef}>
                  <DashboardUserMenu
                    user={user}
                    isOpen={dropdownOpen}
                    onClose={() => setDropdownOpen(false)}
                    onLogout={handleLogoutClick}
                    onOrderHistory={handleOrderHistoryClick}
                    onViewOrders={handleViewOrdersClick}
                    onEditProfile={handleEditProfileClick}
                    onViewFavorites={handleViewFavoritesClick}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer untuk fixed header */}
      <div className="h-16" />

      {/* Modals */}
      <OrderHistoryModal
        isOpen={showOrderHistory}
        onClose={() => setShowOrderHistory(false)}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Logout Confirmation Modal - Menggunakan component yang sudah ada */}
      <LogoutConfirm
        isOpen={showLogoutConfirm}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  );
};

export default DashboardNavbar;