import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white shadow z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-red-700">
          Velveta
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-6">
          <Link to="/" className="hover:text-red-700">Home</Link>
          <Link to="/about" className="hover:text-red-700">About</Link>
          <Link to="/rewards" className="hover:text-red-700">Rewards</Link>
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setOpen(false)}>About</Link>
          <Link to="/rewards" onClick={() => setOpen(false)}>Rewards</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
  