import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User } from "../../../types/user";
import CartIcon from "./CartIcon";
import UserMenu from "./UserMenu";

interface NavbarDesktopProps {
  user: User | null;
  isLoggedIn: boolean;
  isAdminPreview: boolean;
  totalItems: number;
  onCartClick: () => void;
  onLogoutClick: () => void;
  isUserMenuOpen: boolean;
  onUserMenuToggle: () => void;
  onUserMenuClose: () => void;
}

const NavbarDesktop: React.FC<NavbarDesktopProps> = ({
  user,
  isLoggedIn,
  isAdminPreview,
  totalItems,
  onCartClick,
  onLogoutClick,
  isUserMenuOpen,
  onUserMenuToggle,
  onUserMenuClose,
}) => {
  const location = useLocation();
  const isNotHomePage = location.pathname !== "/";

  return (
    <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
      {/* Store Locator */}
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

      {/* Cart Icon with cart-source wrapper */}
      {isLoggedIn && !isAdminPreview && (
        <div className="cart-source relative">
          <CartIcon totalItems={totalItems} onClick={onCartClick} />
        </div>
      )}

      {/* User Menu */}
      <div className="relative">
        {isLoggedIn ? (
          <>
            <button
              onClick={onUserMenuToggle}
              className="flex items-center focus:outline-none"
              aria-label="User menu"
            >
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.username || "User"
                  )}&background=random&color=fff&bold=true`
                }
                className="h-9 w-9 md:h-10 md:w-10 rounded-full object-cover border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                alt={user?.username || "User"}
              />
            </button>

            <UserMenu
              user={user}
              isOpen={isUserMenuOpen}
              onClose={onUserMenuClose}
              onLogout={onLogoutClick}
            />
          </>
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
  );
};

export default NavbarDesktop;