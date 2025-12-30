import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Navbar.css";
import VelvetaLogo from "../assets/icon/velveta.png";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full bg-white z-50 transition-all duration-300 ${scrolled ? 'shadow-md border-b border-gray-200' : ''}`}>
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
                    target.src = "https://via.placeholder.com/56/9B111E/FFFFFF?text=V";
                  }}
                />
              </Link>
            </div>
            
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

            {/* Tombol Sign in dan Join Now - Sama persis dengan Blade */}
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-red-700 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4 animate-fadeIn">
            <div className="flex flex-col space-y-4">
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
    </header>
  );
};

export default Navbar;