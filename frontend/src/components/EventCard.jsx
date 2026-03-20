import { deleteEvent } from "../services/eventService";
import { useNavigate, useLocation } from "react-router-dom";
import { bookEvent } from "../services/bookingService";

function EventCard({ event, refresh }) {
  const navigate = useNavigate();
  const location = useLocation();

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
        seats: 1,
      });

      alert("Booking successful");
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
      <h2 className="text-lg sm:text-xl font-bold mb-1 break-words">
        {event.title}
      </h2>

      {/* Category */}
      <p className="text-xs sm:text-sm text-gray-500 mb-2">{event.category}</p>

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
        <span
          className="
          bg-green-100
          text-green-700
          px-2 sm:px-3
          py-1
          rounded
          text-xs sm:text-sm
          "
        >
          ₹ {event.price}
        </span>

        <span
          className="
          bg-blue-100
          text-blue-700
          px-2 sm:px-3
          py-1
          rounded
          text-xs sm:text-sm
          "
        >
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
          hover:bg-indigo-700
          text-sm
          "
        >
          View
        </button>

        {/* Book button (user) */}
        {!isAdminPage && (
          <button
            onClick={handleBook}
            className="
            w-full
            sm:flex-1
            bg-gradient-to-r
            from-green-500
            to-emerald-600
            text-white
            py-2
            rounded-lg
            text-sm
            "
          >
            Book Now
          </button>
        )}

        {/* Admin buttons */}
        {isAdminPage && (
          <>
            <button
              onClick={() => navigate(`/admin/edit-event/${event._id}`)}
              className="
              w-full
              sm:flex-1
              bg-yellow-500
              text-white
              py-2
              rounded-lg
              hover:bg-yellow-600
              text-sm
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
              hover:bg-red-600
              text-sm
              "
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default EventCard;
