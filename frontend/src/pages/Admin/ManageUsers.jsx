import { useEffect, useMemo, useState } from "react";
import {
  getAllUsers,
  getUserBookings,
  deleteUser,
} from "../../services/adminService";
import { getAllBookings } from "../../services/bookingService";
import { getEvents } from "../../services/eventService";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Ticket,
  IndianRupee,
  Search,
  Trash2,
  ChevronDown,
  ChevronUp,
  Mail,
  CalendarDays,
  MapPin,
  CreditCard,
  UserCircle2,
} from "lucide-react";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [userBookings, setUserBookings] = useState({});
  const [openUsers, setOpenUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleViewBookings = async (id) => {
    if (openUsers.includes(id)) {
      setOpenUsers((prev) => prev.filter((u) => u !== id));
      return;
    }

    if (!userBookings[id]) {
      try {
        setLoadingUserId(id);

        const res = await getUserBookings(id);
        const confirmed = (res.data || []).filter(
          (b) => b.bookingStatus === "confirmed",
        );

        setUserBookings((prev) => ({
          ...prev,
          [id]: confirmed,
        }));
      } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || "Failed to load bookings");
        return;
      } finally {
        setLoadingUserId(null);
      }
    }

    setOpenUsers((prev) => [...prev, id]);
  };

  const handleDeleteUser = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${name}?`,
    );
    if (!confirmDelete) return;

    try {
      setDeleteLoadingId(id);

      await deleteUser(id);

      setUsers((prev) => prev.filter((user) => user._id !== id));
      setOpenUsers((prev) => prev.filter((userId) => userId !== id));

      setUserBookings((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      alert("User deleted successfully");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const getInitial = (name) => name?.charAt(0).toUpperCase() || "U";

  const revenue = useMemo(() => {
    return bookings.reduce((total, b) => total + (b.totalAmount || 0), 0);
  }, [bookings]);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return users;

    return users.filter((u) => {
      const name = u?.name?.toLowerCase() || "";
      const email = u?.email?.toLowerCase() || "";
      return name.includes(query) || email.includes(query);
    });
  }, [users, searchTerm]);

  useEffect(() => {
    const loadUsersData = async () => {
      try {
        const [usersRes, bookingsRes, eventsRes] = await Promise.all([
          getAllUsers(),
          getAllBookings(),
          getEvents(),
        ]);

        const usersOnly = (usersRes.data || []).filter(
          (u) => u.role === "user",
        );

        setUsers(usersOnly);
        setBookings(bookingsRes.data || []);
        setEvents(eventsRes.data || []);
      } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || "Failed to load users");
      }
    };

    loadUsersData();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      gradient: "from-indigo-500 to-blue-600",
      text: "text-indigo-300",
    },
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: Ticket,
      gradient: "from-violet-500 to-fuchsia-600",
      text: "text-violet-300",
    },
    {
      title: "Revenue",
      value: `₹ ${revenue}`,
      icon: IndianRupee,
      gradient: "from-emerald-500 to-green-600",
      text: "text-emerald-300",
    },
    {
      title: "Total Events",
      value: events.length, // or events.length if you add events state
      icon: CalendarDays,
      gradient: "from-indigo-500 to-blue-600",
      text: "text-indigo-300",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#161b33] to-[#1d1a52] text-white p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="relative mb-8 overflow-hidden rounded-[28px] border border-white/10 bg-white/10 p-6 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
        <div className="absolute -top-16 -left-10 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Manage Platform Users
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-300">
              Monitor registered users, review their bookings, and manage
              accounts from one clean admin workspace.
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
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
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-300">{card.title}</p>
                  <h2 className={`mt-2 text-3xl font-bold ${card.text}`}>
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r ${card.gradient} shadow-lg`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* SEARCH + LIST */}
      <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Users</h2>
            <p className="mt-1 text-sm text-slate-300">
              Search users, view confirmed bookings, and delete accounts.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 w-full lg:w-[360px]">
            <Search className="h-4.5 w-4.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-300">
            No users found.
          </div>
        ) : (
          <div className="space-y-5">
            {filteredUsers.map((u, index) => {
              const bookings = userBookings[u._id] || [];
              const isOpen = openUsers.includes(u._id);
              const isLoading = loadingUserId === u._id;
              const isDeleting = deleteLoadingId === u._id;

              return (
                <motion.div
                  key={u._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-4 sm:p-5"
                >
                  {/* USER CARD */}
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-600 text-lg font-bold text-white shadow-lg">
                        {getInitial(u.name)}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold text-white">
                          {u.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-300">
                          <Mail className="h-4 w-4 shrink-0 text-cyan-300" />
                          <span className="break-all">{u.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 xl:items-center">
                      <button
                        onClick={() => handleViewBookings(u._id)}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.02] disabled:opacity-50"
                        disabled={isLoading || isDeleting}
                      >
                        {isLoading ? (
                          "Loading..."
                        ) : isOpen ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            Hide Bookings
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            Bookings
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 px-4 py-3 font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:scale-[1.02] disabled:opacity-50"
                        disabled={isDeleting || isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>

                  {/* BOOKINGS */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 14, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: 10, height: 0 }}
                        transition={{ duration: 0.28 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 border-t border-white/10 pt-5">
                          {bookings.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-slate-300">
                              No confirmed bookings
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                              {bookings.map((b) => {
                                const eventDeleted = !b.event;

                                return (
                                  <motion.div
                                    key={b._id}
                                    whileHover={{ y: -4, scale: 1.01 }}
                                    className="rounded-[22px] border border-white/10 bg-white/10 p-4 shadow-lg backdrop-blur-xl"
                                  >
                                    <div className="mb-3 flex items-start justify-between gap-3">
                                      <h4 className="text-base font-bold text-indigo-300 line-clamp-2">
                                        {eventDeleted
                                          ? "Event no longer available"
                                          : b.event.title}
                                      </h4>

                                      <span
                                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                          eventDeleted
                                            ? "bg-yellow-400/10 text-yellow-300 border border-yellow-400/20"
                                            : "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20"
                                        }`}
                                      >
                                        {eventDeleted ? "Deleted" : "Confirmed"}
                                      </span>
                                    </div>

                                    <div className="space-y-2.5 text-sm text-slate-300">
                                      <div className="flex items-center gap-2">
                                        <Ticket className="h-4 w-4 text-violet-300" />
                                        <span>{b.seatsBooked} seats</span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <IndianRupee className="h-4 w-4 text-emerald-300" />
                                        <span>₹ {b.totalAmount}</span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-cyan-300" />
                                        <span>{b.paymentStatus}</span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-pink-300" />
                                        <span className="line-clamp-1">
                                          {eventDeleted
                                            ? "N/A"
                                            : b.event.location}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4 text-amber-300" />
                                        <span>
                                          {eventDeleted
                                            ? "N/A"
                                            : new Date(
                                                b.event.date,
                                              ).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="mt-4 border-t border-white/10 pt-3 text-xs text-slate-400">
                                      Booked on{" "}
                                      {new Date(
                                        b.createdAt,
                                      ).toLocaleDateString()}
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;
