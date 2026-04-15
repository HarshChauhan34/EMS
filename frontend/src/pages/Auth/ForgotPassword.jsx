import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState("");

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setResetLink("");

      const res = await API.post("/auth/forgot-password", {
        email: cleanEmail,
      });

      setMessage(
        res.data?.message || "If that email exists, we have sent a reset link.",
      );

      setResetLink(res.data?.resetURL || "");
    } catch (error) {
      const backendMessage =
        error.response?.data?.message ||
        "Could not reach forgot-password service. Please verify backend is running on port 5000.";
      alert(backendMessage);
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
              <Mail size={24} />
            </div>
          </div>

          <h2 className="text-3xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Forgot Password
          </h2>

          <p className="text-gray-300 text-sm mt-2">
            Enter your email to receive a reset link
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* SUCCESS MESSAGE */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2"
          >
            <CheckCircle size={18} />
            {message}
          </motion.div>
        )}

        {/* DEV RESET LINK */}
        {resetLink && (
          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-xs break-all">
            <p className="text-gray-400 mb-1">Dev Reset Link:</p>
            <a
              href={resetLink}
              target="_blank"
              rel="noreferrer"
              className="text-purple-400 underline"
            >
              {resetLink}
            </a>
          </div>
        )}

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

export default ForgotPassword;
