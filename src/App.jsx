import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import DigitalProducts from "./Pages/Digitalproducts";
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
        "client-id":
          import.meta.env.VITE_PAYPAL_CLIENT_ID ||
          "AV1DNSv-OrrsykLM2v6uF9hqVqi1AOSEQFcNBC0HD_O6OCcZlqL7Rprrcmmz9r9zNNtLlBYJ6l7oyjNl",
        currency: "GBP",
        intent: "capture",
        locale: "en_GB",
        components: "buttons",
        "enable-funding": "paylater,venmo",
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
