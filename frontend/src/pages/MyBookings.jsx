import { useEffect, useState } from "react";
import { getMyBookings, cancelBooking } from "../services/bookingService";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await getMyBookings();
    setBookings(res.data.filter((b) => b.bookingStatus !== "cancelled"));
  };

  const handleCancel = async (id) => {
    await cancelBooking(id);
    fetchBookings();
  };

  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">🎟 My Bookings</h1>
          <p className="text-gray-300 mt-1">
            Manage your event tickets & history
          </p>
        </div>

        {/* EMPTY STATE */}
        {bookings.length === 0 && (
          <div className="text-center mt-16 text-gray-400">
            <p className="text-lg">No bookings yet 😔</p>
            <p className="text-sm mt-1">
              Start exploring events and book your first ticket!
            </p>
          </div>
        )}

        {/* BOOKINGS GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-white/20 hover:scale-[1.04] transition duration-300 flex flex-col justify-between"
            >
              {/* EVENT INFO */}
              <div>
                <h2 className="text-lg font-bold text-indigo-300">
                  {b.event.title}
                </h2>

                <p className="text-sm text-gray-300 mt-1">
                  📍 {b.event.location}
                </p>

                <p className="text-sm text-gray-300">
                  📅 {new Date(b.event.date).toLocaleDateString()}
                </p>
              </div>

              {/* DETAILS */}
              <div className="mt-4 text-sm space-y-1 text-gray-300">
                <p>🎫 Seats: {b.seatsBooked}</p>
                <p>💰 ₹ {b.totalAmount}</p>
              </div>

              {/* STATUS + ACTION */}
              <div className="mt-4 flex justify-between items-center">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                  ✔ Confirmed
                </span>

                {b.bookingStatus === "confirmed" && (
                  <button
                    onClick={() => handleCancel(b._id)}
                    className="text-xs px-3 py-1 rounded-lg bg-linear-to-r from-red-500 to-pink-600 hover:scale-105 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyBookings;
