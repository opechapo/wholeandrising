import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js"; // ← ADD THIS
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import DigitalProducts from "./Pages/DigitalProducts";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import AdminDashboard from "./Pages/AdminDashboard";
import StudentDashboard from "./Pages/StudentDashboard";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import PaymentSuccess from "./Pages/PaymentSuccess";

function App() {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": "YOUR_PAYPAL_CLIENT_ID_HERE", // ← replace with your sandbox/live client ID
        currency: "GBP",
        intent: "capture",
      }}
    >
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
              <Route path="/signup" element={<Signup />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              {/* Add payment success/cancel pages later if needed */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;
