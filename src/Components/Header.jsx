// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const storedRole = localStorage.getItem("role");
      setRole(storedRole);
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  }, []);

  const dashboardLink = role === "admin" ? "/admin" : "/dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    setIsMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white py-5 md:py-7 sticky top-0 z-50 transition-all duration-300">
      <nav className="container mx-auto flex justify-between items-center px-5 md:px-10">
        {/* Logo - always visible */}
        <Link to="/" className="flex items-center z-50" onClick={closeMenu}>
          <img
            src="/logo.png"
            alt="Whole and Rising Logo"
            className="
              h-14          /* mobile */
              md:h-20       /* tablet+ */
              max-h-14
              w-auto
              object-contain
              hover:opacity-90
              transition-opacity duration-300
            "
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8 lg:gap-12">
          {[
            { to: "/digital-products", label: "Digital Products" },
            { to: "/about", label: "About" },
            { to: "/contact", label: "Contact" },
          ].map((item, index) => (
            <li
              key={item.to}
              className={`
                opacity-0 translate-y-2
                animate-fade-in-up
              `}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <Link
                to={item.to}
                className="
                  relative
                  text-lg lg:text-xl
                  font-semibold
                  text-gray-800
                  hover:text-emerald-600
                  transition-all duration-300
                  group
                "
              >
                {item.label}
                <span
                  className="
                    absolute left-0 bottom-[-4px] h-[2.5px] w-0
                    bg-emerald-500 rounded-full
                    group-hover:w-full
                    transition-all duration-400 ease-out
                  "
                />
              </Link>
            </li>
          ))}

          {/* Auth section - desktop */}
          <li
            className="
              opacity-0 translate-y-2
              animate-fade-in-up
            "
            style={{ animationDelay: "240ms" }}
          >
            {isLoggedIn ? (
              <div className="flex items-center gap-6 lg:gap-8">
                <Link
                  to={dashboardLink}
                  className="
                    text-lg lg:text-xl
                    font-bold
                    text-emerald-600
                    hover:text-emerald-800
                    transition-all duration-300
                    hover:scale-105
                  "
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="
                    text-base lg:text-lg
                    font-semibold
                    bg-red-600 hover:bg-red-700
                    text-white
                    px-6 py-2.5
                    rounded-lg
                    shadow-sm
                    hover:shadow-md
                    hover:scale-105
                    active:scale-95
                    transition-all duration-300
                  "
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="
                  text-lg lg:text-xl
                  font-bold
                  text-emerald-600
                  hover:text-emerald-800
                  transition-all duration-300
                  hover:scale-105
                "
              >
                Login / Sign Up
              </Link>
            )}
          </li>
        </ul>

        {/* Hamburger Button - visible only on mobile */}
        <button
          className="md:hidden z-50 text-3xl focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="sr-only">Menu</span>
          {isMenuOpen ? (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay + Slide-in Sidebar */}
      {isMenuOpen && (
        <>
          {/* Backdrop - click to close */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Slide-in menu from right */}
          <div
            className={`
              fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl z-50
              transform transition-transform duration-300 ease-in-out
              ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
              md:hidden
            `}
          >
            <div className="flex flex-col h-full">
              {/* Header with close button */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-emerald-700">Menu</h2>
                <button
                  onClick={closeMenu}
                  className="text-gray-600 hover:text-gray-900 focus:outline-none"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Menu items */}
              <div className="flex flex-col flex-1 p-6 space-y-6 text-lg font-medium">
                <Link
                  to="/digital-products"
                  className="text-gray-800 hover:text-emerald-600 transition-colors"
                  onClick={closeMenu}
                >
                  Digital Products
                </Link>
                <Link
                  to="/about"
                  className="text-gray-800 hover:text-emerald-600 transition-colors"
                  onClick={closeMenu}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-800 hover:text-emerald-600 transition-colors"
                  onClick={closeMenu}
                >
                  Contact
                </Link>

                <div className="pt-4 border-t border-gray-200">
                  {isLoggedIn ? (
                    <>
                      <Link
                        to={dashboardLink}
                        className="block text-emerald-600 hover:text-emerald-800 font-bold mb-4"
                        onClick={closeMenu}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="
                          w-full bg-red-600 hover:bg-red-700
                          text-white font-semibold
                          py-3 px-6 rounded-lg
                          transition-all duration-300
                        "
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="
                        block w-full text-center bg-emerald-600 hover:bg-emerald-700
                        text-white font-semibold
                        py-3 px-6 rounded-lg
                        transition-all duration-300
                      "
                      onClick={closeMenu}
                    >
                      Login / Sign Up
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Fade-in animation keyframes - keep your original */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </header>
  );
};

export default Header;
