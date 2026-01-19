import { useState } from "react";
import axios from "axios";
import { useStripe, useElements } from "@stripe/react-stripe-js";

const ProductCard = ({ product }) => {
  const [email, setEmail] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  const handleBuy = async () => {
    if (!stripe || !email) return;

    try {
      const { data } = await axios.post("/api/payments/create-session", {
        productId: product._id,
        email,
      });

      const result = await stripe.redirectToCheckout({ sessionId: data.id });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold mb-2">{product.title}</h3>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <p className="text-primary text-2xl font-bold mb-4">£{product.price}</p>

      <input
        type="email"
        placeholder="Your email for receipt"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-300 p-3 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        required
      />

      <button
        onClick={handleBuy}
        disabled={!stripe || !email}
        className="bg-primary text-white py-3 px-6 rounded w-full font-medium
                   hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Buy Now
      </button>
    </div>
  );
};

export default ProductCard;
