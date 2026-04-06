import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AddEvent from "./pages/Admin/AddEvent";
import EditEvent from "./pages/Admin/EditEvent";
import MyBookings from "./pages/MyBookings";
import EventDetails from "./pages/EventDetails";
import Profile from "./pages/Profile";
import ManageUsers from "./pages/Admin/ManageUsers";

// ✅ NEW (IMPORTANT)
import ResetPassword from "./pages/Auth/ResetPassword";

// Routes
import AdminRoute from "./routes/AdminRoute";
import UserRoute from "./routes/UserRoute";

import ForgotPassword from "./pages/Auth/ForgotPassword";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/event/:id" element={<EventDetails />} />

        {/* ✅ Reset Password Route */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ================= USER PROTECTED ================= */}
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

        {/* ================= ADMIN PROTECTED ================= */}
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

        {/* ❌ REMOVE THIS (unsafe public edit route) */}
        {/* <Route path="/edit-event/:id" element={<EditEvent />} /> */}
      </Routes>
    </>
  );
}

export default App;
