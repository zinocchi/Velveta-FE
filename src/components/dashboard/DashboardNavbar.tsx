import React, { useState, useRef, useEffect } from "react";
import VelvetaLogo from "../../assets/icon/velveta.png";
import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router-dom";
import CartModal from "../../pages/dashboard/CartModal";
import { useCart } from "../../context/CartContext";
import OrderStatusModal from "../../pages/dashboard/OrderStatusModal";

// interface User {
//   name: string;
//   username: string;
//   photo?: string;
//   email?: string;
//   fullname?: string;
//   avatar?: string;
// }

interface DashboardNavbarProps {
  // user: User;
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
  const confirmRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, logout } = useAuth();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();
  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<any>(null);
  const lastOrderId = orderSuccessData?.order_id;

  useEffect(() => {
    const handleScrollClose = () => {
      setDropdownOpen(false);
      setOpenMenu(false);
      setIsMobileMenuOpen(false);
    };

    window.addEventListener("scroll", handleScrollClose, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollClose);
    };
  }, []);

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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
  // const getInitial = () => {
  //   return user?.username?.charAt(0).toUpperCase() ||
  //          user?.name?.charAt(0).toUpperCase() ||
  //          "U";
  // };

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
                onClick={() => setShowOrderStatus(true)}
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
                {/* Badge notifikasi jika ada order baru */}
                {orderSuccessData && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    1
                  </span>
                )}
              </button>

              <OrderStatusModal
                isOpen={showOrderStatus}
                orderId={lastOrderId}
                onClose={() => setShowOrderStatus(false)}
              />
              
              {/* Cart Button */}
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

              {/* Modal Cart */}
              <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
              />

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
                        user?.fullname || user?.fullname || "User",
                      )}&background=random&color=fff&bold=true`
                    }
                    className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    alt={user?.fullname || user?.fullname || "User"}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 transition-all duration-200 animate-fadeIn">
                    {/* User info section */}
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
    </>
  );
};

export default DashboardNavbar;

function setScrolled(arg0: boolean) {
  throw new Error("Function not implemented.");
}
