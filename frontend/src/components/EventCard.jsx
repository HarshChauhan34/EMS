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

  const imageUrl = event.image
    ? `http://localhost:5000/${event.image}`
    : `https://ems-4-dflv.onrender.com/${event.image}`;

  return (
    <div
      className="
      rounded-2xl
      overflow-hidden
      shadow-lg
      hover:shadow-2xl
      transition
      duration-300
      flex
      flex-col
      h-full
      bg-white/80
      backdrop-blur-md
      border
      hover:-translate-y-2
      "
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt=""
          className="
          w-full
          h-48
          object-cover
          transition
          duration-300
          hover:scale-110
          "
        />

        {/* gradient overlay */}
        <div
          className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/50
          to-transparent
          "
        />

        {/* category badge */}
        <span
          className="
          absolute
          top-2
          left-2
          bg-gradient-to-r
          from-pink-500
          to-purple-600
          text-white
          text-xs
          px-3
          py-1
          rounded-full
          shadow
          "
        >
          {event.category}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        {/* TITLE */}
        <h2 className="text-lg font-bold text-gray-800">{event.title}</h2>

        {/* DESCRIPTION */}
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {event.description}
        </p>

        {/* INFO */}
        <div className="mt-3 text-sm space-y-1 text-gray-700">
          <p>📅 {new Date(event.date).toLocaleDateString()}</p>
          <p>📍 {event.location}</p>
        </div>

        {/* PRICE + SEATS */}
        <div className="flex justify-between mt-3">
          <span
            className="
            bg-green-200
            text-green-800
            px-3
            py-1
            rounded-full
            text-xs
            font-semibold
            "
          >
            ₹ {event.price}
          </span>

          <span
            className="
            bg-blue-200
            text-blue-800
            px-3
            py-1
            rounded-full
            text-xs
            font-semibold
            "
          >
            Seats {event.availableSeats}
          </span>
        </div>

        {/* BUTTONS */}
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={() => navigate(`/event/${event._id}`)}
            className="
            w-full
            bg-gradient-to-r
            from-indigo-600
            to-purple-600
            text-white
            py-2
            rounded-lg
            hover:scale-105
            transition
            shadow
            "
          >
            View Details
          </button>

          {!isAdminPage && !showSeat && (
            <button
              onClick={() => setShowSeat(true)}
              className="
              w-full
              bg-gradient-to-r
              from-green-500
              to-emerald-600
              text-white
              py-2
              rounded-lg
              hover:scale-105
              transition
              shadow
              "
            >
              Book Now
            </button>
          )}

          {isAdminPage && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/admin/edit-event/${event._id}`)}
                className="
                flex-1
                bg-gradient-to-r
                from-yellow-400
                to-orange-500
                text-white
                py-2
                rounded-lg
                "
              >
                Edit
              </button>

              <button
                onClick={handleDelete}
                className="
                flex-1
                bg-gradient-to-r
                from-red-500
                to-pink-600
                text-white
                py-2
                rounded-lg
                "
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* SEAT SELECTOR */}
        {showSeat && !isAdminPage && (
          <div
            className="
            mt-3
            bg-white/90
            backdrop-blur-md
            p-3
            rounded-lg
            border
            shadow
            "
          >
            <p className="text-sm font-semibold mb-2">Select Seats</p>

            <div className="flex justify-center items-center gap-3 mb-3">
              <button
                onClick={() => setSeats(seats > 1 ? seats - 1 : 1)}
                className="
                px-3
                py-1
                bg-gray-300
                rounded
                "
              >
                -
              </button>

              <span className="font-bold text-lg">{seats}</span>

              <button
                onClick={() =>
                  setSeats(seats < event.availableSeats ? seats + 1 : seats)
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

            <button
              onClick={handleBook}
              className="
              w-full
              bg-gradient-to-r
              from-emerald-500
              to-green-700
              text-white
              py-2
              rounded-lg
              "
            >
              Confirm Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventCard;
