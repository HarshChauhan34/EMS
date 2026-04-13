import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../../services/eventService";
import { motion } from "framer-motion";
import EventCard from "../../components/EventCard";
import {
  CalendarDays,
  ShieldCheck,
  BadgeCheck,
  Plus,
  Sparkles,
} from "lucide-react";

function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getEvents();
      const allEvents = Array.isArray(res.data) ? res.data : [];

      const myEvents = allEvents.filter((event) => {
        const createdById =
          typeof event.createdBy === "object"
            ? event.createdBy?._id
            : event.createdBy;

        return createdById === user?._id;
      });

      setEvents(myEvents);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const totalRevenuePotential = useMemo(() => {
    return events.reduce(
      (total, event) => total + (event.price || 0) * (event.totalSeats || 0),
      0,
    );
  }, [events]);

  const statCards = [
    {
      title: "My Events",
      value: events.length,
      icon: CalendarDays,
      gradient: "from-indigo-500 to-blue-600",
      text: "text-indigo-300",
    },
    {
      title: "Role",
      value: "Organizer",
      icon: ShieldCheck,
      gradient: "from-pink-500 to-purple-600",
      text: "text-pink-300",
    },
    {
      title: "Status",
      value: "Approved",
      icon: BadgeCheck,
      gradient: "from-emerald-500 to-green-600",
      text: "text-emerald-300",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#081120] via-[#151a35] to-[#24195c] text-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="relative mb-8 overflow-hidden rounded-[30px] border border-white/10 bg-white/10 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-8">
          <div className="absolute -top-16 -left-10 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Organizer Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-300">
                Manage your created events, track your activity, and keep your
                event listings updated from one clean workspace.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/organizer/create-event")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-500/20 transition"
            >
              <Plus className="h-4 w-4" />
              Create Event
            </motion.button>
          </div>
        </div>

        {/* STATS */}
        <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/10 p-5 shadow-lg backdrop-blur-2xl"
              >
                <div
                  className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r ${card.gradient}`}
                />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-slate-300">{card.title}</p>
                    <h2
                      className={`mt-2 text-3xl font-bold ${card.text} break-words`}
                    >
                      {card.value}
                    </h2>
                  </div>

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r ${card.gradient} shadow-lg`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* SECTION HEADER */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              My Events
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Browse, edit, and manage all events created by you.
            </p>
          </div>

        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-white/10 px-6 py-16 text-center shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
            <div className="mx-auto mb-4 h-14 w-14 animate-pulse rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-600" />
            <p className="text-lg font-semibold text-white">
              Loading events...
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Please wait while we fetch your created events.
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-white/10 px-6 py-16 text-center shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 shadow-lg">
              <CalendarDays className="h-7 w-7 text-white" />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-white">
              No events found
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Create your first event to start managing your listings.
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/organizer/create-event")}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-500/20"
            >
              <Plus className="h-4 w-4" />
              Create Event
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <EventCard event={event} refresh={fetchEvents} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrganizerDashboard;
