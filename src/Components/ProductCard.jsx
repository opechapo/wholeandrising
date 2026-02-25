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

  const token = localStorage.getItem("token"); // read once

  const getHeaders = () => {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  const handleFreeAccess = async () => {
    if (!email.trim()) {
      alert("Please enter your email to claim this free product");
      return;
    }

    setLoadingPayment(true);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/payments/create-order`,
        { productId: product._id, email: email.trim() },
        { headers: getHeaders() },
      );

      if (
        res.data.status === "free" ||
        res.data.status === "already_accessed"
      ) {
        setPaymentStatus("success");
        alert(res.data.msg || "Free product claimed! Check your email.");
      }
    } catch (err) {
      console.error("Free access error:", err);
      alert(err.response?.data?.msg || "Error claiming free product");
      setPaymentStatus("error");
    } finally {
      setLoadingPayment(false);
    }
  };

  const handlePaidCheckout = async () => {
    if (!email.trim()) {
      alert("Please enter your email to complete purchase");
      return;
    }

    setLoadingPayment(true);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/payments/create-checkout-session`,
        { productId: product._id, email: email.trim() },
        { headers: getHeaders() },
      );

      const { url } = res.data;

      if (!url) {
        throw new Error("No checkout URL returned from server");
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
    setPaymentStatus(null);
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
        {/* ... rest of card JSX unchanged ... */}
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

              {/* ... image, overview, description unchanged ... */}

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
                          A download link has been sent to{" "}
                          <strong>{email}</strong>.
                          <br />
                          Check your inbox (and spam folder).
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
                          placeholder="Your email (required)"
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
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                      Ready to Purchase
                    </h3>
                    <p className="text-gray-700 text-lg mb-6">
                      Enter your email (used for receipt & access)
                    </p>

                    <input
                      type="email"
                      placeholder="Your email (required)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="
                        border border-gray-300 p-4 w-full mb-6 rounded-xl
                        text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                      "
                      required
                    />

                    {paymentStatus === "error" && (
                      <p className="text-red-600 mb-4">
                        Something went wrong – please try again
                      </p>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePaidCheckout();
                      }}
                      disabled={loadingPayment || !email.trim()}
                      className={`
                        w-full bg-emerald-600 text-white py-4 px-8 rounded-xl
                        text-xl font-semibold hover:bg-emerald-700 transition-colors
                        disabled:opacity-50 disabled:cursor-not-allowed
                        shadow-md hover:shadow-lg flex items-center justify-center gap-2
                      `}
                    >
                      {loadingPayment ? "Redirecting..." : "Pay with Stripe"}
                    </button>
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
