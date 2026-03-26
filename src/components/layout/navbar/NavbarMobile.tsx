import React from "react";
import { Link } from "react-router-dom";
import { NavbarMobileProps } from "./types";
import CartIcon from "./CartIcon";
import { User } from "../../../types";

interface NavbarMobileBottomProps extends NavbarMobileProps {
  totalItems: number;
  isLoggedIn: boolean;
  user: User | null;
}
const NavbarMobileBottom: React.FC<NavbarMobileBottomProps> = ({
  onCartClick,
  onMenuToggle,
  totalItems,
  isLoggedIn,
  user,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/"
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
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          to="/menu"
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
              strokeWidth={2}
              d="M12 8v13m8-8v13m-8-13V8m-8 8v13"
            />
          </svg>
          <span className="text-xs mt-1">Menu</span>
        </Link>

        <Link
          to="/about"
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
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xs mt-1">About</span>
        </Link>

        <Link
          to="/reward"
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
  );
};

export default NavbarMobileBottom;