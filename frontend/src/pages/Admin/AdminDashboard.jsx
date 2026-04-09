import { useCallback, useEffect, useState } from "react";
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

  const fetchEvents = useCallback(async () => {
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const totalUsers = users.filter((u) => u.role !== "admin").length;

  const revenue = bookings.reduce(
    (total, b) => total + (b.totalAmount || 0),
    0,
  );
  
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [eventsRes, usersRes, bookingsRes] = await Promise.all([
          getEvents(),
          getAllUsers(),
          getAllBookings(),
        ]);
        setEvents(eventsRes.data);
        setUsers(usersRes.data);
        setBookings(bookingsRes.data);
      } catch (error) {
        console.log(error);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="theme-page min-h-screen flex bg-linear-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white">
      {/* SIDEBAR (FIXED) */}
      <div className="w-64 hidden md:flex flex-col p-6 bg-white/10 backdrop-blur-xl border-r border-white/20 fixed left-0 top-0 h-screen">
        <h2 className="text-2xl font-bold mb-10">⚡ Admin</h2>

        <nav className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/admin/add-event")}
            className="px-4 py-2 rounded-xl hover:bg-white/20 transition text-left"
          >
            ➕ Add Event
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="px-4 py-2 rounded-xl hover:bg-white/20 transition text-left"
          >
            👥 Users
          </button>
        </nav>

        <div className="mt-auto text-xs text-gray-400">© 2026 EventPro</div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-8 md:ml-64">
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">🎛 Admin Dashboard</h1>

          <button
            onClick={() => navigate("/admin/add-event")}
            className="bg-linear-to-r from-pink-500 to-purple-600 px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition"
          >
            + Add Event
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-lg hover:scale-[1.03] transition">
            <p className="text-gray-300 text-sm">Total Events</p>
            <h2 className="text-3xl font-bold text-indigo-400">
              {events.length}
            </h2>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-lg hover:scale-[1.03] transition">
            <p className="text-gray-300 text-sm">Users</p>
            <h2 className="text-3xl font-bold text-green-400">{totalUsers}</h2>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-lg hover:scale-[1.03] transition">
            <p className="text-gray-300 text-sm">Bookings</p>
            <h2 className="text-3xl font-bold text-purple-400">
              {bookings.length}
            </h2>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-lg hover:scale-[1.03] transition">
            <p className="text-gray-300 text-sm">Revenue</p>
            <h2 className="text-3xl font-bold text-yellow-400">₹ {revenue}</h2>
          </div>
        </div>

        {/* EVENTS HEADER */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">🎟 All Events</h2>
        </div>

        {/* EVENTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="hover:scale-[1.04] transition duration-300"
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
