import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const res = await axios.post(endpoint, formData);
      localStorage.setItem("token", res.data.token);
      navigate(res.data.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-md">
      <h1 className="text-3xl font-bold text-center">
        {isSignup ? "Signup" : "Login"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="border p-2 w-full"
        />
        {isSignup && (
          <select
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        )}
        <button
          type="submit"
          className="bg-primary text-white py-2 px-4 rounded w-full"
        >
          Submit
        </button>
      </form>
      <button
        onClick={() => setIsSignup(!isSignup)}
        className="mt-2 text-primary"
      >
        {isSignup ? "Switch to Login" : "Switch to Signup"}
      </button>
    </div>
  );
};

export default Login;
