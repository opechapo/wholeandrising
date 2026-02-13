import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const BACKEND_URL = "https://wholeandrisingbacknd-7uns.onrender.com";

// Cache settings
const CACHE_KEY = "admin_dashboard_cache_v1";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("add-product");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [error, setError] = useState(null);
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
  const [newTopicContent, setNewTopicContent] = useState("");
  const [currentTopicIndex, setCurrentTopicIndex] = useState(-1);
  const [editingTopicContent, setEditingTopicContent] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const navigate = useNavigate();

  const getCachedData = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > CACHE_TTL) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  };

  const setCachedData = (data) => {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now() }),
      );
    } catch {}
  };

  const fetchData = async (forceRefresh = false) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    if (!forceRefresh) {
      const cached = getCachedData();
      if (cached) {
        setProducts(cached.products || []);
        setOrders(cached.orders || []);
        setAnalytics(cached.analytics || {});
        setLoadingProducts(false);
        setLoadingOrders(false);
        setLoadingAnalytics(false);
        return;
      }
    }

    try {
      setLoadingProducts(true);
      setLoadingOrders(true);
      setLoadingAnalytics(true);
      setError(null);

      const promises = [
        axios
          .get(`${BACKEND_URL}/api/products`, config)
          .catch(() => ({ data: [] })),
        axios
          .get(`${BACKEND_URL}/api/orders`, config)
          .catch(() => ({ data: [] })),
        axios
          .get(`${BACKEND_URL}/api/orders/analytics`, config)
          .catch(() => ({ data: {} })),
      ];

      const [productsRes, ordersRes, analyticsRes] =
        await Promise.all(promises);

      const newData = {
        products: productsRes.data,
        orders: ordersRes.data,
        analytics: analyticsRes.data,
      };

      setProducts(newData.products);
      setOrders(newData.orders);
      setAnalytics(newData.analytics);

      setCachedData(newData);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to load some dashboard data. Please try again.");
      }
    } finally {
      setLoadingProducts(false);
      setLoadingOrders(false);
      setLoadingAnalytics(false);
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
    setNewTopicContent("");
    setCurrentTopicIndex(-1);
    setEditingTopicContent("");
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
        content: newTopicContent,
      },
    ]);
    setNewTopicTitle("");
    setNewTopicSummary("");
    setNewTopicContent("");
  };

  const handleSaveTopicContent = () => {
    if (currentTopicIndex === -1) return;
    const updated = [...curriculum];
    updated[currentTopicIndex].content = editingTopicContent;
    setCurriculum(updated);
    setCurrentTopicIndex(-1);
    setEditingTopicContent("");
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

    setIsSubmitting(true);

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
      fetchData(true);
    } catch (err) {
      console.error("Product save error:", err);
      if (err.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert(
          (editingProduct ? "Update" : "Add") +
            " error: " +
            (err.response?.data?.msg || "Unknown error"),
        );
      }
    } finally {
      setIsSubmitting(false);
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
    setEditingTopicContent("");

    // ← This line was added / fixed
    setActiveSection("add-product");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.delete(`${BACKEND_URL}/api/products/${id}`, config);
      alert("Product deleted successfully!");
      fetchData(true);
    } catch (err) {
      console.error("Delete error:", err);
      if (err.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert(
          "Error deleting product: " +
            (err.response?.data?.msg || "Unknown error"),
        );
      }
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);
    setPasswordError(null);

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);

    const token = localStorage.getItem("token");

    try {
      const res = await axios.patch(
        `${BACKEND_URL}/api/auth/password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setPasswordMessage(res.data.msg || "Password updated successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      console.error("Password change failed:", err);
      if (err.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        const msg =
          err.response?.data?.msg || "Failed to change password. Try again.";
        setPasswordError(msg);
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 animate-pulse">
      <div className="w-full h-48 bg-gray-200 rounded-t-lg mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
  );

  const SkeletonOrder = () => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen fixed">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-green-400">Admin Panel</h2>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "add-product", label: "Add / Edit Product" },
            { id: "products-list", label: "Products List" },
            { id: "orders", label: "Recent Orders" },
            { id: "analytics", label: "Analytics" },
            { id: "change-password", label: "Change Password" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left px-5 py-3 rounded-lg transition-colors ${
                activeSection === item.id
                  ? "bg-green-600 text-white"
                  : "hover:bg-gray-800"
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-6 mt-4 border-t border-gray-700">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/login");
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-5 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8">
        {/* Add / Edit Product */}
        {activeSection === "add-product" && (
          <section className="max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
              {editingProduct
                ? `Edit Product: ${editingProduct.title}`
                : "Add New Digital Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
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
                  disabled={isSubmitting}
                />
              </div>

              {/* Featured Image */}
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
                  disabled={isSubmitting}
                />
                {editingProduct?.featuredImageUrl &&
                  !formData.featuredImage && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">Current:</p>
                      <img
                        src={`${editingProduct.featuredImageUrl}?tr=w-300,h-300,q-85,f-webp`}
                        alt="Current thumbnail"
                        className="mt-2 max-w-xs rounded shadow"
                      />
                    </div>
                  )}
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Pricing Model *
                  </label>
                  <select
                    value={pricingModel}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPricingModel(val);
                      if (val === "free")
                        setFormData({ ...formData, price: "0" });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    disabled={isSubmitting}
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
                    disabled={pricingModel === "free" || isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    required={pricingModel === "paid"}
                  />
                </div>
              </div>

              {/* Description */}
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
                  disabled={isSubmitting}
                />
              </div>

              {/* Category */}
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
                  disabled={isSubmitting}
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

              {/* Curriculum */}
              <div className="border-t pt-10">
                <h3 className="text-2xl font-bold text-gray-800 mb-8">
                  Curriculum Content
                </h3>

                <div className="bg-gray-50 p-8 rounded-2xl mb-10">
                  <h4 className="text-xl font-semibold mb-6">Add New Topic</h4>
                  <input
                    type="text"
                    placeholder="Topic Title *"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl mb-5 focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isSubmitting}
                  />
                  <textarea
                    placeholder="Topic Summary (optional)"
                    value={newTopicSummary}
                    onChange={(e) => setNewTopicSummary(e.target.value)}
                    rows={3}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isSubmitting}
                  />
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-3">
                      Topic Content
                    </label>
                    <ReactQuill
                      value={newTopicContent}
                      onChange={setNewTopicContent}
                      theme="snow"
                      className="bg-white rounded-xl"
                      readOnly={isSubmitting}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTopic}
                    disabled={isSubmitting}
                    className={`bg-green-600 text-white font-medium py-3 px-8 rounded-xl transition-colors ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-green-700"
                    }`}
                  >
                    Add Topic
                  </button>
                </div>

                {curriculum.length > 0 && (
                  <div>
                    <h4 className="text-xl font-semibold mb-6">Your Topics</h4>
                    <div className="flex flex-wrap gap-4 mb-10">
                      {curriculum.map((topic, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setCurrentTopicIndex(index);
                            setEditingTopicContent(topic.content || "");
                          }}
                          disabled={isSubmitting}
                          className={`px-6 py-3 rounded-full font-medium transition-all ${
                            currentTopicIndex === index
                              ? "bg-green-600 text-white shadow-md"
                              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {topic.title}
                        </button>
                      ))}
                    </div>

                    {currentTopicIndex !== -1 && (
                      <div className="bg-gray-50 p-8 rounded-2xl">
                        <h4 className="text-xl font-semibold mb-6">
                          Edit Content: {curriculum[currentTopicIndex].title}
                        </h4>
                        <ReactQuill
                          value={editingTopicContent}
                          onChange={setEditingTopicContent}
                          theme="snow"
                          className="bg-white rounded-xl mb-6"
                          readOnly={isSubmitting}
                        />
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={handleSaveTopicContent}
                            disabled={isSubmitting}
                            className={`bg-green-600 text-white font-medium py-3 px-8 rounded-xl transition-colors ${
                              isSubmitting
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-green-700"
                            }`}
                          >
                            Save Content
                          </button>
                          <button
                            type="button"
                            onClick={() => setCurrentTopicIndex(-1)}
                            disabled={isSubmitting}
                            className={`bg-gray-400 text-white font-medium py-3 px-8 rounded-xl transition-colors ${
                              isSubmitting
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-gray-500"
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Overview */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Overview (attract & inform students)
                </label>
                <ReactQuill
                  value={overview}
                  onChange={setOverview}
                  theme="snow"
                  className="bg-white rounded-xl"
                  readOnly={isSubmitting}
                />
              </div>

              {/* Submit */}
              <div className="pt-8 flex gap-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 font-semibold text-lg py-4 px-10 rounded-xl transition-all shadow-md ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-green-600 hover:bg-green-700 text-white hover:shadow-lg"
                  }`}
                >
                  {isSubmitting
                    ? editingProduct
                      ? "Updating Product..."
                      : "Adding Product..."
                    : editingProduct
                      ? "Update Product"
                      : "Add Product"}
                </button>

                {editingProduct && (
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={isSubmitting}
                    className={`flex-1 font-medium py-4 px-10 rounded-xl transition-colors ${
                      isSubmitting
                        ? "bg-gray-300 cursor-not-allowed text-gray-600"
                        : "bg-gray-500 hover:bg-gray-600 text-white"
                    }`}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        {/* Products List */}
        {activeSection === "products-list" && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-10">
              Your Digital Products
            </h2>

            {loadingProducts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-md text-center text-gray-600">
                No products created yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all"
                  >
                    {product.featuredImageUrl ? (
                      <img
                        src={`${product.featuredImageUrl}?tr=w-600,h-900,q-80,f-webp`}
                        alt={product.title}
                        className="w-full h-48 object-cover rounded-t-lg mb-4"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded-t-lg mb-4">
                        No image
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                    <p className="text-gray-600 mb-2 font-medium">
                      {product.pricingModel === "free"
                        ? "Free"
                        : `£${product.price?.toFixed(2) || "0.00"}`}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      Category: {product.category}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Updated:{" "}
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(product);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(product._id);
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Orders */}
        {activeSection === "orders" && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-10">
              Recent Orders (All Users)
            </h2>

            {loadingOrders ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[...Array(4)].map((_, i) => (
                  <SkeletonOrder key={i} />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-md text-center text-gray-600">
                No orders yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-xl font-bold mb-4">
                      {order.productId?.title || "Unknown Product"}
                    </h3>
                    <div className="space-y-2 text-gray-700">
                      <p>
                        <span className="font-medium">Buyer:</span>{" "}
                        {order.userEmail || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Amount:</span>{" "}
                        {order.amount === 0
                          ? "Free"
                          : `£${order.amount?.toFixed(2)}`}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        <span
                          className={
                            order.status === "paid"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }
                        >
                          {order.status?.charAt(0).toUpperCase() +
                            order.status?.slice(1)}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                      {order.receiptUrl && (
                        <a
                          href={order.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 font-medium inline-block mt-2"
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
        )}

        {/* Analytics */}
        {activeSection === "analytics" && (
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingAnalytics ? (
              <>
                <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-12 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-12 bg-gray-200 rounded w-1/2"></div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Total Orders
                  </h3>
                  <p className="text-5xl font-extrabold text-green-600">
                    {analytics.totalOrders || 0}
                  </p>
                </div>

                <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Total Enrollments
                  </h3>
                  <p className="text-5xl font-extrabold text-green-600">
                    {analytics.totalEnrollments || 0}
                  </p>
                </div>
              </>
            )}
          </section>
        )}

        {/* Change Password */}
        {activeSection === "change-password" && (
          <section className="max-w-lg mx-auto bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Change Admin Password
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  autoComplete="current-password"
                  disabled={changingPassword}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  autoComplete="new-password"
                  disabled={changingPassword}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmNewPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmNewPassword: e.target.value,
                    })
                  }
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  autoComplete="new-password"
                  disabled={changingPassword}
                />
              </div>

              {passwordError && (
                <p className="text-red-600 font-medium">{passwordError}</p>
              )}
              {passwordMessage && (
                <p className="text-green-600 font-medium">{passwordMessage}</p>
              )}

              <button
                type="submit"
                disabled={changingPassword}
                className={`w-full py-4 px-8 rounded-xl font-semibold text-white transition-colors ${
                  changingPassword
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {changingPassword ? "Updating..." : "Change Password"}
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
