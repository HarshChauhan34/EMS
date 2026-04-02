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
  const [loading, setLoading] = useState(false);

  const isAdminPage = location.pathname.includes("/admin");

  const API_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:5000";

  // ✅ Safe image URL (fix double slash issue)
  const imageUrl = event?.image
    ? `${API_URL}${event.image.startsWith("/") ? "" : "/"}${event.image}`
    : "https://via.placeholder.com/400x250?text=No+Image";

  const total = seats * (event.price || 0);

  // ================= DELETE =================
  const handleDelete = async (e) => {
    e.stopPropagation();

    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await deleteEvent(event._id);
      refresh && refresh();
    } catch (error) {
      alert("Delete failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ================= BOOK =================
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
    <div
      onClick={() => navigate(`/event/${event._id}`)}
      className="group cursor-pointer relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
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
          className="w-full h-56 object-cover transition duration-700 group-hover:scale-110 group-hover:brightness-75"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* TOP BAR */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-xs px-3 py-1 rounded-full">
            {event.category}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className={`text-xl transition ${
              liked ? "text-red-500 scale-125" : "text-white"
            }`}
          >
            ❤️
          </button>
        </div>

        {/* TITLE */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-lg font-bold">{event.title}</h2>
        </div>

        {/* HOVER BAR */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition duration-500">
          <div className="bg-black/80 p-3 flex justify-between items-center text-sm">
            <span>₹ {event.price}</span>
            <span className="text-green-400">🎟 {event.availableSeats}</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 text-white space-y-3">
        <p className="text-sm text-gray-300 line-clamp-2">
          {event.description}
        </p>

        <div className="text-xs text-gray-400">
          <p>📅 {new Date(event.date).toLocaleDateString()}</p>
          <p>📍 {event.location}</p>
        </div>

        {/* USER ACTION */}
        {!isAdminPage && !showSeat && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSeat(true);
            }}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 font-semibold hover:scale-[1.03] transition"
          >
            🎟 Book Now
          </button>
        )}

        {/* ADMIN ACTION */}
        {isAdminPage && (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/edit-event/${event._id}`);
              }}
              className="flex-1 py-2 rounded-xl bg-yellow-500"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 py-2 rounded-xl bg-red-500"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}

        {/* BOOKING PANEL */}
        {showSeat && !isAdminPage && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-3 bg-black/80 p-4 rounded-xl border border-white/20 space-y-3"
          >
            <div className="flex justify-between">
              <span>Select Seats</span>
              <span className="text-green-400">₹ {total}</span>
            </div>

            <div className="flex justify-center gap-4 items-center">
              <button
                onClick={() => setSeats((prev) => Math.max(1, prev - 1))}
                className="w-10 h-10 bg-red-500 rounded-full"
              >
                -
              </button>

              <span className="text-xl font-bold">{seats}</span>

              <button
                onClick={() =>
                  setSeats((prev) => Math.min(event.availableSeats, prev + 1))
                }
                className="w-10 h-10 bg-green-500 rounded-full"
              >
                +
              </button>
            </div>

            <button
              onClick={handleBook}
              disabled={loading}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-600 hover:scale-[1.05] transition"
            >
              {loading ? "Processing..." : "Confirm 🚀"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventCard;
