import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Download, ArrowRight } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = "https://wholeandrisingbacknd-7uns.onrender.com";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Optional: You can fetch order details using PayPal orderID from query param
    const paypalOrderId = searchParams.get("token"); // PayPal redirects with ?token=xxx

    if (paypalOrderId) {
      // You could call your backend to verify / get order details
      // For simplicity, we just show success message
      setOrderId(paypalOrderId);
    }

    setLoading(false);
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-xl text-gray-600">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>

        <p className="text-xl text-gray-700 mb-8">
          Thank you for your purchase. Your digital product is now ready to
          download.
        </p>

        {orderId && (
          <p className="text-sm text-gray-500 mb-8">
            PayPal Transaction ID: <strong>{orderId}</strong>
          </p>
        )}

        <div className="space-y-6 mb-10">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              What's Next?
            </h3>
            <p className="text-gray-700">
              Go to your <strong>Student Dashboard</strong> to download your
              product and view your receipt.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-10 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
            >
              Go to Dashboard
              <ArrowRight size={20} />
            </button>

            <button
              onClick={() => navigate("/digital-products")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-4 px-10 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
            >
              Browse More Products
              <Download size={20} />
            </button>
          </div>
        </div>

        <p className="text-gray-500 text-sm">
          A receipt has been sent to your email (if provided).
          <br />
          If you have any issues, contact support.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
