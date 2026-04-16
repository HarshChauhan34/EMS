import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isStrongPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(
      password,
    );
  };

  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook)\.com$/.test(email);
  };

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.role) {
      alert("Please fill all fields");
      return;
    }

    if (!isValidEmail(form.email)) {
      alert("Enter a valid email (gmail/yahoo/outlook only)");
      return;
    }

    if (!isStrongPassword(form.password)) {
      alert(
        "Password must include uppercase, lowercase, number, and special character",
      );
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      // ✅ Normal user login directly
      if (form.role === "user") {
        localStorage.setItem("user", JSON.stringify(res.data));
        alert("✅ Account created successfully");
        navigate("/");
        return;
      }

      // ✅ Organizer waits for admin approval
      alert(
        res.data?.message ||
          "Organizer registration request submitted. Please wait for admin approval.",
      );

      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message || error.message || "Register failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="absolute h-72 w-72 rounded-full bg-purple-600 opacity-30 blur-[120px] top-10 left-10" />
      <div className="absolute h-72 w-72 rounded-full bg-pink-500 opacity-30 blur-[120px] bottom-10 right-10" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="auth-card relative text-white"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Create Account 🚀
          </h2>
          <p className="text-gray-300 text-sm mt-2">
            Register as user or organizer
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="auth-input"
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            className="auth-input"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="auth-input pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-gray-300 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* ROLE */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="auth-input"
          >
            <option value="user" className="text-white">
              User
            </option>
            <option value="organizer" className="text-white">
              Organizer
            </option>
          </select>

          {form.role === "organizer" && (
            <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-3 text-sm text-yellow-200">
              Organizer account needs admin approval before login.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex w-full items-center justify-center gap-2 py-3 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Creating...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="text-center text-gray-300 mt-6 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-400 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
