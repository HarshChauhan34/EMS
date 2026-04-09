import { useEffect, useState } from "react";
import { getAllUsers, getUserBookings } from "../../services/adminService";
import { getAllBookings } from "../../services/bookingService";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [userBookings, setUserBookings] = useState({});
  const [openUsers, setOpenUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const handleViewBookings = async (id) => {
    if (openUsers.includes(id)) {
      setOpenUsers(openUsers.filter((u) => u !== id));
      return;
    }

    if (!userBookings[id]) {
      const res = await getUserBookings(id);
      const confirmed = res.data.filter((b) => b.bookingStatus === "confirmed");

      setUserBookings((prev) => ({
        ...prev,
        [id]: confirmed,
      }));
    }

    setOpenUsers((prev) => [...prev, id]);
  };

  const getInitial = (name) => name?.charAt(0).toUpperCase();

  const revenue = bookings.reduce(
    (total, b) => total + (b.totalAmount || 0),
    0,
  );

  useEffect(() => {
    const loadUsersData = async () => {
      try {
        const [usersRes, bookingsRes] = await Promise.all([
          getAllUsers(),
          getAllBookings(),
        ]);
        const usersOnly = usersRes.data.filter((u) => u.role === "user");
        setUsers(usersOnly);
        setBookings(bookingsRes.data);
      } catch (error) {
        console.log(error);
      }
    };

    loadUsersData();
  }, []);
  
  return (
    <div className="theme-page min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white p-4 md:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">🎛 Admin Dashboard</h1>
        <p className="text-gray-300 mt-1">Manage users & monitor bookings</p>
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
          <h2 className="text-2xl font-bold">₹ {revenue}</h2>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl shadow-lg">
          <p className="text-gray-300 text-sm">Active</p>
          <h2 className="text-2xl font-bold">{users.length}</h2>
        </div>
      </div>

      {/* USERS LIST */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-4 md:p-6 border border-white/20">
        <h2 className="text-xl font-semibold mb-5">👤 Users</h2>

        <div className="space-y-4">
          {users.map((u) => {
            const bookings = userBookings[u._id] || [];
            const isOpen = openUsers.includes(u._id);

            return (
              <div key={u._id} className="space-y-3">
                {/* USER CARD */}
                <div className="flex flex-col md:flex-row md:items-center justify-between bg-white/5 p-4 rounded-xl hover:bg-white/10 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-r from-pink-500 to-purple-600 flex items-center justify-center font-bold">
                      {getInitial(u.name)}
                    </div>

                    <p className="font-semibold">{u.name}</p>
                  </div>

                  <button
                    onClick={() => handleViewBookings(u._id)}
                    className="mt-3 md:mt-0 px-4 py-2 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 hover:scale-105 transition shadow-lg"
                  >
                    {isOpen ? "Hide Bookings" : "View Bookings"}
                  </button>
                </div>

                {/* BOOKINGS */}
                {isOpen && (
                  <div className="ml-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300">
                    {bookings.length === 0 ? (
                      <p className="text-gray-400">No confirmed bookings</p>
                    ) : (
                      bookings.map((b) => (
                        <div
                          key={b._id}
                          className="bg-white/10 backdrop-blur-xl p-4 rounded-xl border border-white/20 hover:scale-[1.03] transition"
                        >
                          <h3 className="text-indigo-300 font-bold">
                            {b.event?.title}
                          </h3>

                          <div className="mt-2 text-sm text-gray-300 space-y-1">
                            <p>🎫 {b.seatsBooked} seats</p>
                            <p>💰 ₹ {b.totalAmount}</p>
                            <p>💳 {b.paymentStatus}</p>
                          </div>

                          <div className="mt-3 flex justify-between items-center">
                            <span className="text-green-400 font-semibold">
                              ✔ Confirmed
                            </span>

                            <span className="text-xs text-gray-400">
                              {new Date(b.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
