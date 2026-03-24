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

  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-indigo-100
      via-purple-100
      to-pink-100
      py-6
      px-3
      sm:px-6
      "
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className="
          bg-gradient-to-r
          from-indigo-600
          via-purple-600
          to-pink-500
          text-white
          p-5
          rounded-2xl
          mb-6
          shadow-xl
          "
        >
          <h1 className="text-2xl sm:text-3xl font-bold">🎟 My Bookings</h1>

          <p className="opacity-90">All your confirmed event bookings</p>
        </div>

        {/* Empty */}
        {bookings.length === 0 && (
          <div
            className="
            text-center
            mt-12
            text-gray-600
            text-lg
            "
          >
            No bookings yet
          </div>
        )}

        {/* Grid */}
        <div
          className="
          grid
          grid-cols-1
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
              hover:shadow-2xl
              hover:scale-105
              transition
              p-5
              flex
              flex-col
              justify-between
              border
              "
            >
              {/* Title */}
              <div>
                <h2
                  className="
                  text-lg
                  font-bold
                  text-indigo-600
                  "
                >
                  {b.event.title}
                </h2>

                <p className="text-sm text-gray-500">📍 {b.event.location}</p>

                <p className="text-sm">
                  📅 {new Date(b.event.date).toLocaleDateString()}
                </p>
              </div>

              {/* Details */}
              <div className="mt-3 text-sm space-y-1">
                <p>
                  🎫 Seats:
                  <span className="font-semibold ml-1">{b.seatsBooked}</span>
                </p>

                <p>
                  💰 Amount:
                  <span className="font-semibold ml-1">₹{b.totalAmount}</span>
                </p>
              </div>

              {/* Status */}
              <div className="mt-3">
                <span
                  className={`
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-semibold
                  ${
                    b.bookingStatus === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                  `}
                >
                  {b.bookingStatus}
                </span>
              </div>

              {/* Cancel */}
              {b.bookingStatus === "confirmed" && (
                <button
                  onClick={() => handleCancel(b._id)}
                  className="
                  mt-4
                  bg-gradient-to-r
                  from-red-500
                  to-pink-500
                  hover:from-red-600
                  hover:to-pink-600
                  text-white
                  py-2
                  rounded-lg
                  text-sm
                  shadow
                  transition
                  "
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyBookings;
