import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { bookEvent } from "../services/bookingService";
import { deleteEvent } from "../services/eventService";
import { motion } from "framer-motion";
import { getStoredUser } from "../utils/authStorage";
import {
  CalendarDays,
  MapPin,
  Ticket,
  IndianRupee,
  UserCircle2,
  Pencil,
  Trash2,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const user = getStoredUser();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const SERVER_URL = API_URL.replace("/api", "");

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(`/events/${id}`);
      setEvent(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load event");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleBook = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "user") {
      alert("Only users can book events");
      return;
    }

    if (seats < 1 || seats > event.availableSeats) {
      return alert("Invalid seat count");
    }

    try {
      setActionLoading(true);
      await bookEvent({ eventId: event._id, seats });
      alert("Booking confirmed!");
      fetchEvent();
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      setActionLoading(true);
      await deleteEvent(event._id);
      alert("Event deleted successfully");
      navigate("/admin");
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  const imageUrl = useMemo(() => {
    if (!event?.image) return "/placeholder.jpg";

    // Handle Cloudinary URLs (already full HTTPS URLs)
    if (event.image.startsWith("http")) {
      return event.image;
    }

    // Handle local storage URLs
    return `${SERVER_URL}${event.image.startsWith("/") ? "" : "/"}${event.image}`;
  }, [event, SERVER_URL]);

  const totalPrice = (event?.price || 0) * seats;
  const isAdmin = user?.role === "admin";
  const isOrganizer = user?.role === "organizer";
  const isUserOrGuest = !user || user?.role === "user";

  const infoCards = event
    ? [
        {
          title: "Event Date",
          value: new Date(event.date).toLocaleDateString(),
          icon: CalendarDays,
          linear: "from-indigo-500 to-blue-600",
          text: "text-indigo-300",
        },
        {
          title: "Location",
          value: event.location,
          icon: MapPin,
          linear: "from-pink-500 to-rose-600",
          text: "text-pink-300",
        },
        {
          title: "Ticket Price",
          value: `₹ ${event.price}`,
          icon: IndianRupee,
          linear: "from-emerald-500 to-green-600",
          text: "text-emerald-300",
        },
        {
          title: "Seats Left",
          value: event.availableSeats,
          icon: Ticket,
          linear: "from-violet-500 to-fuchsia-600",
          text: "text-violet-300",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="site-shell flex items-center justify-center px-4">
        <div className="glass-panel rounded-[28px] px-8 py-12 text-center text-white">
          <div className="mx-auto mb-4 h-14 w-14 animate-pulse rounded-2xl bg-linear-to-r from-fuchsia-500 to-indigo-600" />
          <p className="text-xl font-semibold">Loading event...</p>
          <p className="mt-2 text-sm text-slate-300">
            Please wait while we fetch event details.
          </p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="site-shell flex items-center justify-center px-4">
        <div className="rounded-[28px] border border-red-400/20 bg-red-500/10 px-8 py-12 text-center text-red-300 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
          <p className="text-2xl font-bold">Event not found</p>
          <button
            onClick={() => navigate("/")}
            className="mt-5 rounded-2xl bg-linear-to-r from-fuchsia-500 to-indigo-600 px-5 py-3 font-semibold text-white"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="site-shell text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full">
        {/* top actions */}
        <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-xl transition hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-300 sm:text-xs sm:tracking-[0.18em]">
            <Sparkles className="h-4 w-4" />
            Premium Event View
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.55fr,0.8fr]">
          {/* LEFT SIDE */}
          <div className="space-y-8">
            {/* HERO IMAGE */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="glass-panel relative overflow-hidden rounded-4xl"
            >
              <div className="relative group">
                <img
                  src={imageUrl}
                  alt={event.title}
                  className="h-70 w-full object-cover sm:h-95 lg:h-115 transition duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg";
                  }}
                />

                <div className="absolute inset-0 bg-linear-to-t from-[#081120] via-[#081120]/25 to-transparent" />
                <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-pink-500/20 blur-3xl" />
                <div className="absolute -right-10 bottom-10 h-32 w-32 rounded-full bg-cyan-500/15 blur-3xl" />

                <div className="absolute left-0 right-0 top-0 flex flex-wrap items-center justify-between gap-2 p-4 sm:p-6">
                    <span className="rounded-full border border-white/20 bg-linear-to-r from-fuchsia-500/90 via-pink-500/90 to-violet-600/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-lg backdrop-blur-md sm:px-4 sm:py-2 sm:text-xs">
                      {event.category}
                    </span>

                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-300 sm:px-4 sm:py-2 sm:text-xs">
                    {event.availableSeats > 0 ? "Open for Booking" : "Sold Out"}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                  <h1 className="max-w-4xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                    {event.title}
                  </h1>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-300">
                      <CalendarDays className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* DESCRIPTION */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="glass-panel rounded-[28px] p-6 sm:p-7"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r from-pink-500 to-violet-600 shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Event Overview
                  </h2>
                  <p className="text-sm text-slate-300">
                    Everything you need to know about this event.
                  </p>
                </div>
              </div>

              <p className="text-sm leading-7 text-slate-200 sm:text-base">
                {event.description}
              </p>

              {event.organizerName && (
                <div className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <UserCircle2 className="h-4.5 w-4.5 text-cyan-300" />
                  Organizer: {event.organizerName}
                </div>
              )}
            </motion.div>

            {/* INFO CARDS */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {infoCards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    className="glass-panel relative overflow-hidden rounded-3xl p-5"
                  >
                    <div
                      className={`absolute top-0 left-0 h-1.5 w-full bg-linear-to-r ${card.linear}`}
                    />
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-slate-300">{card.title}</p>
                        <h3 className={`mt-2 text-xl font-bold ${card.text} wrap-break-word`}>
                          {card.value}
                        </h3>
                      </div>

                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-r ${card.linear} shadow-lg`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="h-fit xl:sticky xl:top-24"
          >
            <div className="glass-panel overflow-hidden rounded-[28px]">
              <div className="bg-linear-to-r from-fuchsia-500 via-violet-500 to-indigo-600 px-6 py-5">
                <h2 className="text-2xl font-bold text-white">Event Actions</h2>
                <p className="mt-1 text-sm text-white/80">
                  Reserve your seats or manage this event.
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-slate-400">Price / Seat</p>
                    <p className="mt-1 text-lg font-bold text-emerald-300">
                      ₹ {event.price}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-slate-400">Available</p>
                    <p className="mt-1 text-lg font-bold text-violet-300">
                      {event.availableSeats}
                    </p>
                  </div>
                </div>

                {isUserOrGuest && (
                  <>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="font-medium text-white">Select Seats</p>
                        <span className="text-sm text-slate-400">
                          Max {event.availableSeats}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0f172a]/60 p-3">
                        <button
                          onClick={() => setSeats((prev) => Math.max(1, prev - 1))}
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-r from-rose-500 to-red-600 text-lg font-bold text-white shadow-lg transition hover:scale-105"
                        >
                          -
                        </button>

                        <span className="text-2xl font-bold text-white">{seats}</span>

                        <button
                          onClick={() =>
                            setSeats((prev) =>
                              Math.min(event.availableSeats || 1, prev + 1),
                            )
                          }
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-r from-emerald-500 to-green-600 text-lg font-bold text-white shadow-lg transition hover:scale-105"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-linear-to-r from-emerald-500/10 to-cyan-500/10 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-medium text-slate-300">
                          Total Amount
                        </span>
                        <span className="text-2xl font-bold text-emerald-300">
                          ₹ {totalPrice}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {isOrganizer ? (
                  <button
                    onClick={() => navigate(`/organizer/edit-event/${event._id}`)}
                    disabled={actionLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-sky-500 to-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:scale-[1.02] disabled:opacity-50"
                  >
                    <Pencil className="h-4 w-4" />
                    {actionLoading ? "Processing..." : "Edit Event"}
                  </button>
                ) : isAdmin ? (
                  <button
                    onClick={handleDelete}
                    disabled={actionLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-rose-500 to-red-600 py-3.5 font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:scale-[1.02] disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {actionLoading ? "Deleting..." : "Delete Event"}
                  </button>
                ) : (
                  <button
                    onClick={handleBook}
                    disabled={event.availableSeats === 0 || actionLoading}
                    className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-semibold transition ${
                      event.availableSeats === 0 || actionLoading
                        ? "cursor-not-allowed bg-gray-500/70 text-white"
                        : "bg-linear-to-r from-fuchsia-500 via-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:scale-[1.02]"
                    }`}
                  >
                    <Ticket className="h-4 w-4" />
                    {event.availableSeats === 0
                      ? "Sold Out"
                      : actionLoading
                        ? "Processing..."
                        : "Book Now"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
