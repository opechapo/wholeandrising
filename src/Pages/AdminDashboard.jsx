import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios.get("/api/products", config).then((res) => setProducts(res.data));
    axios.get("/api/orders", config).then((res) => setOrders(res.data));
    axios
      .get("/api/orders/analytics", config)
      .then((res) => setAnalytics(res.data));
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "ebooks",
    file: null,
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    try {
      await axios.post("/api/products", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Product added successfully!");
      // Optional: refresh products list
    } catch (err) {
      alert("Error adding product");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
        Admin Dashboard
      </h1>

      {/* Add Product Form */}
      <section className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Product
        </h2>
        <form onSubmit={handleAddProduct} className="space-y-5">
          <input
            type="text"
            placeholder="Product Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[120px]"
          />
          <input
            type="number"
            placeholder="Price (£)"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="ebooks">📘 E-Books & Guides</option>
            <option value="workbooks">🗂️ Workbooks, Templates...</option>
            <option value="conversation">💬 Conversation Tools</option>
            <option value="courses">🎓 Courses</option>
          </select>
          <input
            type="file"
            onChange={(e) =>
              setFormData({ ...formData, file: e.target.files[0] })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Add Product
          </button>
        </form>
      </section>

      {/* Analytics */}
      <section className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <p className="text-lg">
              Total Orders:{" "}
              <span className="font-semibold">
                {analytics.totalOrders || 0}
              </span>
            </p>
            <p className="text-lg">
              Total Enrollments:{" "}
              <span className="font-semibold">
                {analytics.totalEnrollments || 0}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Orders list placeholder */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Orders</h2>
        {/* Add order table here when ready */}
        <p className="text-gray-600">Orders will appear here...</p>
      </section>
    </div>
  );
};

export default AdminDashboard;
