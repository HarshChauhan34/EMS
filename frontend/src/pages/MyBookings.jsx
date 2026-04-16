import { useCallback, useEffect, useMemo, useState } from "react";
import { getMyBookings, cancelBooking } from "../services/bookingService";
import { motion } from "framer-motion";
import {
  Ticket,
  CalendarDays,
  MapPin,
  IndianRupee,
  Clock3,
  XCircle,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoadingId, setCancelLoadingId] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getMyBookings();

      const safeBookings = (res.data || []).filter(
        (b) => b.bookingStatus !== "cancelled",
      );

      setBookings(safeBookings);
    } catch (error) {
      console.error("FETCH BOOKINGS ERROR:", error);
      alert(error.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?",
    );
    if (!confirmCancel) return;

    try {
      setCancelLoadingId(id);
      await cancelBooking(id);

      setBookings((prev) => prev.filter((booking) => booking._id !== id));

      alert("Booking cancelled successfully");
    } catch (error) {
      console.error("CANCEL BOOKING ERROR:", error);
      alert(error.response?.data?.message || "Cancel failed");
    } finally {
      setCancelLoadingId(null);
    }
  };

  const totalSpent = useMemo(() => {
    return bookings.reduce(
      (sum, booking) => sum + (booking.totalAmount || 0),
      0,
    );
  }, [bookings]);

  const totalSeats = useMemo(() => {
    return bookings.reduce(
      (sum, booking) => sum + (booking.seatsBooked || 0),
      0,
    );
  }, [bookings]);

  const activeBookings = useMemo(() => {
    return bookings.filter((b) => b.bookingStatus === "confirmed").length;
  }, [bookings]);

  return (
    <div className="site-shell text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="glass-panel relative overflow-hidden rounded-[30px] px-5 py-8 sm:px-8 sm:py-10 mb-8">
          <div className="absolute -top-16 -left-10 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                <Ticket className="h-4 w-4" />
                Booking Center
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                My Bookings
              </h1>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-300">
                Manage your confirmed tickets, review upcoming event details,
                and cancel bookings when needed.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300">
              Easy ticket management • Clean event history • Fast actions
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="glass-panel rounded-[28px] px-6 py-16 text-center">
            <div className="mx-auto mb-4 h-14 w-14 animate-pulse rounded-2xl bg-linear-to-r from-fuchsia-500 to-indigo-600" />
            <p className="text-lg font-semibold text-white">
              Loading bookings...
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Please wait while we fetch your tickets.
            </p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && bookings.length === 0 && (
          <div className="glass-panel rounded-[28px] border-dashed px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-r from-pink-500 to-violet-600 shadow-lg">
              <Ticket className="h-7 w-7 text-white" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-white">
              No bookings yet
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Start exploring events and book your first ticket.
            </p>
          </div>
        )}

        {/* BOOKINGS GRID */}
        {!loading && bookings.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
            {bookings.map((b, index) => {
              const eventDeleted = !b.event;
              const isCancelling = cancelLoadingId === b._id;

              return (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="glass-panel relative flex min-h-80 flex-col justify-between overflow-hidden rounded-[28px] p-5"
                >
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-fuchsia-500/10 blur-2xl" />
                  <div className="absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-cyan-500/10 blur-2xl" />

                  {/* TOP */}
                  <div className="relative">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-white line-clamp-2">
                          {eventDeleted
                            ? "Event no longer available"
                            : b.event.title}
                        </h2>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                              eventDeleted
                                ? "border border-yellow-400/20 bg-yellow-400/10 text-yellow-300"
                                : "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                            }`}
                          >
                            {eventDeleted ? (
                              <Clock3 className="h-3.5 w-3.5" />
                            ) : (
                              <BadgeCheck className="h-3.5 w-3.5" />
                            )}
                            {eventDeleted ? "Event Deleted" : "Confirmed"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <MapPin className="h-4.5 w-4.5 shrink-0 text-pink-300" />
                        <span className="text-sm text-slate-200 line-clamp-1">
                          {eventDeleted ? "N/A" : b.event.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <CalendarDays className="h-4.5 w-4.5 shrink-0 text-cyan-300" />
                        <span className="text-sm text-slate-200">
                          {eventDeleted
                            ? "N/A"
                            : new Date(b.event.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* MIDDLE */}
                  <div className="relative mt-5 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs text-slate-400">Seats</p>
                      <p className="mt-1 text-lg font-bold text-violet-300">
                        {b.seatsBooked}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs text-slate-400">Amount</p>
                      <p className="mt-1 text-lg font-bold text-emerald-300">
                        ₹ {b.totalAmount}
                      </p>
                    </div>
                  </div>

                  {/* BOTTOM */}
                  <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <p className="text-xs text-slate-400">
                      Booked on {new Date(b.createdAt).toLocaleDateString()}
                    </p>

                    {!eventDeleted && b.bookingStatus === "confirmed" && (
                      <button
                        onClick={() => handleCancel(b._id)}
                        disabled={isCancelling}
                        className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-rose-500 to-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:scale-[1.02] disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        {isCancelling ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
