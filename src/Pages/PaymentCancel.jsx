import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>

        <p className="text-xl text-gray-700 mb-8">
          Your payment was cancelled. No charges were made.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/digital-products")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-10 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
          >
            Back to Products
            <ArrowLeft size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
