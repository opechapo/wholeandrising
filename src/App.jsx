import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import DigitalProducts from "./pages/DigitalProducts";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Login from "./pages/Login";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51SnpefEapbQZr5Ma5kf7OAnBsmvRMEfNyQhcegUUf3fsCp7aF2SCf0f9BoFnwBqHZ7xQKKEhEwIV8Y1rTc5ED5m6003zHvp6Dx"
); // Replace with your key

function App() {
  return (
    <Elements stripe={stripePromise}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/digital-products" element={<DigitalProducts />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/login" element={<Login />} />
              {/* Add success/cancel routes */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Elements>
  );
}

export default App;
