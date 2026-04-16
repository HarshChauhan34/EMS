import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { BASE_URL } from "../../services/api";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState("");

  const requestForgotPassword = (cleanEmail) =>
    API.post("/auth/forgot-password", { email: cleanEmail });

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

      let res;

      try {
        res = await requestForgotPassword(cleanEmail);
      } catch (firstError) {
        const shouldRetry =
          !firstError.response &&
          (firstError.code === "ECONNABORTED" ||
            String(firstError.message || "")
              .toLowerCase()
              .includes("network"));

        if (!shouldRetry) {
          throw firstError;
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
        res = await requestForgotPassword(cleanEmail);
      }

      setMessage(
        res.data?.message || "If that email exists, we have sent a reset link.",
      );

      setResetLink(res.data?.resetURL || "");
    } catch (error) {
      const backendMessage = error.response?.data?.message;
      const networkMessage = `Could not reach forgot-password service at ${BASE_URL}. Server may be waking up. Please try again in 30 seconds.`;

      const finalMessage = backendMessage || networkMessage;

      console.error("Forgot password request failed:", {
        baseUrl: BASE_URL,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      alert(finalMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      {/* BACKGROUND GLOW */}
      <div className="absolute h-72 w-72 rounded-full bg-purple-600 opacity-30 blur-[120px] top-10 left-10" />
      <div className="absolute h-72 w-72 rounded-full bg-pink-500 opacity-30 blur-[120px] bottom-10 right-10" />

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="auth-card relative text-white"
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
            className="auth-input"
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex w-full items-center justify-center gap-2 py-3 disabled:opacity-50"
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
          className="btn-secondary mt-5 flex w-full items-center justify-center gap-2 py-3"
        >
          <ArrowLeft size={18} />
          Back to Login
        </button>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
