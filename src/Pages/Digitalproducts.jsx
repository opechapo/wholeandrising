import { useState } from "react";
import axios from "axios";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

const BACKEND_URL = "https://wholeandrisingbacknd-7uns.onrender.com";

const ProductCard = ({ product }) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const [email, setEmail] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // "success" | "error"

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
          },
        },
      );

      if (
        res.data.status === "free" ||
        res.data.status === "already_accessed"
      ) {
        alert("Access granted! Check your dashboard for download.");
        setPaymentStatus("success");
      }
    } catch (err) {
      console.error("Free access error:", err);
      alert(err.response?.data?.msg || "Error processing free product");
      setPaymentStatus("error");
    }
  };

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <div
      className={`
        bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col
        transition-all duration-400 cursor-pointer
        group relative
        hover:shadow-2xl hover:scale-[1.03]
        w-full max-w-md md:max-w-lg lg:max-w-xl
      `}
      onClick={toggleExpand}
    >
      {/* Featured Image */}
      <div className="relative">
        {product.featuredImageUrl ? (
          <img
            src={`${product.featuredImageUrl}?tr=w-600,h-900,q-80,f-webp`}
            alt={product.title}
            className="
              w-full h-96 md:h-[28rem] lg:h-[32rem]
              object-cover transition-transform duration-700
              group-hover:scale-105
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

      {/* Details & Payment */}
      <div
        className={`
          px-6 md:px-8 pb-8 md:pb-10 pt-6 flex flex-col flex-grow
          transition-all duration-400 ease-in-out
          ${isExpanded ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}
          md:group-hover:max-h-[700px] md:group-hover:opacity-100
          md:max-h-0 md:opacity-0
        `}
      >
        <p className="text-gray-700 mb-6 text-base md:text-lg line-clamp-5">
          {product.description}
        </p>

        <p className="text-green-600 text-3xl md:text-4xl font-extrabold mb-8">
          {product.pricingModel === "free"
            ? "Free"
            : `£${product.price?.toFixed(2) || "0.00"}`}
        </p>

        <input
          type="email"
          placeholder="Your email for receipt & access"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            border border-gray-300 p-4 w-full mb-6 rounded-xl
            text-base md:text-lg
            focus:outline-none focus:ring-2 focus:ring-green-500
            focus:border-green-500
          "
          required
        />

        {product.pricingModel === "free" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFreeAccess();
            }}
            disabled={!email.trim()}
            className="
              mt-auto bg-green-600 text-white py-4 px-8 rounded-xl
              text-lg md:text-xl font-semibold
              hover:bg-green-700 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-md hover:shadow-lg
            "
          >
            Get Free Access
          </button>
        ) : (
          <div className="mt-auto">
            {isPending ? (
              <p className="text-center text-gray-600">Loading PayPal...</p>
            ) : paymentStatus === "success" ? (
              <p className="text-center text-green-600 font-bold text-lg">
                Purchase Complete! Check your dashboard.
              </p>
            ) : paymentStatus === "error" ? (
              <p className="text-center text-red-600 font-medium">
                Something went wrong — please try again
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
                      // Free handled separately — shouldn't reach here
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
                    alert("Payment capture failed — please contact support");
                  }
                }}
                onCancel={() => {
                  alert("Payment cancelled");
                }}
                onError={(err) => {
                  console.error("PayPal error:", err);
                  setPaymentStatus("error");
                  alert("An error occurred with PayPal");
                }}
              />
            )}
          </div>
        )}
      </div>

      <div className="md:hidden text-center text-sm text-gray-500 py-3 bg-gray-50">
        Tap card to {isExpanded ? "hide" : "show"} details
      </div>
    </div>
  );
};

export default ProductCard;
