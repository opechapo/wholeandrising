import { useLocation, useNavigate } from "react-router-dom";

const ProductPreview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-red-600 mb-6">
            No Product Selected
          </h1>
          <button
            onClick={() => navigate("/admin")}
            className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 text-lg font-medium"
          >
            Back to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  const product = state.product;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 p-10 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {product.title}
          </h1>
          <div className="inline-block bg-white/20 backdrop-blur-sm px-8 py-3 rounded-full text-2xl font-semibold">
            {product.pricingModel === "free"
              ? "Free Access"
              : `£${product.price?.toFixed(2) || "0.00"}`}
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

          {/* Curriculum – already visible in preview */}
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

          {/* Student-facing download area – matches dashboard style */}
          <div className="mt-12 p-10 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-emerald-800 mb-8">
              After Access Granted – Student Experience
            </h3>

            <div className="flex flex-col items-center gap-8 max-w-md mx-auto">
              {product.fileUrl ? (
                <a
                  href={product.fileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-5 px-12 rounded-xl transition-all text-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 w-full"
                >
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
                </a>
              ) : (
                <p className="text-yellow-800 font-medium text-xl bg-yellow-100 p-5 rounded-xl w-full">
                  No downloadable file attached yet
                </p>
              )}

              <button
                disabled
                className="bg-gray-300 text-gray-700 font-medium py-5 px-12 rounded-xl opacity-70 cursor-not-allowed text-xl w-full"
              >
                View Receipt (available after real purchase)
              </button>
            </div>

            <p className="mt-10 text-gray-600 italic text-base">
              This is exactly what a student sees after successful access (free
              or paid).
            </p>
          </div>
        </div>

        {/* Back */}
        <div className="p-8 border-t border-gray-200 text-center">
          <button
            onClick={() => navigate("/admin")}
            className="bg-gray-700 hover:bg-gray-800 text-white font-medium py-4 px-12 rounded-xl transition-colors text-lg"
          >
            Back to Admin Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
