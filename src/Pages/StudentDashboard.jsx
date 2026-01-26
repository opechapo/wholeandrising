import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      .get("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error(err);
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
      {/* <div className="flex justify-end mb-8">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/login");
          }}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div> */}

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
                <p className="text-gray-700 mt-2">
                  Amount: £{order.amount.toFixed(2)}
                </p>
                {order.receiptUrl && (
                  <a
                    href={order.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-green-600 hover:text-green-800 font-medium"
                  >
                    Download Receipt
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Progress</h2>
        {/* Add progress bars here later */}
        <p className="text-gray-600">Progress tracking coming soon...</p>
      </section>
    </div>
  );
};

export default StudentDashboard;
