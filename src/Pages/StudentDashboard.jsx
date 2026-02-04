// StudentDashboard.jsx
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Student Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen fixed">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-green-400">Student Area</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full text-left px-5 py-3 rounded-lg bg-green-600 text-white"
          >
            My Purchases
          </button>
          {/* You can add more items later, e.g. */}
          {/* <button className="w-full text-left px-5 py-3 rounded-lg hover:bg-gray-800">Progress</button> */}
          {/* <button className="w-full text-left px-5 py-3 rounded-lg hover:bg-gray-800">Settings</button> */}
        </nav>

        {/* Logout at bottom */}
        <div className="p-6 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Student Dashboard
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl mb-8 max-w-4xl mx-auto">
            {error}
          </div>
        )}

        <section className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Your Purchases
          </h2>

          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-md text-center text-gray-600">
              You haven't purchased any products yet.
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white p-8 rounded-2xl shadow-md border border-gray-200"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {order.productId?.title || "Product"}
                  </h3>

                  <div className="space-y-3 text-gray-700">
                    <p>
                      <span className="font-semibold">Amount:</span>{" "}
                      {order.amount === 0
                        ? "Free"
                        : `£${order.amount?.toFixed(2)}`}
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      <span
                        className={
                          order.status === "paid"
                            ? "text-green-600 font-medium"
                            : "text-yellow-600 font-medium"
                        }
                      >
                        {order.status?.charAt(0).toUpperCase() +
                          order.status?.slice(1)}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">Purchased:</span>{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>

                    {order.downloadAccess && order.productId?.fileUrl && (
                      <div className="mt-6">
                        <a
                          href={order.productId.fileUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-xl transition-colors"
                        >
                          Download Product
                        </a>
                      </div>
                    )}

                    {order.receiptUrl && (
                      <div className="mt-4">
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

                    {order.amount === 0 && !order.productId?.fileUrl && (
                      <p className="mt-4 text-gray-500 italic">
                        Free access granted — check your email or contact
                        support if file is missing.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="max-w-5xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Your Progress
          </h2>
          <div className="bg-white p-10 rounded-2xl shadow-md text-center text-gray-600">
            Progress tracking & course content coming soon...
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
