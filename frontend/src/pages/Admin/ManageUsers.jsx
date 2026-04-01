import { useEffect, useState } from "react";
import { getAllUsers, getUserBookings } from "../../services/adminService";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await getAllUsers();
    const usersOnly = res.data.filter((u) => u.role === "user");
    setUsers(usersOnly);
  };

  const handleViewBookings = async (id) => {
    const res = await getUserBookings(id);
    const confirmed = res.data.filter(
      (b) => b.bookingStatus === "confirmed"
    );

    setBookings(confirmed);
    setSelectedUser(id);
  };

  const getInitial = (name) => name?.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white p-4 md:p-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          🎛 Admin Dashboard
        </h1>
        <p className="text-gray-300 mt-1">
          Manage users & monitor bookings
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl shadow-lg">
          <p className="text-gray-300 text-sm">Users</p>
          <h2 className="text-2xl font-bold">{users.length}</h2>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl shadow-lg">
          <p className="text-gray-300 text-sm">Bookings</p>
          <h2 className="text-2xl font-bold">{bookings.length}</h2>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl shadow-lg">
          <p className="text-gray-300 text-sm">Revenue</p>
          <h2 className="text-2xl font-bold">
            ₹ {bookings.reduce((a, b) => a + b.totalAmount, 0)}
          </h2>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl shadow-lg">
          <p className="text-gray-300 text-sm">Active</p>
          <h2 className="text-2xl font-bold">{users.length}</h2>
        </div>
      </div>

      {/* USERS LIST */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-4 md:p-6 border border-white/20">

        <h2 className="text-xl font-semibold mb-5">👤 Users</h2>

        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u._id}
              className="flex flex-col md:flex-row md:items-center justify-between bg-white/5 p-4 rounded-xl hover:bg-white/10 transition"
            >

              {/* USER INFO */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center font-bold">
                  {getInitial(u.name)}
                </div>

                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-sm text-gray-300">{u.email}</p>
                </div>
              </div>

              {/* ACTION */}
              <button
                onClick={() => handleViewBookings(u._id)}
                className="mt-3 md:mt-0 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 transition shadow-lg"
              >
                View Bookings
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* BOOKINGS SECTION */}
      {selectedUser && (
        <div className="mt-10">

          <h2 className="text-2xl font-bold mb-5">
            🎟 Confirmed Bookings
          </h2>

          {bookings.length === 0 && (
            <p className="text-gray-400">No confirmed bookings</p>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-xl hover:scale-[1.03] transition border border-white/20"
              >

                <h3 className="text-lg font-bold text-indigo-300">
                  {b.event?.title}
                </h3>

                <div className="mt-3 space-y-1 text-sm text-gray-300">
                  <p>🎫 Seats: {b.seatsBooked}</p>
                  <p>💰 ₹ {b.totalAmount}</p>
                  <p>💳 {b.paymentStatus}</p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-green-400 font-semibold">
                    ✔ Confirmed
                  </span>

                  <span className="text-xs text-gray-400">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;