// src/pages/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post("/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      navigate(res.data.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.msg || "Invalid credentials or server error";
      setErrorMsg(msg);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
        Log In
      </h1>

      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {errorMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-xl shadow-md"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Log In
        </button>
      </form>

      <div className="text-center mt-6 space-y-2">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-green-600 hover:underline font-medium"
          >
            Sign up
          </a>
        </p>
        <p className="text-sm text-gray-500">
          You can browse and purchase without logging in
        </p>
      </div>
    </div>
  );
};

export default Login;
