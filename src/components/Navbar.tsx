import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../Auth/useAuth";
import logo from "../assets/images/velveta.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <header className="fixed top-0 w-full bg-white shadow-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* LEFT */}
          <div className="flex items-center space-x-8">
            <Link to="/">
              <img
                src={logo}
                alt="Velveta"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover transition-transform hover:rotate-12"
              />
            </Link>

            <nav className="hidden md:flex space-x-8">
              <Link to="/menu" className="menu-item nav-link">Menu</Link>
              <Link to="/about" className="menu-item nav-link">About Us</Link>
              <Link to="/reward" className="menu-item nav-link">Reward</Link>
            </nav>
          </div>

          {/* RIGHT */}
          <div className="flex items-center space-x-4">
            <a
              href="https://www.google.com/maps"
              target="_blank"
              className="hidden md:flex items-center text-gray-700 hover:text-red-700 text-sm font-medium"
            >
              <i className="fas fa-map-marker-alt mr-2" />
              Find a store
            </a>

            {!user && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 border border-gray-800 rounded-full text-sm font-medium hover:bg-gray-100"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700"
                >
                  Join now
                </Link>
              </>
            )}

            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {user.photo ? (
                    <img
                      src={user.photo}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center text-white font-semibold">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:inline text-gray-900 font-medium">
                    {user.name}
                  </span>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-xl py-2 w-48">
                    <Link to="/dashboard" className="dropdown-item">
                      <i className="fas fa-tachometer-alt mr-2" />
                      Dashboard
                    </Link>
                    <Link to="/profile" className="dropdown-item">
                      <i className="fas fa-user-edit mr-2" />
                      Edit Profile
                    </Link>

                    <div className="border-t my-1" />

                    <button
                      onClick={logout}
                      className="dropdown-item text-red-700 w-full text-left"
                    >
                      <i className="fas fa-sign-out-alt mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
