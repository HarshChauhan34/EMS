import { deleteEvent } from "../services/eventService";
import { useNavigate, useLocation } from "react-router-dom";
import { bookEvent } from "../services/bookingService";
import { useState } from "react";
import { motion } from "framer-motion";

function EventCard({ event, refresh }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showSeat, setShowSeat] = useState(false);
  const [seats, setSeats] = useState(1);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const isAdminPage = location.pathname.includes("/admin");

  const API_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:5000";

  const imageUrl = event?.image
    ? `${API_URL}${event.image.startsWith("/") ? "" : "/"}${event.image}`
    : "https://via.placeholder.com/400x250?text=No+Image";

  const total = seats * (event.price || 0);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      setLoading(true);
      await deleteEvent(event._id);
      refresh && refresh();
    } catch {
      alert("Delete failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (e) => {
    e.stopPropagation();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");

    if (seats < 1 || seats > event.availableSeats) {
      return alert("Invalid seat count ❌");
    }

    try {
      setLoading(true);
      await bookEvent({ eventId: event._id, seats });
      alert("🎉 Booked successfully!");
      setShowSeat(false);
      setSeats(1);
      refresh && refresh();
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => navigate(`/event/${event._id}`)}
      className="group cursor-pointer relative rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500"
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={event.title}
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/400x250?text=Image+Error")
          }
          className="w-full h-60 object-cover transition duration-700 group-hover:scale-110 group-hover:brightness-75"
        />

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* CATEGORY + LIKE */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <span className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-md">
            {event.category}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className={`text-2xl transition-transform duration-300 ${
              liked ? "text-red-500 scale-125" : "text-white"
            }`}
          >
            ♥
          </button>
        </div>

        {/* TITLE */}
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <h2 className="text-xl font-bold leading-tight line-clamp-2">
            {event.title}
          </h2>
        </div>

        {/* PRICE BAR */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition duration-500">
          <div className="bg-black/80 backdrop-blur-md px-4 py-3 flex justify-between text-sm">
            <span className="font-semibold text-yellow-300">
              ₹ {event.price}
            </span>
            <span className="text-green-400">🎟 {event.availableSeats}</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 text-white space-y-4">
        <p className="text-sm text-gray-300 line-clamp-2">
          {event.description}
        </p>

        <div className="text-xs text-gray-400 space-y-1">
          <p>📅 {new Date(event.date).toLocaleDateString()}</p>
          <p>📍 {event.location}</p>
        </div>

        {/* USER BUTTON */}
        {!isAdminPage && !showSeat && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSeat(true);
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 font-semibold shadow-md hover:shadow-lg hover:scale-[1.04] transition-all"
          >
            🎟 Book Now
          </button>
        )}

        {/* ADMIN */}
        {isAdminPage && (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/edit-event/${event._id}`);
              }}
              className="flex-1 py-2 rounded-xl bg-yellow-500 hover:scale-105 transition"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 py-2 rounded-xl bg-red-500 hover:scale-105 transition"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}

        {/* BOOKING PANEL */}
        {showSeat && !isAdminPage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-black/70 backdrop-blur-lg p-4 rounded-xl border border-white/20 space-y-4"
          >
            <div className="flex justify-between items-center">
              <span>Select Seats</span>
              <span className="text-green-400 font-semibold">₹ {total}</span>
            </div>

            <div className="flex justify-center items-center gap-5">
              <button
                onClick={() => setSeats((prev) => Math.max(1, prev - 1))}
                className="w-10 h-10 rounded-full bg-red-500 hover:scale-110 transition"
              >
                -
              </button>

              <span className="text-xl font-bold">{seats}</span>

              <button
                onClick={() =>
                  setSeats((prev) => Math.min(event.availableSeats, prev + 1))
                }
                className="w-10 h-10 rounded-full bg-green-500 hover:scale-110 transition"
              >
                +
              </button>
            </div>

            <button
              onClick={handleBook}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-green-400 to-emerald-600 font-semibold hover:scale-[1.05] transition"
            >
              {loading ? "Processing..." : "Confirm Booking 🚀"}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default EventCard;
