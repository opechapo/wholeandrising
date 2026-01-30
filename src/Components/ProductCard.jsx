import { useState } from "react";
import axios from "axios";
import { useStripe, useElements } from "@stripe/react-stripe-js";

const ProductCard = ({ product }) => {
  const [email, setEmail] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleBuy = async () => {
    if (!stripe || !email.trim()) {
      alert("Please enter your email");
      return;
    }

    try {
      const { data } = await axios.post("/api/payments/create-session", {
        productId: product._id,
        email,
      });

      const result = await stripe.redirectToCheckout({ sessionId: data.id });

      if (result.error) {
        console.error("Stripe redirect error:", result.error.message);
        alert(result.error.message);
      }
    } catch (err) {
      console.error("Payment initiation failed:", err);
      alert(err.response?.data?.msg || "Something went wrong. Try again.");
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
      {/* Featured Image – direct ImageKit URL with optimization */}
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

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleBuy();
          }}
          disabled={!stripe || !email.trim()}
          className="
            mt-auto bg-green-600 text-white py-4 px-8 rounded-xl
            text-lg md:text-xl font-semibold
            hover:bg-green-700 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-md hover:shadow-lg
          "
        >
          Buy Now
        </button>
      </div>

      <div className="md:hidden text-center text-sm text-gray-500 py-3 bg-gray-50">
        Tap card to {isExpanded ? "hide" : "show"} details
      </div>
    </div>
  );
};

export default ProductCard;
