import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://wholeandrisingbacknd-7uns.onrender.com";

const StudentDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handle401 = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .get(`${BACKEND_URL}/api/orders`, config)
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error("Orders fetch failed:", err);
        if (err.response?.status === 401) {
          alert("Your session has expired. Please log in again.");
          handle401();
        } else {
          setError("Failed to load your purchases. Please try again later.");
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
      {/* Sidebar */}
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
        </nav>

        <div className="p-6 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Student Dashboard
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl mb-8 max-w-4xl mx-auto text-center">
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
            <div className="space-y-12">
              {orders.map((order) => {
                const isFree = order.amount === 0;
                const hasAccess = order.downloadAccess;
                const hasFile = order.productId?.fileUrl;

                return (
                  <div
                    key={order._id}
                    className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                      {order.productId?.title || "Product Title Unavailable"}
                    </h3>

                    {/* Access granted section */}
                    {hasAccess ? (
                      <div className="mb-10 p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                        <h4 className="text-2xl md:text-3xl font-bold text-emerald-800 mb-6">
                          {isFree ? "Free Access Granted!" : "Access Granted!"}
                        </h4>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-lg mx-auto">
                          <button
                            onClick={() =>
                              navigate("/student/preview", {
                                state: { orderId: order._id },
                              })
                            }
                            className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-10 rounded-xl transition-all text-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 w-full sm:w-auto"
                          >
                            Preview Product
                          </button>

                          {hasFile && (
                            <button
                              onClick={async () => {
                                try {
                                  const token = localStorage.getItem("token");
                                  const response = await fetch(
                                    `${BACKEND_URL}/api/products/${order.productId._id}/download`,
                                    {
                                      method: "GET",
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    },
                                  );

                                  if (!response.ok) {
                                    const err = await response
                                      .json()
                                      .catch(() => ({}));
                                    throw new Error(
                                      err.msg || "Download failed",
                                    );
                                  }

                                  const blob = await response.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const link = document.createElement("a");
                                  link.href = url;
                                  const fileName = `${order.productId.title?.replace(/[^a-z0-9]/gi, "_") || "product"}.pdf`;
                                  link.setAttribute("download", fileName);
                                  document.body.appendChild(link);
                                  link.click();
                                  link.remove();
                                  window.URL.revokeObjectURL(url);
                                } catch (err) {
                                  alert(
                                    err.message || "Could not download file.",
                                  );
                                }
                              }}
                              className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-10 rounded-xl transition-all text-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 w-full sm:w-auto"
                            >
                              <svg
                                className="w-6 h-6 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                              Download File
                            </button>
                          )}
                        </div>

                        <p className="mt-6 text-gray-600 italic">
                          {isFree
                            ? "Thank you for claiming this free resource!"
                            : "Your purchase was successful."}
                        </p>
                      </div>
                    ) : (
                      <div className="mb-10 p-6 bg-amber-50 rounded-xl border border-amber-200 text-center">
                        <p className="text-amber-800 font-medium text-xl">
                          {isFree
                            ? "Claim in progress..."
                            : "Payment in progress..."}
                        </p>
                        <p className="mt-2 text-amber-700">
                          Refresh in a moment
                        </p>
                      </div>
                    )}

                    {/* Order details */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8 text-gray-700 text-lg">
                      <div>
                        <span className="font-semibold block">Amount</span>
                        {isFree ? "Free" : `£${order.amount?.toFixed(2)}`}
                      </div>
                      <div>
                        <span className="font-semibold block">Status</span>
                        <span
                          className={
                            order.status === "paid"
                              ? "text-green-600 font-semibold"
                              : "text-yellow-600 font-semibold"
                          }
                        >
                          {order.status?.charAt(0).toUpperCase() +
                            order.status?.slice(1)}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold block">Purchased</span>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Curriculum */}
                    {hasAccess && order.productId?.curriculum?.length > 0 && (
                      <div className="mt-8 pt-10 border-t border-gray-200">
                        <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center md:text-left">
                          What's Inside
                        </h4>
                        <div className="space-y-10">
                          {order.productId.curriculum.map((item, index) => (
                            <div
                              key={index}
                              className="border-l-5 border-emerald-500 pl-6 py-4 bg-emerald-50/30 rounded-r-xl"
                            >
                              <h5 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                                {item.title}
                              </h5>
                              {item.summary && (
                                <p className="text-gray-600 italic mb-4 text-lg">
                                  {item.summary}
                                </p>
                              )}
                              <div
                                className="prose prose-emerald prose-lg max-w-none text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                  __html: item.content || "",
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Progress Section (placeholder) */}
        <section className="max-w-5xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Your Progress
          </h2>
          <div className="bg-white p-12 rounded-2xl shadow-md text-center text-gray-600">
            Progress tracking & course content coming soon...
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
