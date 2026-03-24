import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AddEvent from "./pages/Admin/AddEvent";
import EditEvent from "./pages/Admin/EditEvent";
import MyBookings from "./pages/MyBookings";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import UserRoute from "./routes/UserRoute";
import EventDetails from "./pages/EventDetails";
import Profile from "./pages/Profile";
import ManageUsers from "./pages/Admin/ManageUsers";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/edit-event/:id" element={<EditEvent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/my-bookings" element={<MyBookings />} />

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
      </Routes>
    </>
  );
}

export default App;
