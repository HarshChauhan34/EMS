import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
      }

      if (res.data?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(
        error.response?.data?.message || error.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome Back 👋
          </h2>
          <p className="text-gray-500">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />

            {/* Show/Hide */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-semibold">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;