import { useEffect, useState } from "react";
import { getEvents } from "../../services/eventService";
import EventCard from "../../components/EventCard";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../services/adminService";
import { getAllBookings } from "../../services/bookingService";

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await getAllBookings();
      setBookings(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchUsers();
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-indigo-700 to-purple-700 text-white p-5 hidden md:flex flex-col">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

        <nav className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/admin/add-event")}
            className="text-left px-3 py-2 rounded-lg hover:bg-white/20 transition"
          >
            ➕ Add Event
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="text-left px-3 py-2 rounded-lg hover:bg-white/20 transition"
          >
            👥 Users
          </button>
        </nav>

        <div className="mt-auto text-sm opacity-70">© 2026 Event System</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6">
        {/* Top Bar (Mobile) */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Admin</h1>
          <button
            onClick={() => navigate("/admin/add-event")}
            className="bg-indigo-600 text-white px-3 py-1 rounded-lg"
          >
            + Event
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/70 backdrop-blur-lg p-5 rounded-2xl shadow hover:shadow-lg transition">
            <p className="text-gray-500 text-sm">Total Events</p>
            <h2 className="text-3xl font-bold text-indigo-600">
              {events.length}
            </h2>
          </div>

          <div className="bg-white/70 backdrop-blur-lg p-5 rounded-2xl shadow hover:shadow-lg transition">
            <p className="text-gray-500 text-sm">Total Users</p>
            <h2 className="text-3xl font-bold text-green-600">
              {users.filter((u) => u.role !== "admin").length}
            </h2>
          </div>

          <div className="bg-white/70 backdrop-blur-lg p-5 rounded-2xl shadow hover:shadow-lg transition">
            <p className="text-gray-500 text-sm">Total Bookings</p>
            <h2 className="text-3xl font-bold text-purple-600">
              {bookings.length}
            </h2>
          </div>
        </div>

        {/* Title */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">All Events</h2>

          <button
            onClick={() => navigate("/admin/add-event")}
            className="hidden md:block bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition shadow"
          >
            + Add Event
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {events.map((event) => (
            <div
              key={event._id}
              className="transform hover:scale-105 transition duration-300"
            >
              <EventCard event={event} refresh={fetchEvents} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
