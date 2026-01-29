import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const BACKEND_URL = "https://wholeandrisingbacknd-7uns.onrender.com";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "ebooks",
    file: null,
    featuredImage: null,
  });
  const [pricingModel, setPricingModel] = useState("paid");
  const [overview, setOverview] = useState("");
  const [curriculum, setCurriculum] = useState([]);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicSummary, setNewTopicSummary] = useState("");
  const [currentTopicIndex, setCurrentTopicIndex] = useState(-1);
  const [newLessonName, setNewLessonName] = useState("");
  const [newLessonContent, setNewLessonContent] = useState("");

  // Editing mode
  const [editingProduct, setEditingProduct] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      setLoading(true);
      setError(null);

      const productsPromise = axios.get(`${BACKEND_URL}/api/products`, config);
      const ordersPromise = axios.get(`${BACKEND_URL}/api/orders`, config);
      const analyticsPromise = axios.get(
        `${BACKEND_URL}/api/orders/analytics`,
        config,
      );

      const [productsRes, ordersRes, analyticsRes] = await Promise.all([
        productsPromise.catch((err) => {
          console.error("Products failed:", err);
          throw err;
        }),
        ordersPromise.catch((err) => {
          console.error("Orders failed:", err);
          throw err;
        }),
        analyticsPromise.catch((err) => {
          console.error("Analytics failed:", err);
          throw err;
        }),
      ]);

      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      if (err.response) {
        setError(
          `Server error (${err.response.status}) on ${err.config?.url || "unknown endpoint"}`,
        );
      } else {
        setError("Failed to load dashboard data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "ebooks",
      file: null,
      featuredImage: null,
    });
    setPricingModel("paid");
    setOverview("");
    setCurriculum([]);
    setNewTopicTitle("");
    setNewTopicSummary("");
    setCurrentTopicIndex(-1);
    setNewLessonName("");
    setNewLessonContent("");
    setEditingProduct(null);
  };

  const handleAddTopic = () => {
    if (!newTopicTitle.trim()) {
      alert("Topic title is required");
      return;
    }
    setCurriculum([
      ...curriculum,
      {
        title: newTopicTitle.trim(),
        summary: newTopicSummary.trim(),
        lessons: [],
      },
    ]);
    setNewTopicTitle("");
    setNewTopicSummary("");
  };

  const handleAddLesson = () => {
    if (!newLessonName.trim() || !newLessonContent.trim()) {
      alert("Lesson name and content are required");
      return;
    }
    if (currentTopicIndex === -1) return;

    const updatedCurriculum = [...curriculum];
    updatedCurriculum[currentTopicIndex].lessons.push({
      name: newLessonName.trim(),
      content: newLessonContent,
    });
    setCurriculum(updatedCurriculum);
    setNewLessonName("");
    setNewLessonContent("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category) {
      alert("Please fill all required fields (title, description, category).");
      return;
    }

    if (pricingModel === "paid" && !formData.price) {
      alert("Price is required for paid products.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", pricingModel === "free" ? "0" : formData.price);
    data.append("category", formData.category);
    data.append("pricingModel", pricingModel);
    data.append("overview", overview);
    data.append("curriculum", JSON.stringify(curriculum));

    if (formData.file) data.append("file", formData.file);
    if (formData.featuredImage)
      data.append("featuredImage", formData.featuredImage);

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      if (editingProduct) {
        await axios.put(
          `${BACKEND_URL}/api/products/${editingProduct._id}`,
          data,
          config,
        );
        alert("Product updated successfully!");
      } else {
        await axios.post(`${BACKEND_URL}/api/products`, data, config);
        alert("Product added successfully!");
      }

      resetForm();
      fetchData();
    } catch (err) {
      console.error("Product save error:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert(
          (editingProduct ? "Update" : "Add") +
            " error: " +
            (err.response?.data?.msg || "Unknown error"),
        );
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      file: null,
      featuredImage: null,
    });
    setPricingModel(product.pricingModel || "paid");
    setOverview(product.overview || "");
    setCurriculum(product.curriculum || []);
    setCurrentTopicIndex(-1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.delete(`${BACKEND_URL}/api/products/${id}`, config);
      alert("Product deleted successfully!");
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
      alert(
        "Error deleting product: " +
          (err.response?.data?.msg || "Unknown error"),
      );
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

      <section className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-lg mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {editingProduct
            ? `Edit Product: ${editingProduct.title}`
            : "Add New Digital Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Featured Image (Thumbnail)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  featuredImage: e.target.files[0] || null,
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
            />
            {editingProduct?.featuredImageUrl && !formData.featuredImage && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Current thumbnail:</p>
                <img
                  src={`${BACKEND_URL}/uploads/${editingProduct.featuredImageUrl}`}
                  alt="Current thumbnail"
                  className="mt-2 max-w-xs rounded shadow"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Pricing Model *
              </label>
              <select
                value={pricingModel}
                onChange={(e) => {
                  const value = e.target.value;
                  setPricingModel(value);
                  if (value === "free")
                    setFormData({ ...formData, price: "0" });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="paid">Paid</option>
                <option value="free">Free</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Price (£) {pricingModel === "paid" ? "*" : "(Free)"}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                disabled={pricingModel === "free"}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                required={pricingModel === "paid"}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Upload Digital Product directly (optional – PDF, ZIP, etc.)
            </label>
            <input
              type="file"
              onChange={(e) =>
                setFormData({ ...formData, file: e.target.files[0] || null })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
            />
            {editingProduct?.fileUrl && !formData.file && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Current file attached:</p>
                <a
                  href={`${BACKEND_URL}/uploads/${editingProduct.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  View/Download Current File
                </a>
              </div>
            )}
          </div>

          <div className="border-t pt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Curriculum (Upload File Manually)
            </h3>

            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <h4 className="text-xl font-semibold mb-4">Add New Topic</h4>
              <input
                type="text"
                placeholder="Topic Title *"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <textarea
                placeholder="Topic Summary (optional)"
                value={newTopicSummary}
                onChange={(e) => setNewTopicSummary(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={handleAddTopic}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Add Topic
              </button>
            </div>

            {curriculum.length > 0 && (
              <div className="mb-8">
                <h4 className="text-xl font-semibold mb-4">Topics</h4>
                <div className="flex flex-wrap gap-3">
                  {curriculum.map((topic, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentTopicIndex(index)}
                      className={`px-5 py-3 rounded-full font-medium transition-all hover:shadow-md ${
                        currentTopicIndex === index
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                    >
                      {topic.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentTopicIndex !== -1 && (
              <div className="p-6 bg-gray-50 rounded-xl">
                <h4 className="text-xl font-semibold mb-4">
                  Lessons for: {curriculum[currentTopicIndex].title}
                </h4>

                {curriculum[currentTopicIndex].lessons.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-lg font-medium mb-2">
                      Existing Lessons:
                    </h5>
                    <ul className="list-disc pl-6 space-y-1">
                      {curriculum[currentTopicIndex].lessons.map(
                        (lesson, idx) => (
                          <li key={idx} className="text-gray-700">
                            {lesson.name}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                <h5 className="text-lg font-medium mb-4">Add New Lesson</h5>
                <input
                  type="text"
                  placeholder="Lesson Name *"
                  value={newLessonName}
                  onChange={(e) => setNewLessonName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Lesson Content *
                  </label>
                  <ReactQuill
                    value={newLessonContent}
                    onChange={setNewLessonContent}
                    theme="snow"
                    className="bg-white rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddLesson}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Add Lesson
                </button>
              </div>
            )}
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-lg py-4 px-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {editingProduct ? "Update Product" : "Add Product"}
            </button>

            {editingProduct && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-8 rounded-lg transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Overview (attract & inform students)
            </label>
            <ReactQuill
              value={overview}
              onChange={setOverview}
              theme="snow"
              className="bg-white rounded-lg"
            />
          </div>
        </form>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Your Digital Products
        </h2>

        {products.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-md text-center text-gray-600">
            No products created yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                {product.featuredImageUrl && (
                  <img
                    src={`${BACKEND_URL}/uploads/${product.featuredImageUrl}`}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h3>
                <p className="text-gray-600 mb-2 font-medium">
                  {product.pricingModel === "free"
                    ? "Free"
                    : `£${product.price?.toFixed(2) || "0.00"}`}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  Category: {product.category}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Last Updated:{" "}
                  {new Date(product.updatedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

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
      </section>

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
