import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../../services/api";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Invalid or missing token.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      setMessage(res.data?.message || "Password reset successful.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-500">
            Enter a new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {message && (
            <p className="text-center text-green-600 text-sm mt-2">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;

