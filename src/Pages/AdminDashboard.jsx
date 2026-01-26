// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "ebooks",
    file: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productsRes, ordersRes, analyticsRes] = await Promise.all([
          axios.get("/api/products", config),
          axios.get("/api/orders", config),
          axios.get("/api/orders/analytics", config),
        ]);

        setProducts(productsRes.data);
        setOrders(ordersRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load dashboard data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.file
    ) {
      alert("Please fill all required fields and select a file.");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/products", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product added successfully!");

      // Refresh products list
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get("/api/products", config);
      setProducts(res.data);

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "ebooks",
        file: null,
      });
    } catch (err) {
      console.error("Add product error:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert(
          "Error adding product: " +
            (err.response?.data?.msg || "Unknown error"),
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
        Admin Dashboard
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

      {/* Add Product Form */}
      <section className="max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-lg mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Add New Digital Product
        </h2>

        <form onSubmit={handleAddProduct} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              placeholder="Product Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description *
            </label>
            <textarea
              placeholder="Detailed description of the product..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Price (£) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="19.99"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="ebooks">📘 E-Books & Guides</option>
                <option value="workbooks">
                  🗂️ Workbooks, Journals, Templates
                </option>
                <option value="conversation">
                  💬 Conversation & Connection Tools
                </option>
                <option value="courses">🎓 Courses</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Upload File *
            </label>
            <input
              type="file"
              onChange={(e) =>
                setFormData({ ...formData, file: e.target.files[0] || null })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-lg py-4 px-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Add Product
          </button>
        </form>
      </section>

      {/* Quick Stats */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Total Orders</h3>
          <p className="text-4xl font-extrabold text-green-600">
            {analytics.totalOrders || 0}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Total Enrollments
          </h3>
          <p className="text-4xl font-extrabold text-green-600">
            {analytics.totalEnrollments || 0}
          </p>
        </div>

        {/* You can add more stats here later */}
      </section>

      {/* Recent Orders */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Orders</h2>

        {orders.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-md text-center text-gray-600">
            No orders yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {order.productId?.title || "Product"}
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Amount:</span> £
                    {order.amount?.toFixed(2)}
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
                      {order.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Purchased:</span>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  {order.userEmail && (
                    <p>
                      <span className="font-medium">By:</span> {order.userEmail}
                    </p>
                  )}
                  {order.receiptUrl && (
                    <a
                      href={order.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-green-600 hover:text-green-800 font-medium"
                    >
                      View Receipt →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
