import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import ProductCard from "../Components/ProductCard";

const categories = {
  ebooks: "📘 E-Books & Guides",
  workbooks: "🗂️ Workbooks, Journals, Templates & Printable Tools",
  conversation: "💬 Conversation & Connection Tools/Relationship Essentials",
  courses: "🎓 Courses",
};

const BACKEND_URL = "https://wholeandrisingbacknd-7uns.onrender.com";

// Cache settings
const CACHE_KEY = "digital_products_cache_v1";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const DigitalProducts = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── CACHE HELPERS ────────────────────────────────────────────────
  const getCachedProducts = () => {
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

  const setCachedProducts = (data) => {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now() }),
      );
    } catch {}
  };

  // ─── FETCH WITH CACHE ─────────────────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      // Try cache first
      const cached = getCachedProducts();
      if (cached) {
        setProducts(cached);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${BACKEND_URL}/api/products`);

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.products || [];

        setProducts(data);
        setCachedProducts(data); // cache it
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Could not load digital products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Memoized filtered products (small perf gain)
  const filteredProducts = useMemo(() => {
    return category
      ? products.filter((p) => p.category === category)
      : products;
  }, [products, category]);

  // ─── SKELETON LOADER ──────────────────────────────────────────────
  const SkeletonProduct = () => (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden animate-pulse">
      <div className="w-full h-64 bg-gray-200"></div>
      <div className="p-5">
        <div className="h-6 bg-gray-200 rounded w-4/5 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-3/5 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/5"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 mb-32 md:mb-40 lg:mb-48">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Digital Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {[...Array(8)].map((_, i) => (
            <SkeletonProduct key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 text-center mb-32 md:mb-40 lg:mb-48">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Digital Products
        </h1>
        <p className="text-xl text-red-600 mb-6">{error}</p>
        <button
          onClick={() => {
            localStorage.removeItem(CACHE_KEY);
            window.location.reload();
          }}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 mb-32 md:mb-40 lg:mb-48">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Digital Products
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <button
          onClick={() => setCategory("")}
          className={`
            px-6 py-3 rounded-full font-medium transition-all
            ${category === "" ? "bg-green-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
          `}
        >
          All Products
        </button>

        {Object.keys(categories).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`
              px-6 py-3 rounded-full font-medium transition-all
              ${category === cat ? "bg-green-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
            `}
          >
            {categories[cat]}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-xl mb-24 md:mb-32">
          No products found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 pb-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DigitalProducts;
