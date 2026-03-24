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

  // fetch events
  const fetchEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // fetch users
  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await getAllBookings();
      setBookings(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // correct useEffect
  useEffect(() => {
    fetchEvents();
    fetchUsers();
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-5 shadow">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>

          <button
            onClick={() => navigate("/admin/add-event")}
            className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            + Add Event
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Events</p>
            <h2 className="text-2xl font-bold text-indigo-600">
              {events.length}
            </h2>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Users</p>
            <h2 className="text-2xl font-bold text-green-600">
              {users.length}
            </h2>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Bookings</p>
            <h2 className="text-2xl font-bold text-purple-600">{bookings.length}</h2>
          </div>
        </div>

        {/* Events */}
        <h2 className="text-xl font-semibold mb-4">All Events</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {events.map((event) => (
            <EventCard key={event._id} event={event} refresh={fetchEvents} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
