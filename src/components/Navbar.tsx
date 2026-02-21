import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import VelvetaLogo from "../assets/icon/velveta.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import CartModal from "../components/modal/CartModal";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const confirmRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (showLogoutConfirm) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [showLogoutConfirm]);

  // Close mobile menu on scroll
  useEffect(() => {
    const closeOnScroll = () => {
      setOpenMenu(false);
      setIsMobileMenuOpen(false);
    };
    window.addEventListener("scroll", closeOnScroll);
    return () => window.removeEventListener("scroll", closeOnScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close user menu
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(false);
      }

      // Close mobile menu
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest("[data-mobile-toggle]")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
    setOpenMenu(false);
    setIsMobileMenuOpen(false);
  };

  const confirmLogout = () => {
    logout();
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

  const isNotHomePage = location.pathname !== "/";

  return (
    <>
      {/* Main Navbar */}
      <header
        className={`fixed top-0 w-full bg-white z-50 transition-all duration-300 ${
          scrolled ? "shadow-md border-b border-gray-200" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-4 md:space-x-8">
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

              {/* Desktop Navigation - Hidden on mobile */}
              <nav className="hidden lg:flex space-x-6 xl:space-x-8">
                {isNotHomePage && (
                  <Link
                    to="/"
                    className="menu-item text-gray-900 hover:text-red-700 font-semibold uppercase text-sm tracking-wider transition-colors duration-300"
                  >
                    Home
                  </Link>
                )}
                <Link
                  to="/menu"
                  className="menu-item text-gray-900 hover:text-red-700 font-semibold uppercase text-sm tracking-wider transition-colors duration-300"
                >
                  Menu
                </Link>
                <Link
                  to="/about"
                  className="menu-item text-gray-900 hover:text-red-700 font-semibold uppercase text-sm tracking-wider transition-colors duration-300"
                >
                  About Us
                </Link>
                <Link
                  to="/reward"
                  className="menu-item text-gray-900 hover:text-red-700 font-semibold uppercase text-sm tracking-wider transition-colors duration-300"
                >
                  Reward
                </Link>
              </nav>
            </div>

            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-red-700 transition-colors duration-300 text-sm font-medium whitespace-nowrap"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="hidden xl:inline">Find a store</span>
                <span className="xl:hidden">Store</span>
              </a>

              {isLoggedIn && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCartOpen(true);
                    }}
                    className="relative p-2 text-gray-700 hover:text-red-700 transition-colors duration-300"
                    aria-label="Cart"
                    id="cart-icon"
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
                </>
              )}

              <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
              />

              <div className="relative">
                {isLoggedIn ? (
                  <div className="relative" ref={wrapperRef}>
                    <button
                      onClick={() => setOpenMenu(!openMenu)}
                      className="flex items-center focus:outline-none"
                      aria-label="User menu"
                    >
                      <img
                        src={
                          user?.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user?.fullname || "User",
                          )}&background=random&color=fff&bold=true`
                        }
                        className="h-9 w-9 md:h-10 md:w-10 rounded-full object-cover border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                        alt={user?.fullname || "User"}
                      />
                    </button>

                    {openMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 transition-all duration-200 animate-fadeIn">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {user?.fullname || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email || ""}
                          </p>
                        </div>
                        <Link
                          to="/dashboard"
                          className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-100 text-sm text-gray-700 transition-colors duration-150"
                          onClick={() => setOpenMenu(false)}
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
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-100 text-sm text-gray-700 transition-colors duration-150"
                          onClick={() => setOpenMenu(false)}
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
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-3 hover:bg-red-50 text-sm text-red-600 font-medium transition-colors duration-150"
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
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Link
                      to="/login"
                      className="px-3 py-1.5 md:px-4 md:py-2 border border-gray-800 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors duration-300 whitespace-nowrap"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 transition-colors duration-300 whitespace-nowrap"
                    >
                      Join now
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Right Side (Cart, User, Menu Toggle) */}
            <div className="flex lg:hidden items-center space-x-4">
              {isLoggedIn && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCartOpen(true);
                  }}
                  className="relative p-2 text-gray-700 hover:text-red-700 transition-colors duration-300"
                  aria-label="Cart"
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
              )}

              {/* User Profile in Mobile */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className="flex items-center focus:outline-none"
                    aria-label="User menu"
                  >
                    <img
                      src={
                        user?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user?.fullname || "User",
                        )}&background=random&color=fff&bold=true`
                      }
                      className="h-9 w-9 rounded-full object-cover border-2 border-white"
                      alt={user?.fullname || "User"}
                    />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 border border-gray-800 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors duration-300"
                  >
                    Sign in
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-red-700 focus:outline-none p-2"
                data-mobile-toggle="true"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar - FIXED at Bottom */}
        {!isMobileMenuOpen && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
            <div className="flex justify-around items-center h-16">
              <Link
                to="/"
                className="flex flex-col items-center justify-center text-gray-700 hover:text-red-700 transition-colors duration-300 p-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className="text-xs mt-1">Home</span>
              </Link>

              <Link
                to="/menu"
                className="flex flex-col items-center justify-center text-gray-700 hover:text-red-700 transition-colors duration-300 p-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m8-8v13m-8-13V8m-8 8v13"
                  />
                </svg>
                <span className="text-xs mt-1">Menu</span>
              </Link>

              <Link
                to="/about"
                className="flex flex-col items-center justify-center text-gray-700 hover:text-red-700 transition-colors duration-300 p-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs mt-1">About</span>
              </Link>

              <Link
                to="/reward"
                className="flex flex-col items-center justify-center text-gray-700 hover:text-red-700 transition-colors duration-300 p-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs mt-1">Reward</span>
              </Link>

              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center text-gray-700 hover:text-red-700 transition-colors duration-300 p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-xs mt-1">Store</span>
              </a>
            </div>
          </div>
        )}

        {/* Full Screen Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-in Menu */}
            <div
              ref={mobileMenuRef}
              className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 lg:hidden"
              style={{ transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)' }}
            >
              <div className="h-full flex flex-col">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    {isLoggedIn && user && (
                      <img
                        src={
                          user?.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user?.fullname || "User",
                          )}&background=random&color=fff&bold=true`
                        }
                        className="h-10 w-10 rounded-full object-cover border-2 border-white"
                        alt={user?.fullname || "User"}
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {isLoggedIn ? user?.fullname || "User" : "Welcome"}
                      </h3>
                      {isLoggedIn && user?.email && (
                        <p className="text-xs text-gray-500">{user.email}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-gray-500 hover:text-red-700"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Menu Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-6">
                    {/* Main Navigation */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Navigation
                      </h4>
                      {isNotHomePage && (
                        <Link
                          to="/"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                          </svg>
                          <span>Back to Home</span>
                        </Link>
                      )}
                      <Link
                        to="/menu"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v13m8-8v13m-8-13V8m-8 8v13"
                          />
                        </svg>
                        <span>Menu</span>
                      </Link>
                      <Link
                        to="/about"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>About Us</span>
                      </Link>
                      <Link
                        to="/reward"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Reward</span>
                      </Link>
                    </div>

                    {/* User Actions */}
                    {isLoggedIn ? (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                          Account
                        </h4>
                        <Link
                          to="/dashboard"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                        >
                          <svg
                            className="h-5 w-5"
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
                          <span>Profile</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 text-red-600 w-full text-left"
                        >
                          <svg
                            className="h-5 w-5"
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
                          <span>Logout</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex space-x-3">
                          <Link
                            to="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex-1 px-4 py-3 border border-gray-800 rounded-lg text-center font-medium hover:bg-gray-100"
                          >
                            Sign in
                          </Link>
                          <Link
                            to="/register"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg text-center font-medium hover:bg-gray-700"
                          >
                            Join now
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Menu Footer */}
                <div className="p-4 border-t border-gray-200">
                  <div className="text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Velveta Coffee</p>
                    <p className="mt-1">All rights reserved</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Konfirmasi Logout Modal */}
      {showLogoutConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
            onClick={cancelLogout}
          />
          <div
            ref={confirmRef}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-xs sm:max-w-sm md:w-80 bg-white rounded-xl shadow-2xl z-[70] p-4 sm:p-6 animate-scaleIn"
          >
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.73-.833-2.464 0L4.196 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Logout Confirmation
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Are you sure you want to logout? You'll need to sign in again to
                access your account.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium text-sm sm:text-base"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* Spacer untuk bottom navigation di mobile */}
      <div className="h-16 lg:hidden"></div>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};

export default Navbar;