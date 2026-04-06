import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <>
      <Navbar />

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
            <UserRoute>
              <Profile />
            </UserRoute>
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
    </>
  );
}

export default App;
