import { useState } from "react";
import axios from "axios";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

const BACKEND_URL = "https://wholeandrisingbacknd-7uns.onrender.com";

const ProductCard = ({ product }) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const [email, setEmail] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null); // "success" | "error"
  const [showModal, setShowModal] = useState(false);

  const handleFreeAccess = async () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/payments/create-order`,
        { productId: product._id },
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
        alert("Access granted! Check your dashboard for download.");
        setPaymentStatus("success");
        setShowModal(false); // close modal on success
      }
    } catch (err) {
      console.error("Free access error:", err);
      alert(err.response?.data?.msg || "Error processing free product");
      setPaymentStatus("error");
    }
  };

  const openModal = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setPaymentStatus(null);
  };

  return (
    <>
      {/* Card – clickable on hover */}
      <div
        className={`
          bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col
          transition-all duration-400 cursor-pointer group relative
          hover:shadow-2xl hover:scale-[1.03]
          w-full max-w-md md:max-w-lg lg:max-w-xl
        `}
        onClick={openModal}
      >
        {/* Featured Image with hover effect */}
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

        {/* Minimal info on card (collapsed view) */}
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
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-800 text-3xl"
            >
              ×
            </button>

            <div className="p-6 md:p-10">
              {/* Header */}
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-6">
                {product.title}
              </h2>

              {/* Price tag */}
              <div className="mb-8">
                <span className="inline-block bg-emerald-100 text-emerald-800 text-xl md:text-2xl font-bold px-6 py-3 rounded-full">
                  {product.pricingModel === "free"
                    ? "Free Access"
                    : `£${product.price?.toFixed(2) || "0.00"}`}
                </span>
              </div>

              {/* Featured image in modal – now shows FULL image */}
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

              {/* Overview / Why you need this */}
              {product.overview && (
                <div className="mb-10">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Why You’ll Love This
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {product.overview}
                  </p>
                </div>
              )}

              {/* Description */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  About This Product
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Curriculum / Outline */}
              {product.curriculum?.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    What’s Inside
                  </h3>
                  <div className="space-y-6">
                    {product.curriculum.map((item, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-emerald-500 pl-5"
                      >
                        <h4 className="text-xl font-bold text-gray-800">
                          {item.title}
                        </h4>
                        {item.summary && (
                          <p className="text-gray-600 mt-1">{item.summary}</p>
                        )}
                        {item.content && (
                          <p className="text-gray-700 mt-2">{item.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment / Action Area */}
              <div className="border-t border-gray-200 pt-10 mt-10">
                {product.pricingModel === "free" ? (
                  <div>
                    <input
                      type="email"
                      placeholder="Your email for receipt & access"
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
                      disabled={!email.trim()}
                      className="
                        w-full bg-emerald-600 text-white py-4 px-8 rounded-xl
                        text-xl font-semibold hover:bg-emerald-700 transition-colors
                        disabled:opacity-50 disabled:cursor-not-allowed
                        shadow-md hover:shadow-lg
                      "
                    >
                      Get Free Access
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    {paymentStatus === "success" ? (
                      <div className="text-emerald-600 text-2xl font-bold mb-6">
                        Purchase Complete! Check your dashboard.
                      </div>
                    ) : paymentStatus === "error" ? (
                      <div className="text-red-600 text-xl mb-6">
                        Something went wrong — please try again
                      </div>
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                          Complete Your Purchase
                        </h3>

                        {isPending ? (
                          <p className="text-gray-600 mb-6">
                            Loading PayPal...
                          </p>
                        ) : (
                          <PayPalButtons
                            style={{
                              layout: "vertical",
                              color: "gold",
                              shape: "rect",
                              label: "paypal",
                            }}
                            createOrder={async (data, actions) => {
                              try {
                                const res = await axios.post(
                                  `${BACKEND_URL}/api/payments/create-order`,
                                  { productId: product._id },
                                  {
                                    headers: {
                                      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                                      "Content-Type": "application/json",
                                    },
                                  },
                                );

                                if (res.data.status === "free") {
                                  alert("Free product! Check dashboard.");
                                  setPaymentStatus("success");
                                  return null;
                                }

                                return res.data.id;
                              } catch (err) {
                                console.error("Create order failed:", err);
                                alert("Could not start PayPal payment");
                                throw err;
                              }
                            }}
                            onApprove={async (data, actions) => {
                              try {
                                const res = await axios.post(
                                  `${BACKEND_URL}/api/payments/capture-order`,
                                  {
                                    orderID: data.orderID,
                                    productId: product._id,
                                  },
                                  {
                                    headers: {
                                      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                                      "Content-Type": "application/json",
                                    },
                                  },
                                );

                                setPaymentStatus("success");
                                alert(
                                  "Payment successful! Check your dashboard for download.",
                                );
                              } catch (err) {
                                console.error("Capture failed:", err);
                                setPaymentStatus("error");
                                alert(
                                  "Payment capture failed — please contact support",
                                );
                              }
                            }}
                            onCancel={() => alert("Payment cancelled")}
                            onError={(err) => {
                              console.error("PayPal error:", err);
                              setPaymentStatus("error");
                              alert("An error occurred with PayPal");
                            }}
                          />
                        )}

                        {/* Placeholder for future card payment */}
                        <p className="text-gray-500 mt-6 text-sm">
                          {/* Debit / Credit Card payment coming soon (via PayPal) */}
                        </p>
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
