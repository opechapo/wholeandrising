// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

// Import your images (adjust folder/path if needed)
import wellnessSymbol from "../assets/images/wellness-symbol-footer.png"; // ← your generated symbol
import footerBgPattern from "../assets/images/footer-bg-pattern.png"; // ← your generated subtle texture

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-emerald-950/70 text-gray-200 overflow-hidden">
      {/* Subtle background decoration image (low opacity pattern / texture) */}
      <img
        src={footerBgPattern}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none"
      />

      {/* Main footer content */}
      <div className="relative container mx-auto px-6 py-12 md:py-16 z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand / About column */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center mb-6">
              <img
                src="/logo.png"
                alt="Whole and Rising Logo"
                className="h-12 w-auto object-contain"
              />
            </Link>

            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Gentle digital tools and guidance for personal growth, authentic
              connection, family wellness, and intentional living.
            </p>

            {/* Small decorative wellness icon / illustration
            <img
              src={wellnessSymbol}
              alt="Wellness symbol"
              className="w-20 h-20 md:w-24 md:h-24 mt-4 opacity-80"
            /> */}

            <div className="flex items-center space-x-5 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                <svg
                  className="w-7 h-7"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.239 2.242 1.301 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.239-3.608 1.301-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.239-2.242-1.301-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.239 3.608-1.301 1.266-.058 1.646-.07 4.85-.07z" />
                  <circle
                    cx="12"
                    cy="12"
                    r="3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link
                  to="/digital-products"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Digital Products
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-emerald-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Login / Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5">Support</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-emerald-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@wholeandrising.com"
                  className="hover:text-emerald-400 transition-colors"
                >
                  support@wholeandrising.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative border-t border-gray-700/60 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Whole and Rising. All rights
            reserved.
          </p>
          <p className="mt-2 text-gray-500">Designed and Built by Value Labs</p>
        </div>
      </div>

      {/* Subtle bottom glow / gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-emerald-900/30 to-transparent pointer-events-none" />
    </footer>
  );
};

export default Footer;
