import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../Components/ProductCard";

const categories = {
  ebooks: "📘 E-Books & Guides",
  workbooks: "🗂️ Workbooks, Journals, Templates & Printable Tools",
  conversation: "💬 Conversation & Connection Tools/Relationship Essentials",
  courses: "🎓 Courses",
};

const BACKEND_URL = "https://wholeandrisingbacknd-7uns.onrender.com";

const DigitalProducts = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BACKEND_URL}/api/products`);

        // Safeguard: make sure we always get an array
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.products || [];

        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Could not load digital products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filtered = category
    ? products.filter((p) => p.category === category)
    : products;

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-xl text-gray-600">Loading digital products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Digital Products
      </h1>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {Object.keys(categories).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`
              px-6 py-3 rounded-full font-medium transition-all
              ${
                category === cat
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            {categories[cat]}
          </button>
        ))}
        <button
          onClick={() => setCategory("")}
          className={`
            px-6 py-3 rounded-full font-medium transition-all
            ${
              category === ""
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
          `}
        >
          All Products
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-xl">
          No products found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DigitalProducts;
