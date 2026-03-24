import { useEffect, useState } from "react";
import { getAllUsers, getUserBookings } from "../../services/adminService";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // get only users
  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      const usersOnly = res.data.filter((u) => u.role === "user");
      setUsers(usersOnly);
    } catch (err) {
      console.log(err);
    }
  };

  // get only confirmed bookings
  const handleViewBookings = async (id) => {
    try {
      const res = await getUserBookings(id);

      const confirmed = res.data.filter((b) => b.bookingStatus === "confirmed");

      setBookings(confirmed);
      setSelectedUser(id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-indigo-100
      via-purple-100
      to-pink-100
      p-4 md:p-8
      "
    >
      {/* TITLE */}
      <h1
        className="
        text-3xl md:text-4xl
        font-bold
        text-indigo-700
        mb-6
        "
      >
        🎛 Admin Panel — Manage Users
      </h1>

      {/* USERS CARD */}
      <div
        className="
        bg-white/80
        backdrop-blur-md
        rounded-2xl
        shadow-xl
        p-4 md:p-6
        border
        "
      >
        <h2 className="text-xl font-semibold mb-4 text-purple-700">
          Users List
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr
                className="
                bg-gradient-to-r
                from-indigo-500
                to-purple-500
                text-white
                "
              >
                <th className="py-2 px-3 text-left">Name</th>

                <th className="py-2 px-3 text-left">Email</th>

                <th className="py-2 px-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="
                  border-b
                  hover:bg-indigo-50
                  transition
                  "
                >
                  <td className="py-2 px-3 font-medium">{u.name}</td>

                  <td className="py-2 px-3">{u.email}</td>

                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => handleViewBookings(u._id)}
                      className="
                      bg-gradient-to-r
                      from-indigo-600
                      to-purple-600
                      hover:from-indigo-700
                      hover:to-purple-700
                      text-white
                      px-4
                      py-1
                      rounded-lg
                      shadow-md
                      transition
                      "
                    >
                      View Bookings
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOOKINGS */}
      {selectedUser && (
        <div className="mt-10">
          <h2
            className="
            text-2xl
            font-bold
            text-purple-700
            mb-4
            "
          >
            ✅ Confirmed Bookings
          </h2>

          {bookings.length === 0 && (
            <p className="text-gray-600">No confirmed bookings</p>
          )}

          <div
            className="
            grid
            sm:grid-cols-2
            lg:grid-cols-3
            gap-5
            "
          >
            {bookings.map((b) => (
              <div
                key={b._id}
                className="
                bg-white/90
                backdrop-blur-md
                rounded-2xl
                shadow-lg
                p-5
                border
                hover:shadow-2xl
                hover:scale-105
                transition
                "
              >
                <h3
                  className="
                  text-lg
                  font-bold
                  text-indigo-600
                  "
                >
                  {b.event?.title}
                </h3>

                <p className="mt-2">
                  🎫 Seats:
                  <span className="font-semibold ml-1">{b.seatsBooked}</span>
                </p>

                <p>
                  💰 Amount:
                  <span className="font-semibold ml-1">₹ {b.totalAmount}</span>
                </p>

                <p>
                  💳 Payment:
                  <span className="text-blue-600 font-semibold ml-1">
                    {b.paymentStatus}
                  </span>
                </p>

                <p className="text-green-600 font-bold mt-2">
                  ✔ {b.bookingStatus}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
