import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= LOGIN =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      localStorage.setItem("user", JSON.stringify(res.data));

      navigate(res.data?.role === "admin" ? "/admin" : "/");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]">
      {/* BACKGROUND GLOW */}
      <div className="absolute w-72 h-72 bg-purple-600 rounded-full blur-[120px] opacity-30 top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-pink-500 rounded-full blur-[120px] opacity-30 bottom-10 right-10"></div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 text-white"
      >
        {/* HEADER */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome Back 👋
          </h2>
          <p className="text-gray-300 text-sm mt-2">
            Login to continue your journey
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-gray-300 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* FORGOT PASSWORD */}
          <div className="text-right -mt-2">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-purple-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-linear-to-r from-purple-500 to-pink-500 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-gray-300 mt-6 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-purple-400 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
