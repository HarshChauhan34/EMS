import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock, ArrowLeft } from "lucide-react";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ================= TOKEN CHECK =================
  useEffect(() => {
    if (!token) {
      alert("Invalid reset link");
      navigate("/login");
    }
  }, [token, navigate]);

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.password || !form.confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/reset-password", {
        token,
        newPassword: form.password,
      });

      alert("✅ Password reset successful");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid or expired reset link");
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
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-full bg-linear-to-r from-purple-500 to-pink-500">
              <Lock size={24} />
            </div>
          </div>

          <h2 className="text-3xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Reset Password
          </h2>

          <p className="text-gray-300 text-sm mt-2">
            Enter your new password below
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-gray-300 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-linear-to-r from-purple-500 to-pink-500 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Updating...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/login")}
          className="w-full mt-5 flex justify-center items-center gap-2 bg-white/10 border border-white/20 py-3 rounded-xl hover:bg-white/20 transition"
        >
          <ArrowLeft size={18} />
          Back to Login
        </button>
      </motion.div>
    </div>
  );
}

export default ResetPassword;
