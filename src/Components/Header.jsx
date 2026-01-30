// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Optional: decode role from token or fetch from backend
      // For simplicity, we can store role in localStorage after login
      const storedRole = localStorage.getItem("role");
      setRole(storedRole);
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/login");
  };

  const dashboardLink = role === "admin" ? "/admin" : "/dashboard";

  return (
    <header className="bg-white shadow-md py-4 sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center px-4">
        <Link
          to="/"
          className="text-2xl md:text-3xl font-bold text-green-600 hover:text-green-700 transition-colors"
        >
          Whole and Rising
        </Link>

        <ul className="flex items-center space-x-6 md:space-x-10">
          {/* <li>
            <Link
              to="/"
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Home
            </Link>
          </li> */}
          <li>
            <Link
              to="/digital-products"
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Digital Products
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Contact
            </Link>
          </li>

          {/* Dynamic auth link */}
          <li>
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={dashboardLink}
                  className="text-green-600 hover:text-green-800 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-5 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-green-600 hover:text-green-800 font-medium transition-colors"
              >
                Login / Sign Up
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
