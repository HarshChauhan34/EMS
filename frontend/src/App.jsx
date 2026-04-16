import { Routes, Route, useLocation } from "react-router-dom";
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
import ManageUsers from "./pages/Admin/ManageUsers";
import ManageOrganizers from "./pages/Admin/ManageOrganizers";

// Organizer Pages
import OrganizerDashboard from "./pages/Organizer/OrganizerDashboard";
import CreateEvent from "./pages/Organizer/CreateEvent";
import EditEvent from "./pages/Organizer/EditEvent";

// Protected Routes
import AdminRoute from "./routes/AdminRoute";
import OrganizerRoute from "./routes/OrganizerRoute";
import UserRoute from "./routes/UserRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

//Layouts
import AdminLayout from "./layouts/AdminLayout";
import OrganizerLayout from "./layouts/OrganizerLayout";

function App() {
  const { pathname } = useLocation();
  const hideNavbar = pathname === "/login" || pathname === "/register";

  return (
    <div className="site-shell">
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<EventDetails />} />

        {/* ================= AUTH ================= */}
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
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="organizers" element={<ManageOrganizers />} />
        </Route>

        {/* ================= ORGANIZER ================= */}
        <Route
          path="/organizer"
          element={
            <OrganizerRoute>
              <OrganizerLayout />
            </OrganizerRoute>
          }
        >
          <Route index element={<OrganizerDashboard />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="edit-event/:id" element={<EditEvent />} />
        </Route>

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
