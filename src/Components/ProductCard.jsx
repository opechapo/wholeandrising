import { useState } from "react";
import axios from "axios";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://wholeandrisingbacknd-7uns.onrender.com";

const ProductCard = ({ product }) => {
  const [email, setEmail] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const handleFreeAccess = async () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    setLoadingPayment(true);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/payments/create-order`,
        { productId: product._id, email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (
        res.data.status === "free" ||
        res.data.status === "already_accessed"
      ) {
        setPaymentStatus("success");
        // Do NOT close modal immediately — let user read the message
      }
    } catch (err) {
      console.error("Free access error:", err);
      alert(err.response?.data?.msg || "Error processing free product");
      setPaymentStatus("error");
    } finally {
      setLoadingPayment(false);
    }
  };

  const handlePaidCheckout = async () => {
    setLoadingPayment(true);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/payments/create-checkout-session`,
        { productId: product._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            "Content-Type": "application/json",
          },
        },
      );

      const { url } = res.data;

      if (!url) {
        throw new Error("No checkout URL returned from backend");
      }

      window.location.href = url;
    } catch (err) {
      console.error("Checkout initiation failed:", err);
      alert(
        err.response?.data?.msg ||
          err.message ||
          "Could not start payment – please try again",
      );
      setPaymentStatus("error");
    } finally {
      setLoadingPayment(false);
    }
  };

  const openModal = (e) => {
    e.stopPropagation();
    setShowModal(true);
    setPaymentStatus(null); // reset on open
  };

  const closeModal = () => {
    setShowModal(false);
    setPaymentStatus(null);
    setEmail("");
  };

  return (
    <>
      {/* Product Card – clickable preview */}
      <div
        className={`
          bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col
          transition-all duration-400 cursor-pointer group relative
          hover:shadow-2xl hover:scale-[1.03]
          w-full max-w-md md:max-w-lg lg:max-w-xl
        `}
        onClick={openModal}
      >
        <div className="relative overflow-hidden">
          {product.featuredImageUrl ? (
            <img
              src={`${product.featuredImageUrl}?tr=w-600,h-900,q-80,f-webp`}
              alt={product.title}
              className="
                w-full h-96 md:h-[28rem] lg:h-[32rem]
                object-cover transition-all duration-700
                group-hover:scale-110 group-hover:brightness-110
              "
              onError={(e) => {
                e.target.src = "https://placehold.co/600x900?text=No+Image";
                e.target.alt = "Image not available";
              }}
            />
          ) : (
            <div className="w-full h-96 md:h-[28rem] lg:h-[32rem] bg-gray-100 flex items-center justify-center text-gray-500 text-xl">
              No image available
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-6 md:p-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
              {product.title}
            </h3>
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col flex-grow">
          <p className="text-gray-600 mb-4 line-clamp-3 text-base md:text-lg">
            {product.description}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <p className="text-emerald-600 text-xl md:text-2xl font-extrabold">
              {product.pricingModel === "free"
                ? "Free"
                : `£${product.price?.toFixed(2) || "0.00"}`}
            </p>
            <span className="text-sm text-gray-500">Click to view details</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-800 text-3xl"
            >
              ×
            </button>

            <div className="p-6 md:p-10">
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-6">
                {product.title}
              </h2>

              <div className="mb-8">
                <span className="inline-block bg-emerald-100 text-emerald-800 text-xl md:text-2xl font-bold px-6 py-3 rounded-full">
                  {product.pricingModel === "free"
                    ? "Free Access"
                    : `£${product.price?.toFixed(2) || "0.00"}`}
                </span>
              </div>

              {product.featuredImageUrl && (
                <div className="mb-10 flex justify-center">
                  <img
                    src={`${product.featuredImageUrl}?tr=w-1200,q-85,f-webp`}
                    alt={product.title}
                    className="
                      max-w-full max-h-[70vh] 
                      object-contain 
                      rounded-xl 
                      shadow-lg
                      mx-auto
                    "
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/1200x800?text=Image+Not+Available";
                    }}
                  />
                </div>
              )}

              {product.overview && (
                <div className="mb-10">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Why You’ll Love This
                  </h3>
                  <div
                    className="prose prose-emerald max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.overview }}
                  />
                </div>
              )}

              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  About This Product
                </h3>
                <div
                  className="prose prose-emerald max-w-none text-gray-700 leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>

              {/* Payment / Action Area */}
              <div className="border-t border-gray-200 pt-10 mt-10">
                {product.pricingModel === "free" ? (
                  <div className="text-center py-6">
                    {paymentStatus === "success" ? (
                      <div className="space-y-6">
                        <div className="text-emerald-600 text-2xl font-bold">
                          Success! Free access granted
                        </div>
                        <p className="text-gray-700 text-lg">
                          Go to your <strong>Student Dashboard</strong> to
                          download the file.
                          <br />
                          (You may need to refresh the page if it doesn't appear
                          yet)
                        </p>
                        <button
                          onClick={closeModal}
                          className="bg-gray-700 text-white py-3 px-8 rounded-xl hover:bg-gray-800 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                          Get Free Access
                        </h3>
                        <input
                          type="email"
                          placeholder="Your email (for confirmation)"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="
                            border border-gray-300 p-4 w-full mb-6 rounded-xl
                            text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                          "
                          required
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFreeAccess();
                          }}
                          disabled={!email.trim() || loadingPayment}
                          className="
                            w-full bg-emerald-600 text-white py-4 px-8 rounded-xl
                            text-xl font-semibold hover:bg-emerald-700 transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed
                            shadow-md hover:shadow-lg
                          "
                        >
                          {loadingPayment
                            ? "Processing..."
                            : "Claim Free Access"}
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    {paymentStatus === "success" ? (
                      <div className="text-emerald-600 text-2xl font-bold mb-6">
                        Access granted! Check your dashboard.
                      </div>
                    ) : paymentStatus === "error" ? (
                      <div className="text-red-600 text-xl mb-6">
                        Something went wrong — please try again
                      </div>
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                          Ready to Purchase
                        </h3>
                        <p className="text-gray-700 text-lg mb-8">
                          You'll be securely redirected to Stripe to complete
                          payment.
                        </p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePaidCheckout();
                          }}
                          disabled={loadingPayment}
                          className={`
                            w-full bg-emerald-600 text-white py-4 px-8 rounded-xl
                            text-xl font-semibold hover:bg-emerald-700 transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed
                            shadow-md hover:shadow-lg flex items-center justify-center gap-2
                          `}
                        >
                          {loadingPayment
                            ? "Redirecting..."
                            : "Pay with Stripe"}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
