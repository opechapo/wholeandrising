import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Download, ArrowRight } from "lucide-react";
import axios from "axios"; // NEW

const BACKEND_URL = "https://wholeandrisingbacknd-7uns.onrender.com";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionDetails, setSessionDetails] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const stripeSessionId = searchParams.get("session_id");

    if (stripeSessionId) {
      setSessionId(stripeSessionId);
      verifySession(stripeSessionId);
    }

    setLoading(false);
  }, [searchParams, navigate]);

  const verifySession = async (id) => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/payments/verify-session/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        },
      );
      setSessionDetails(res.data);
    } catch (err) {
      console.error("Session verification error:", err);
      setError("Failed to verify payment");
    }
  };

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
        {sessionId && (
          <p className="text-sm text-gray-500 mb-8">
            Stripe Session ID: <strong>{sessionId}</strong>
          </p>
        )}
        {sessionDetails?.invoiceUrl && ( // NEW - Show invoice if generated
          <p className="text-sm text-gray-500 mb-8">
            <a
              href={sessionDetails.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Invoice
            </a>
          </p>
        )}
        {error && <p className="text-red-500 mb-8">{error}</p>} {/* NEW */}
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
