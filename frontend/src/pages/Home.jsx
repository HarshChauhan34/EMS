import { useCallback, useEffect, useMemo, useState } from "react";
import { getEvents } from "../services/eventService";
import EventCard from "../components/EventCard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getStoredUser } from "../utils/authStorage";
import {
  Search,
  CalendarDays,
  MapPin,
  Sparkles,
  Ticket,
  ArrowRight,
} from "lucide-react";

function Home() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    try {
      const res = await getEvents();
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      setEvents([]);
    }
  }, []);

  useEffect(() => {
    const user = getStoredUser();

    if (user?.role === "admin") {
      navigate("/admin");
      return;
    }

    fetchEvents();
  }, [fetchEvents, navigate]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return events;

    return events.filter((e) => {
      const title = e?.title?.toLowerCase() || "";
      const category = e?.category?.toLowerCase() || "";
      const location = e?.location?.toLowerCase() || "";

      return (
        title.includes(query) ||
        category.includes(query) ||
        location.includes(query)
      );
    });
  }, [events, search]);

  const uniqueCategories = useMemo(() => {
    return new Set(events.map((e) => e.category).filter(Boolean)).size;
  }, [events]);

  const uniqueLocations = useMemo(() => {
    return new Set(events.map((e) => e.location).filter(Boolean)).size;
  }, [events]);

  const stats = [
    {
      title: "Live Events",
      value: events.length,
      icon: CalendarDays,
      linear: "from-indigo-500 to-blue-600",
      text: "text-indigo-300",
    },
    {
      title: "Categories",
      value: uniqueCategories,
      icon: Sparkles,
      linear: "from-pink-500 to-rose-600",
      text: "text-pink-300",
    },
    {
      title: "Locations",
      value: uniqueLocations,
      icon: MapPin,
      linear: "from-emerald-500 to-green-600",
      text: "text-emerald-300",
    },
    {
      title: "Easy Booking",
      value: "24/7",
      icon: Ticket,
      linear: "from-violet-500 to-fuchsia-600",
      text: "text-violet-300",
    },
  ];

  return (
    <div className="site-shell text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HERO */}
        <div className="glass-panel relative overflow-hidden rounded-4xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="absolute -right-16 top-10 h-52 w-52 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                <Sparkles className="h-4 w-4" />
                Event Discovery Platform
              </div>

              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Discover
                <span className="bg-linear-to-r from-pink-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  {" "}
                  Amazing Events{" "}
                </span>
                Near You
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Book tickets for concerts, workshops, festivals, hackathons,
                seminars, and more — all from one beautiful, fast, and modern
                platform.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() =>
                    document
                      .getElementById("events-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-fuchsia-500 via-violet-500 to-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.02]"
                >
                  Explore Events
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm text-slate-300">
                  Fast booking • Secure access • Modern UI
                </div>
              </div>
            </div>

            {/* SEARCH PANEL */}
            <div className="relative">
              <div className="glass-panel rounded-[28px] p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r from-pink-500 to-violet-600 shadow-lg">
                    <Search className="h-5 w-5 text-white" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Find Your Event
                    </h3>
                    <p className="text-sm text-slate-300">
                      Search by title, category, or location
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#0f172a]/60 py-4 pl-12 pr-4 text-white outline-none placeholder:text-slate-400 focus:border-violet-400/40"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="glass-panel relative overflow-hidden rounded-3xl p-5"
              >
                <div
                  className={`absolute top-0 left-0 h-1.5 w-full bg-linear-to-r ${stat.linear}`}
                />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-300">{stat.title}</p>
                    <h2 className={`mt-2 text-3xl font-bold ${stat.text}`}>
                      {stat.value}
                    </h2>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r ${stat.linear} shadow-lg`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* EVENTS SECTION */}
        <div
          id="events-section"
          className="glass-panel mt-10 rounded-[30px] p-5 sm:p-6 lg:p-7"
        >
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Available Events
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Browse top events and book your seat in just a few clicks.
              </p>
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-r from-pink-500 to-violet-600 shadow-lg">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">
                No events found
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Try searching with a different title, category, or location.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredEvents.map((event, index) => (
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
      </div>
    </div>
  );
}

export default Home;
