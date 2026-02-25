import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const StudentProductPreview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false); // ← NEW: download loading state

  useEffect(() => {
    if (!state?.orderId) {
      setError("No product selected");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(
          `${BACKEND_URL}/api/orders/${state.orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setOrder(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [state?.orderId, navigate]);

  const handleDownload = async () => {
    if (!order?.productId?._id) return;

    setIsDownloading(true); // ← Start loading

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
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.msg || "Download failed");
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
      console.error("Download error:", err);
      alert(err.message || "Could not download file. Contact support.");
    } finally {
      setIsDownloading(false); // ← Stop loading (success or error)
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-red-600 mb-6">
            {error || "Product not found"}
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 text-lg font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const product = order.productId;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 p-10 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {product.title}
          </h1>
          <div className="inline-block bg-white/20 backdrop-blur-sm px-8 py-3 rounded-full text-2xl font-semibold">
            {order.amount === 0
              ? "Free Access"
              : `£${order.amount?.toFixed(2) || "0.00"}`}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          {product.featuredImageUrl && (
            <div className="mb-12 flex justify-center">
              <img
                src={`${product.featuredImageUrl}?tr=w-1200,q-85,f-webp`}
                alt={product.title}
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/1200x800?text=Image+Not+Available";
                }}
              />
            </div>
          )}

          {product.overview && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why You’ll Love This
              </h2>
              <div
                className="prose prose-emerald prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.overview }}
              />
            </div>
          )}

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About This Product
            </h2>
            <div
              className="prose prose-emerald prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          {product.curriculum?.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center md:text-left">
                What’s Inside
              </h2>
              <div className="space-y-10">
                {product.curriculum.map((item, index) => (
                  <div
                    key={index}
                    className="border-l-5 border-emerald-600 pl-6 py-6 bg-emerald-50/40 rounded-r-xl"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {item.title}
                    </h3>
                    {item.summary && (
                      <p className="text-gray-600 italic mb-5 text-lg">
                        {item.summary}
                      </p>
                    )}
                    <div
                      className="prose prose-emerald prose-lg max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: item.content || "" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download Section */}
          <div className="mt-12 p-10 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-emerald-800 mb-8">
              Your Product is Ready
            </h3>

            <div className="flex flex-col items-center gap-8 max-w-md mx-auto">
              {product.fileUrl ? (
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={`inline-flex items-center justify-center text-white font-semibold py-5 px-12 rounded-xl transition-all text-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 w-full ${
                    isDownloading
                      ? "bg-emerald-400 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <svg
                        className="animate-spin h-6 w-6 mr-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Downloading product file...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-7 h-7 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download Product File
                    </>
                  )}
                </button>
              ) : (
                <p className="text-yellow-800 font-medium text-xl bg-yellow-100 p-5 rounded-xl w-full">
                  No downloadable file attached yet – contact support
                </p>
              )}

              {order.receiptUrl && (
                <a
                  href={order.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-900 font-medium underline text-lg"
                >
                  View Receipt →
                </a>
              )}
            </div>

            <p className="mt-10 text-gray-600 italic text-base">
              Thank you for your{" "}
              {order.amount === 0 ? "free claim" : "purchase"}!
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="p-8 border-t border-gray-200 text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-700 hover:bg-gray-800 text-white font-medium py-4 px-12 rounded-xl transition-colors text-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProductPreview;
