import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "https://wholeandrisingbacknd-7uns.onrender.com";

const StudentDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${BACKEND_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error("Orders failed:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load your purchases");
        }
      });
  }, [navigate]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
        Student Dashboard
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Your Purchases
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-600 text-center">No purchases yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  {order.productId?.title || "Product"}
                </h3>

                <div className="mt-2 space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Amount:</span>{" "}
                    {order.amount === 0
                      ? "Free"
                      : `£${order.amount?.toFixed(2) || "0.00"}`}
                  </p>

                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`font-medium ${
                        order.status === "paid"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </p>

                  <p>
                    <span className="font-medium">Purchased:</span>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  {/* Download Access */}
                  {order.downloadAccess && order.productId?.fileUrl && (
                    <div className="mt-4">
                      <a
                        href={order.productId.fileUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                      >
                        Download Product
                      </a>
                    </div>
                  )}

                  {/* PayPal Receipt */}
                  {order.receiptUrl && (
                    <div className="mt-3">
                      <a
                        href={order.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 font-medium underline"
                      >
                        View PayPal Receipt →
                      </a>
                    </div>
                  )}

                  {/* Free item note */}
                  {order.amount === 0 && !order.productId?.fileUrl && (
                    <p className="mt-3 text-gray-500 italic">
                      Free access granted — check your email or contact support
                      if file is missing.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Progress</h2>
        <p className="text-gray-600">Progress tracking coming soon...</p>
      </section>
    </div>
  );
};

export default StudentDashboard;
