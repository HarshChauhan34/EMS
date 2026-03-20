import { deleteEvent } from "../services/eventService";
import { useNavigate, useLocation } from "react-router-dom";
import { bookEvent } from "../services/bookingService";
import { useState } from "react";

function EventCard({ event, refresh }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showSeat, setShowSeat] = useState(false);
  const [seats, setSeats] = useState(1);

  const isAdminPage = location.pathname.includes("/admin");

  const handleDelete = async () => {
    try {
      await deleteEvent(event._id);
      refresh && refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBook = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await bookEvent({
        eventId: event._id,
        seats: seats,
      });

      alert("Booking successful");

      setShowSeat(false);

      refresh && refresh();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div
      className="
      bg-white
      rounded-xl
      shadow-md
      hover:shadow-xl
      transition
      duration-300
      p-4 sm:p-5
      border
      flex
      flex-col
      justify-between
      h-full
      "
    >
      {/* Title */}
      <h2 className="text-base sm:text-xl font-bold mb-1 break-words">
        {event.title}
      </h2>

      {/* Category */}
      <p className="text-xs sm:text-sm text-gray-500 mb-2">
        {event.category}
      </p>

      {/* Description */}
      <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-3">
        {event.description}
      </p>

      {/* Details */}
      <div className="space-y-1 text-xs sm:text-sm">
        <p>📅 {new Date(event.date).toLocaleDateString()}</p>
        <p>📍 {event.location}</p>
      </div>

      {/* Price + Seats */}
      <div className="flex justify-between mt-3 flex-wrap gap-2">
        <span className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
          ₹ {event.price}
        </span>

        <span className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
          Seats: {event.availableSeats}
        </span>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2">

        {/* View */}
        <button
          onClick={() => navigate(`/event/${event._id}`)}
          className="
          w-full
          sm:flex-1
          bg-indigo-600
          text-white
          py-2
          rounded-lg
          text-sm
          hover:bg-indigo-700
          "
        >
          View
        </button>

        {/* Book */}
        {!isAdminPage && !showSeat && (
          <button
            onClick={() => setShowSeat(true)}
            className="
            w-full
            sm:flex-1
            bg-green-500
            text-white
            py-2
            rounded-lg
            text-sm
            hover:bg-green-600
            "
          >
            Book Now
          </button>
        )}

        {/* Admin */}
        {isAdminPage && (
          <>
            <button
              onClick={() =>
                navigate(`/admin/edit-event/${event._id}`)
              }
              className="
              w-full
              sm:flex-1
              bg-yellow-500
              text-white
              py-2
              rounded-lg
              text-sm
              hover:bg-yellow-600
              "
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="
              w-full
              sm:flex-1
              bg-red-500
              text-white
              py-2
              rounded-lg
              text-sm
              hover:bg-red-600
              "
            >
              Delete
            </button>
          </>
        )}
      </div>

      {/* Seat selector */}
      {showSeat && !isAdminPage && (
        <div
          className="
          mt-3
          border
          p-3
          rounded-lg
          bg-gray-50
          "
        >
          <p className="text-sm font-semibold mb-2">
            Select Seats
          </p>

          {/* seat control */}
          <div className="flex justify-center items-center gap-3 mb-3">

            <button
              onClick={() =>
                setSeats(seats > 1 ? seats - 1 : 1)
              }
              className="
              px-3
              py-1
              bg-gray-300
              rounded
              "
            >
              -
            </button>

            <span className="font-bold text-lg">
              {seats}
            </span>

            <button
              onClick={() =>
                setSeats(
                  seats < event.availableSeats
                    ? seats + 1
                    : seats
                )
              }
              className="
              px-3
              py-1
              bg-gray-300
              rounded
              "
            >
              +
            </button>
          </div>

          {/* confirm */}
          <button
            onClick={handleBook}
            className="
            w-full
            bg-emerald-600
            text-white
            py-2
            rounded-lg
            text-sm
            hover:bg-emerald-700
            "
          >
            Confirm Booking
          </button>

          {/* cancel */}
          <button
            onClick={() => setShowSeat(false)}
            className="
            w-full
            mt-2
            bg-gray-400
            text-white
            py-2
            rounded-lg
            text-sm
            "
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default EventCard;