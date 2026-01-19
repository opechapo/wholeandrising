import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          Whole and Rising
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li>
            <Link to="/digital-products" className="hover:text-primary">
              Digital Products
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-primary">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-primary">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-primary">
              Login/Signup
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
