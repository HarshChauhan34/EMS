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

      const res = await API.post(
        "/auth/login",
        form
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">

      <div className="backdrop-blur-lg bg-white/20 border border-white/30 shadow-2xl rounded-2xl p-8 w-96">

        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Welcome Back
        </h2>


        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/80 outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />


          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/80 outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Please wait..." : "Login"}
          </button>

        </form>


        <p className="text-center text-white mt-4">

          Don't have account?{" "}

          <Link
            to="/register"
            className="font-bold underline"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;