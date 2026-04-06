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

  const [forgotMode, setForgotMode] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

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
      alert(error.response?.data?.message || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const openForgot = () => {
    setForgotEmail(form.email);
    setForgotMessage("");
    setForgotMode(true);
  };

  const backToLogin = () => {
    setForgotMode(false);
    setForgotMessage("");
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    try {
      setForgotLoading(true);
      const res = await API.post("/auth/forgot-password", { email: forgotEmail });
      setForgotMessage(res.data?.message || "Check your email for reset instructions.");
    } catch (error) {
      alert(
        error.response?.data?.message || error.message || "Password reset request failed"
      );
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back 👋</h2>
          <p className="text-gray-500">Login to your account</p>
        </div>

        {!forgotMode ? (
          <>
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

              {/* Forgot password link above button */}
              <div className="text-right -mt-1">
                <button
                  type="button"
                  onClick={openForgot}
                  className="text-sm text-indigo-600 font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
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
          </>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-5">
            <p className="text-center text-gray-600 -mt-1">
              Enter your email and we’ll send reset instructions.
            </p>

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />

            <button
              type="submit"
              disabled={forgotLoading}
              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
            >
              {forgotLoading ? "Sending..." : "Send Reset Link"}
            </button>

            {forgotMessage && (
              <p className="text-center text-gray-600 text-sm">{forgotMessage}</p>
            )}

            <button
              type="button"
              onClick={backToLogin}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold shadow-sm hover:bg-gray-200 transition"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
