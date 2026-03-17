import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { UserMenuProps } from "./types";

const UserMenu: React.FC<UserMenuProps> = ({
  user,
  onLogout,
  onClose,
  isOpen,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 transition-all duration-200 animate-fadeIn"
    >
      <div className="px-4 py-2 border-b border-gray-100">
        <p className="font-medium text-gray-900 text-sm truncate">
          {user?.username || "User"}
        </p>
        <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
      </div>

      <Link
        to="/dashboard"
        className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-100 text-sm text-gray-700 transition-colors duration-150"
        onClick={onClose}
      >
        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        onClick={onClose}
      >
        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        onClick={() => {
          onLogout();
          onClose();
        }}
        className="flex items-center w-full text-left px-4 py-3 hover:bg-red-50 text-sm text-red-600 font-medium transition-colors duration-150"
      >
        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
};

export default UserMenu;