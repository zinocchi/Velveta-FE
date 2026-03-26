import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import VelvetaLogo from "../../../assets/icon/velveta.jpeg";
import CartModal from "../../modal/CartModal";

import NavbarDesktop from "./NavbarDekstop";
import NavbarMobileBottom from "./NavbarMobile";
import NavbarMobileMenu from "./NavbarMobileMenu";
import LogoutConfirm from "./LogoutConfirm";

const Navbar: React.FC = () => {
  const { user, isLoggedIn, logout, isAdminPreview } = useAuthContext();
  const { totalItems } = useCart();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeOnScroll = () => {
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
    };
    window.addEventListener("scroll", closeOnScroll);
    return () => window.removeEventListener("scroll", closeOnScroll);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogoutConfirm = async () => {
    await logout();
    setShowLogoutConfirm(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  const isNotHomePage = location.pathname !== "/";

  return (
    <>
      {/* Main Header */}
      <header
        className={`fixed top-0 w-full bg-white z-50 transition-all duration-300 ${
          scrolled ? "shadow-md border-b border-gray-200" : ""
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-4 md:space-x-8">
              {/* Logo */}
              <div className="logo">
                <Link to="/">
                  <img
                    src={VelvetaLogo}
                    alt="Velveta Logo"
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover transition-transform duration-300 hover:rotate-12"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://via.placeholder.com/56/9B111E/FFFFFF?text=V";
                    }}
                  />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex space-x-6 xl:space-x-8">
                {isNotHomePage && (
                  <Link
                    to="/"
                    className="menu-item text-gray-900 hover:text-red-700 font-semibold uppercase text-sm tracking-wider transition-colors duration-300">
                    Home
                  </Link>
                )}
                <Link
                  to="/menu"
                  className="menu-item text-gray-900 hover:text-red-700 font-semibold uppercase text-sm tracking-wider transition-colors duration-300">
                  Menu
                </Link>
                <Link
                  to="/about"
                  className="menu-item text-gray-900 hover:text-red-700 font-semibold uppercase text-sm tracking-wider transition-colors duration-300">
                  About Us
                </Link>
                <Link
                  to="/reward"
                  className="menu-item text-gray-900 hover:text-red-700 font-semibold uppercase text-sm tracking-wider transition-colors duration-300">
                  Reward
                </Link>
              </nav>
            </div>

            {/* Desktop Right Side */}
            <div className="relative z-50">
              <NavbarDesktop
                user={user}
                isLoggedIn={isLoggedIn}
                isAdminPreview={isAdminPreview}
                totalItems={totalItems}
                onCartClick={() => setIsCartOpen(true)}
                onLogoutClick={handleLogoutClick}
                isUserMenuOpen={isUserMenuOpen}
                onUserMenuToggle={() => setIsUserMenuOpen(!isUserMenuOpen)}
                onUserMenuClose={() => setIsUserMenuOpen(false)}
              />
            </div>

            {/* Mobile Right Side */}
            <div className="flex lg:hidden items-center space-x-4">
              {/* Cart Icon - Mobile with cart-source wrapper */}
              {isLoggedIn && (
                <div className="cart-source relative">
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 text-gray-700 hover:text-red-700 transition-colors duration-300"
                    aria-label="Cart">
                    <svg
                      className="w-6 h-6 pointer-events-none"
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
                      <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center pointer-events-none">
                        {totalItems > 99 ? "99+" : totalItems}
                      </span>
                    )}
                  </button>
                </div>
              )}

              {/* User Profile Mobile */}
              {isLoggedIn ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center focus:outline-none"
                  aria-label="User menu">
                  <img
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.username || "User",
                      )}&background=random&color=fff&bold=true`
                    }
                    className="h-9 w-9 rounded-full object-cover border-2 border-white"
                    alt={user?.username || "User"}
                  />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-3 py-1.5 border border-gray-800 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors duration-300">
                  Sign in
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-red-700 focus:outline-none p-2"
                data-mobile-toggle="true"
                aria-label="Toggle menu">
                {isMobileMenuOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation (hidden when mobile menu is open) */}
        {!isMobileMenuOpen && (
          <div className="lg:hidden pointer-events-auto">
            <NavbarMobileBottom
              onCartClick={() => setIsCartOpen(true)}
              onMenuToggle={() => setIsMobileMenuOpen(true)}
              totalItems={totalItems}
              isLoggedIn={isLoggedIn}
              user={user}
            />
          </div>
        )}

        {/* Mobile Slide Menu */}
        <div className="lg:hidden">
          <NavbarMobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            user={user}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogoutClick}
          />
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 lg:hidden"></div>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Logout Confirmation Modal */}
      <LogoutConfirm
        isOpen={showLogoutConfirm}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  );
};

export default Navbar;