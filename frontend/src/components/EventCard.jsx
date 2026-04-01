import { deleteEvent } from "../services/eventService";
import { useNavigate, useLocation } from "react-router-dom";
import { bookEvent } from "../services/bookingService";
import { useState } from "react";

function EventCard({ event, refresh }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showSeat, setShowSeat] = useState(false);
  const [seats, setSeats] = useState(1);
  const [liked, setLiked] = useState(false);

  const isAdminPage = location.pathname.includes("/admin");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const SERVER_URL = API_URL.replace("/api", "");

  const imageUrl = `${SERVER_URL}/${event.image}`;

  const total = seats * event.price;

  const handleDelete = async () => {
    await deleteEvent(event._id);
    refresh && refresh();
  };

  const handleBook = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");

    try {
      await bookEvent({ eventId: event._id, seats });
      alert("🎉 Booked!");
      setShowSeat(false);
      refresh && refresh();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.7)] transition-all duration-500 hover:-translate-y-3">
      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          className="w-full h-56 object-cover transition duration-700 group-hover:scale-110 group-hover:brightness-75"
        />

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* TOP BAR */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
          {/* CATEGORY */}
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full shadow-lg">
            {event.category}
          </span>

          {/* LIKE BUTTON */}
          <button
            onClick={() => setLiked(!liked)}
            className={`text-xl transition ${
              liked ? "text-red-500 scale-125" : "text-white"
            }`}
          >
            ❤️
          </button>
        </div>

        {/* TITLE */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-lg font-bold leading-tight">{event.title}</h2>
        </div>

        {/* FLOATING ACTION BAR */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition duration-500">
          <div className="bg-black/80 backdrop-blur-md p-3 flex justify-between items-center text-white text-sm">
            <span>₹ {event.price}</span>

            <span className="text-green-400">🎟 {event.availableSeats}</span>

            <button
              onClick={() => navigate(`/event/${event._id}`)}
              className="px-3 py-1 bg-indigo-600 rounded-full text-xs"
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 text-white space-y-3">
        <p className="text-sm text-gray-300 line-clamp-2">
          {event.description}
        </p>

        <div className="text-xs text-gray-400 space-y-1">
          <p>📅 {new Date(event.date).toLocaleDateString()}</p>
          <p>📍 {event.location}</p>
        </div>

        {/* ACTION BUTTONS */}
        {!isAdminPage && !showSeat && (
          <button
            onClick={() => setShowSeat(true)}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-pink-500/40 hover:scale-[1.03] transition"
          >
            🎟 Book Now
          </button>
        )}

        {isAdminPage && (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/admin/edit-event/${event._id}`)}
              className="flex-1 py-2 rounded-xl bg-yellow-500 text-white"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="flex-1 py-2 rounded-xl bg-red-500 text-white"
            >
              Delete
            </button>
          </div>
        )}

        {/* BOOKING PANEL */}
        {showSeat && !isAdminPage && (
          <div className="mt-3 bg-black/80 backdrop-blur-xl p-4 rounded-xl border border-white/20 space-y-3 animate-fadeIn">
            <div className="flex justify-between items-center">
              <span>Select Seats</span>
              <span className="text-green-400">₹ {total}</span>
            </div>

            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => setSeats(seats > 1 ? seats - 1 : 1)}
                className="w-10 h-10 bg-red-500 rounded-full"
              >
                -
              </button>

              <span className="text-xl font-bold">{seats}</span>

              <button
                onClick={() =>
                  setSeats(seats < event.availableSeats ? seats + 1 : seats)
                }
                className="w-10 h-10 bg-green-500 rounded-full"
              >
                +
              </button>
            </div>

            <button
              onClick={handleBook}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-600 font-semibold hover:scale-[1.05] transition"
            >
              Confirm 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventCard;
