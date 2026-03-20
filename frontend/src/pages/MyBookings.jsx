import { useEffect, useState } from "react";
import {
  getMyBookings,
  cancelBooking,
} from "../services/bookingService";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await getMyBookings();
    setBookings(res.data);
  };

  const handleCancel = async (id) => {
    await cancelBooking(id);
    fetchBookings();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div
          className="
          bg-gradient-to-r
          from-indigo-600
          via-purple-600
          to-pink-500
          text-white
          p-4 sm:p-6
          rounded-lg
          mb-6
          shadow
          "
        >
          <h1 className="text-xl sm:text-3xl font-bold">
            My Bookings
          </h1>
          <p className="text-sm opacity-90">
            All your event bookings
          </p>
        </div>

        {/* Empty */}
        {bookings.length === 0 && (
          <div className="text-center mt-10 text-gray-500 text-lg">
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
          gap-4
          "
        >
          {bookings.map((b) => (
            <div
              key={b._id}
              className="
              bg-white
              rounded-xl
              shadow-md
              hover:shadow-xl
              transition
              p-4
              flex
              flex-col
              justify-between
              "
            >
              {/* Title */}
              <h2 className="text-lg font-bold mb-1">
                {b.event.title}
              </h2>

              <p className="text-sm text-gray-500">
                {b.event.location}
              </p>

              <p className="text-sm">
                📅{" "}
                {new Date(
                  b.event.date
                ).toLocaleDateString()}
              </p>

              <div className="mt-2 text-sm space-y-1">
                <p>Seats: {b.seatsBooked}</p>

                <p>Amount: ₹{b.totalAmount}</p>
              </div>

              {/* Status */}
              <div className="mt-2">
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

              {/* Cancel button */}
              {b.bookingStatus === "confirmed" && (
                <button
                  onClick={() =>
                    handleCancel(b._id)
                  }
                  className="
                  mt-3
                  bg-red-500
                  hover:bg-red-600
                  text-white
                  py-2
                  rounded-lg
                  text-sm
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