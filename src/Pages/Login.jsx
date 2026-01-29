// src/Pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [role, setRole] = useState("student");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const payload = { password: formData.password };
    if (role === "student") {
      payload.email = formData.email;
    }

    try {
      const res = await api.post("/api/auth/login", payload);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      navigate(res.data.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.msg || "Invalid credentials or server error";
      setErrorMsg(msg);
      console.error("Login failed:", err);
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
          <label className="block text-gray-700 font-medium mb-2">
            Account Type
          </label>
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              if (e.target.value === "admin") {
                setFormData((prev) => ({ ...prev, email: "" }));
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {role === "student" && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
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
        )}

        <div className="relative">
          <label className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
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
