import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import VelvetaLogo from "../assets/icon/velveta.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import CartModal from "../pages/dashboard/CartModal";
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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

  useEffect(() => {
    const closeOnScroll = () => setOpenMenu(false);
    window.addEventListener("scroll", closeOnScroll);
    return () => window.removeEventListener("scroll", closeOnScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(false);
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

  const handleLogout = () => {
    setShowLogoutConfirm(true);
    setOpenMenu(false);
    setIsMobileMenuOpen(false);
  };

  const confirmLogout = () => {
    logout();

    document.body.classList.remove("modal-open");

    localStorage.removeItem("token");
    setShowLogoutConfirm(true);
    navigate("/");
    window.location.reload();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
    document.body.classList.remove("modal-open");
  };

  // Check if current page is not home page
  const isNotHomePage = location.pathname !== "/";
  return (
    <header
      className={`fixed top-0 w-full bg-white z-50 transition-all duration-300 ${
        scrolled ? "shadow-md border-b border-gray-200" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center space-x-8">
            <div className="logo">
              <Link to="/">
                <img
                  src={VelvetaLogo}
                  alt="Velveta Logo"
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover transition-transform duration-300 hover:rotate-12"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/56/9B111E/FFFFFF?text=V";
                  }}
                />
              </Link>
            </div>

            {/* Tombol Back to Home untuk desktop - hanya muncul di halaman lain */}
            {isNotHomePage && (
              <div className="hidden md:block">
                <Link
                  to="/"
                  className="menu-item text-gray-900 hover:text-red-700 font-semibold uppercase text-sm tracking-wider transition-colors duration-300"
                >
                  Home
                </Link>
              </div>
            )}

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
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

          {/* Desktop Right Side - Sama persis dengan Blade */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-700 hover:text-red-700 transition-colors duration-300 text-sm font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
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
              Find a store
            </a>

            {isLoggedIn && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCartOpen(true);
                  }}
                  className="relative p-2 text-gray-700 hover:text-red-700 transition-colors duration-300"
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
                      {totalItems}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Pindahkan CartModal ke sini, di luar button */}
            <CartModal
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
            />

            <div className="relative">
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className="flex items-center"
                  >
                    <img
                      src={
                        user?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user?.fullname || "User",
                        )}&background=random&color=fff&bold=true`
                      }
                      className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                      alt={user?.fullname || "User"}
                    />
                  </button>

                  <div ref={wrapperRef} className="relative flex items-center">
                    <button onClick={() => setOpenMenu(!openMenu)}>
                      {/* avatar */}
                    </button>

                    {openMenu && (
                      <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 transition-all duration-200 animate-fadeIn">
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
                          </svg>{" "}
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-100 text-sm text-gray-700 transition-colors duration-150"
                          onClick={() => setOpenMenu(false)}
                        >
                          <i className="fas fa-user mr-3"></i>
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-3 hover:bg-red-50 text-sm text-red-600 font-medium transition-colors duration-150"
                        >
                          <i className="fas fa-sign-out-alt mr-2"></i>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  {" "}
                  {/* Tambah container dengan flex dan space-x-3 */}
                  <Link
                    to="/login"
                    className="px-4 py-2 border border-gray-800 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors duration-300"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 transition-colors duration-300"
                  >
                    Join now
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-red-700 focus:outline-none"
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
                  //{" "}
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              {/* Tombol Back to Home dalam mobile menu - hanya muncul di halaman lain */}
              {isNotHomePage && (
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center text-gray-700 hover:text-red-700 transition-colors duration-300 text-sm font-medium py-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
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
                  Back to Home
                </Link>
              )}

              <Link
                to="/menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-900 hover:text-red-700 font-semibold uppercase text-sm tracking-wider transition-colors duration-300 py-2"
              >
                Menu
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-900 hover:text-red-700 font-semibold uppercase text-sm tracking-wider transition-colors duration-300 py-2"
              >
                About Us
              </Link>
              <Link
                to="/reward"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-900 hover:text-red-700 font-semibold uppercase text-sm tracking-wider transition-colors duration-300 py-2"
              >
                Reward
              </Link>

              <div className="pt-4 border-t border-gray-200">
                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-red-700 transition-colors duration-300 text-sm font-medium mb-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
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
                  Find a store
                </a>

                <div className="flex space-x-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-800 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors duration-300 text-center"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 transition-colors duration-300 text-center"
                  >
                    Join now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Konfirmasi Logout Modal */}
      {showLogoutConfirm && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] "
            onClick={cancelLogout}
          />

          {/* Modal Konfirmasi */}
          <div
            ref={confirmRef}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 bg-white rounded-xl shadow-2xl z-[70] p-6 animate-scaleIn"
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
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
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
