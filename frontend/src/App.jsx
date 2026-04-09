import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

// Public Pages
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";

// User Pages
import Profile from "./pages/Profile";
import MyBookings from "./pages/MyBookings";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AddEvent from "./pages/Admin/AddEvent";
import EditEvent from "./pages/Admin/EditEvent";
import ManageUsers from "./pages/Admin/ManageUsers";

// Protected Routes
import AdminRoute from "./routes/AdminRoute";
import UserRoute from "./routes/UserRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.classList.remove("theme-light", "theme-dark");
    document.documentElement.classList.add(
      theme === "light" ? "theme-light" : "theme-dark",
    );
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="min-h-screen">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<EventDetails />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ================= USER ================= */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <UserRoute>
              <MyBookings />
            </UserRoute>
          }
        />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/add-event"
          element={
            <AdminRoute>
              <AddEvent />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/edit-event/:id"
          element={
            <AdminRoute>
              <EditEvent />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />

        {/* ================= 404 PAGE ================= */}
        <Route
          path="*"
          element={
            <h1 className="text-center mt-20 text-2xl font-bold">
              404 - Page Not Found 🚫
            </h1>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
