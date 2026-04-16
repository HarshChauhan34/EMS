import { deleteEvent } from "../services/eventService";
import { useNavigate } from "react-router-dom";
import { bookEvent } from "../services/bookingService";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getStoredUser } from "../utils/authStorage";
import {
  CalendarDays,
  MapPin,
  UserCircle2,
  Ticket,
  Heart,
  Pencil,
  Trash2,
} from "lucide-react";

function EventCard({ event, refresh }) {
  const navigate = useNavigate();

  const [showSeat, setShowSeat] = useState(false);
  const [seats, setSeats] = useState(1);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = getStoredUser();

  const isAdmin = user?.role === "admin";
  const isOrganizer = user?.role === "organizer";
  const isNormalUser = user?.role === "user" || !user;

  const API_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:5000";

  const imageUrl = useMemo(() => {
    if (!event?.image) {
      return "https://via.placeholder.com/600x400?text=No+Image";
    }
    // Handle Cloudinary URLs (already full HTTPS URLs)
    if (event.image.startsWith("http")) {
      return event.image;
    }
    // Handle local storage URLs
    return `${API_URL}${event.image.startsWith("/") ? "" : "/"}${event.image}`;
  }, [API_URL, event?.image]);

  const total = seats * (event.price || 0);

  const formattedDate = event?.date
    ? new Date(event.date).toLocaleDateString()
    : "Date not available";

  const handleDelete = async (e) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      setLoading(true);
      await deleteEvent(event._id);
      alert("Event deleted successfully");
      refresh && refresh();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (e) => {
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "user") {
      return alert("Only users can book events");
    }

    if (seats < 1 || seats > event.availableSeats) {
      return alert("Invalid seat count");
    }

    try {
      setLoading(true);
      await bookEvent({ eventId: event._id, seats });
      alert("Booked successfully");
      setShowSeat(false);
      setSeats(1);
      refresh && refresh();
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      onClick={() => navigate(`/event/${event._id}`)}
      className="glass-panel group relative flex min-h-[34rem] cursor-pointer flex-col overflow-hidden rounded-[28px] transition-all duration-500 hover:border-white/25 hover:shadow-[0_30px_80px_rgba(99,102,241,0.22)] sm:min-h-[35rem]"
    >
      {/* decorative glow */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-36 w-36 rounded-full bg-pink-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />

      {/* image section */}
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={event?.title || "Event"}
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/600x400?text=Image+Unavailable";
          }}
          className="h-64 w-full object-cover transition duration-700 group-hover:scale-110 group-hover:brightness-75"
        />

        <div className="absolute inset-0 bg-linear-to-t from-[#0b1020] via-[#0b1020]/30 to-transparent" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-5">
          <span className="max-w-[75%] truncate rounded-full border border-white/20 bg-linear-to-r from-fuchsia-500/90 via-pink-500/90 to-purple-600/90 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-lg backdrop-blur-md">
            {event?.category || "Event"}
          </span>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={(e) => {
              e.stopPropagation();
              setLiked((prev) => !prev);
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-md transition ${
              liked
                ? "text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                : "text-white"
            }`}
          >
            <Heart
              className={`h-5 w-5 ${liked ? "fill-current" : ""}`}
              strokeWidth={2.2}
            />
          </motion.button>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
              ₹ {event?.price || 0}
            </span>

            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
              {event?.availableSeats || 0} seats left
            </span>
          </div>

          <h2 className="min-h-15 text-xl font-bold leading-tight text-white sm:text-2xl line-clamp-2">
            {event?.title || "Untitled Event"}
          </h2>
        </div>
      </div>

      {/* content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="min-h-12 text-sm leading-6 text-slate-300 line-clamp-2">
          {event?.description || "No description available for this event."}
        </p>

        <div className="mt-4 grid gap-3">
          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/4 px-3.5 py-3">
            <CalendarDays className="mt-0.5 h-4.5 w-4.5 text-violet-300 shrink-0" />
            <span className="text-sm text-slate-200">{formattedDate}</span>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/4 px-3.5 py-3">
            <MapPin className="mt-0.5 h-4.5 w-4.5 text-pink-300 shrink-0" />
            <span className="text-sm text-slate-200 line-clamp-1">
              {event?.location || "Location not available"}
            </span>
          </div>

          {event?.organizerName && (
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/4 px-3.5 py-3">
              <UserCircle2 className="mt-0.5 h-4.5 w-4.5 text-cyan-300 shrink-0" />
              <span className="text-sm text-slate-200 line-clamp-1">
                {event.organizerName}
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-5">
          {/* normal user button */}
          {isNormalUser && !showSeat && (
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowSeat(true);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-fuchsia-500 via-violet-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:shadow-xl hover:shadow-violet-500/20"
            >
              <Ticket className="h-4.5 w-4.5" />
              Book Now
            </motion.button>
          )}

          {/* organizer buttons */}
          <AnimatePresence>
            {isOrganizer && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.28 }}
                onClick={(e) => e.stopPropagation()}
                className="grid grid-cols-2 gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/organizer/edit-event/${event._id}`)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-sky-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-sky-500/20"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-rose-500 to-red-600 px-4 py-3 font-semibold text-white shadow-lg shadow-rose-500/20 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {loading ? "Deleting..." : "Delete"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* admin button */}
          <AnimatePresence>
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.28 }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-rose-500 to-red-600 px-4 py-3 font-semibold text-white shadow-lg shadow-rose-500/20 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {loading ? "Deleting..." : "Delete"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* booking panel */}
          <AnimatePresence>
            {showSeat && isNormalUser && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 14, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                className="rounded-2xl border border-white/15 bg-linear-to-br from-slate-950/80 via-slate-900/75 to-indigo-950/75 p-4 shadow-xl backdrop-blur-xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">
                    Select Seats
                  </span>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-300">
                    ₹ {total}
                  </span>
                </div>

                <div className="mb-4 flex items-center justify-center gap-5">
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setSeats((prev) => Math.max(1, prev - 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-r from-rose-500 to-red-600 text-lg font-bold text-white shadow-lg"
                  >
                    -
                  </motion.button>

                  <div className="min-w-18 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-center text-xl font-bold text-white">
                    {seats}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() =>
                      setSeats((prev) =>
                        Math.min(event.availableSeats, prev + 1),
                      )
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-r from-emerald-500 to-green-600 text-lg font-bold text-white shadow-lg"
                  >
                    +
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBook}
                  disabled={loading}
                  className="w-full rounded-2xl bg-linear-to-r from-emerald-400 via-green-500 to-teal-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Confirm Booking"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default EventCard;
