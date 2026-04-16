import { useCallback, useEffect, useMemo, useState } from "react";
import { getEvents } from "../../services/eventService";
import EventCard from "../../components/EventCard";
import {
  getAllUsers,
  getAllOrganizers,
  getPendingOrganizerRequests,
  approveOrganizer,
  rejectOrganizer,
} from "../../services/adminService";
import { getAllBookings } from "../../services/bookingService";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Users,
  Ticket,
  ShieldCheck,
  IndianRupee,
  RefreshCcw,
  Mail,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [organizerRequests, setOrganizerRequests] = useState([]);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await getEvents();
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchOrganizerRequests = useCallback(async () => {
    try {
      const res = await getPendingOrganizerRequests();
      setOrganizerRequests(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchOrganizers = useCallback(async () => {
    try {
      const res = await getAllOrganizers();
      setOrganizers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoadingId(id);
      await approveOrganizer(id);
      alert("Organizer approved successfully");

      setOrganizerRequests((prev) => prev.filter((org) => org._id !== id));
      fetchOrganizers();
    } catch (error) {
      alert(error.response?.data?.message || "Approve failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this organizer request?",
    );
    if (!confirmReject) return;

    try {
      setActionLoadingId(id);
      await rejectOrganizer(id);
      alert("Organizer request rejected");

      setOrganizerRequests((prev) => prev.filter((org) => org._id !== id));
      fetchOrganizers();
    } catch (error) {
      alert(error.response?.data?.message || "Reject failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const revenue = useMemo(() => {
    return bookings.reduce((total, b) => total + (b.totalAmount || 0), 0);
  }, [bookings]);

  const pendingRequests = organizerRequests.length;

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [eventsRes, usersRes, organizersRes, bookingsRes, pendingRes] =
          await Promise.all([
            getEvents(),
            getAllUsers(),
            getAllOrganizers(),
            getAllBookings(),
            getPendingOrganizerRequests(),
          ]);

        const usersOnly = (usersRes.data || []).filter(
          (u) => u.role === "user",
        );

        setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
        setUsers(usersOnly);
        setOrganizers(
          Array.isArray(organizersRes.data) ? organizersRes.data : [],
        );
        setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
        setOrganizerRequests(
          Array.isArray(pendingRes.data) ? pendingRes.data : [],
        );
      } catch (error) {
        console.log(error);
      }
    };

    loadDashboard();
  }, []);

  const statCards = [
    {
      title: "Total Events",
      value: events.length,
      icon: CalendarDays,
      accent: "from-indigo-500 to-blue-600",
      text: "text-indigo-300",
    },
    {
      title: "Users",
      value: users.length,
      icon: Users,
      accent: "from-emerald-500 to-green-600",
      text: "text-emerald-300",
    },
    {
      title: "Bookings",
      value: bookings.length,
      icon: Ticket,
      accent: "from-violet-500 to-fuchsia-600",
      text: "text-violet-300",
    },
    {
      title: "Organizers",
      value: organizers.length,
      icon: ShieldCheck,
      accent: "from-amber-500 to-orange-500",
      text: "text-yellow-300",
    },
    {
      title: "Revenue",
      value: `₹ ${revenue}`,
      icon: IndianRupee,
      accent: "from-cyan-500 to-sky-600",
      text: "text-cyan-300",
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      icon: Clock3,
      accent: "from-pink-500 to-rose-600",
      text: "text-pink-300",
    },
  ];

  return (
    <div className="site-shell text-white p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="glass-panel relative overflow-hidden rounded-[28px] p-6 sm:p-8 mb-8">
        <div className="absolute -top-16 -left-10 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Dashboard Overview
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-300">
              Manage events, users, bookings, and organizer approvals from one
              modern admin workspace.
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
        {statCards.map((card, index) => {
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
                className={`absolute top-0 left-0 h-1.5 w-full bg-linear-to-r ${card.accent}`}
              />
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/5 blur-2xl" />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-300">{card.title}</p>
                  <h2 className={`mt-2 text-3xl font-bold ${card.text}`}>
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r ${card.accent} shadow-lg`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ORGANIZER REQUESTS */}
      <div className="glass-panel rounded-[28px] p-5 sm:p-6 mb-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Organizer Requests</h2>
            <p className="mt-1 text-sm text-slate-300">
              Review pending registration requests from new organizers.
            </p>
          </div>
        </div>

        {organizerRequests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-slate-300">
            No pending organizer requests.
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {organizerRequests.map((org, index) => {
              const isLoading = actionLoadingId === org._id;

              return (
                <motion.div
                  key={org._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-white/10 to-white/5 p-5 shadow-lg"
                >
                  <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-fuchsia-500/10 blur-2xl" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-r from-pink-500 to-violet-600 text-lg font-bold text-white shadow-lg">
                          {org?.name?.charAt(0)?.toUpperCase() || "O"}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold text-white">
                            {org.name}
                          </h3>
                          <p className="truncate text-sm text-slate-300">
                            {org.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300">
                          <Clock3 className="h-3.5 w-3.5" />
                          {org.organizerRequestStatus}
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                          <Mail className="h-3.5 w-3.5" />
                          Organizer Request
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleApprove(org._id)}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-green-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02] disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {isLoading ? "Processing..." : "Approve"}
                    </button>

                    <button
                      onClick={() => handleReject(org._id)}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-rose-500 to-red-600 px-4 py-3 font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:scale-[1.02] disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      {isLoading ? "Processing..." : "Reject"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* EVENTS SECTION */}
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">All Events</h2>
          <p className="text-sm text-slate-300">
            Browse and manage all platform events.
          </p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-300">
          No events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.03 }}
            >
              <EventCard event={event} refresh={fetchEvents} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
