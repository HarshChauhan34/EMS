import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAllOrganizers,
  approveOrganizer,
  rejectOrganizer,
} from "../../services/adminService";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Clock3,
  Search,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  CalendarDays,
  UserCircle2,
  BadgeCheck,
} from "lucide-react";

function ManageOrganizers() {
  const [organizers, setOrganizers] = useState([]);
  const [openIds, setOpenIds] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrganizers = useCallback(async () => {
    try {
      const res = await getAllOrganizers();
      const safeData = Array.isArray(res.data) ? res.data : [];
      setOrganizers(safeData);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to load organizers");
      setOrganizers([]);
    }
  }, []);

  useEffect(() => {
    fetchOrganizers();
  }, [fetchOrganizers]);

  const toggleOpen = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleApprove = async (id) => {
    try {
      setLoadingId(id);
      await approveOrganizer(id);

      setOrganizers((prev) =>
        prev.map((org) =>
          org._id === id
            ? {
                ...org,
                organizerRequestStatus: "approved",
                isApprovedOrganizer: true,
              }
            : org,
        ),
      );

      alert("Organizer approved successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Approve failed");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this organizer?",
    );
    if (!confirmReject) return;

    try {
      setLoadingId(id);
      await rejectOrganizer(id);

      setOrganizers((prev) =>
        prev.map((org) =>
          org._id === id
            ? {
                ...org,
                organizerRequestStatus: "rejected",
                isApprovedOrganizer: false,
              }
            : org,
        ),
      );

      alert("Organizer rejected successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Reject failed");
    } finally {
      setLoadingId(null);
    }
  };

  const getInitial = (name) => name?.charAt(0).toUpperCase() || "O";

  const approved = organizers.filter(
    (org) => org.organizerRequestStatus === "approved",
  ).length;

  const pending = organizers.filter(
    (org) => org.organizerRequestStatus === "pending",
  ).length;

  const filteredOrganizers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return organizers.filter((org) => {
      const name = org?.name?.toLowerCase() || "";
      const email = org?.email?.toLowerCase() || "";
      const status = org?.organizerRequestStatus || "pending";

      const matchesSearch =
        !query || name.includes(query) || email.includes(query);
      const matchesStatus =
        statusFilter === "all" ? true : status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [organizers, searchTerm, statusFilter]);

  const statCards = [
    {
      title: "Total Organizers",
      value: organizers.length,
      icon: UserCircle2,
      linear: "from-indigo-500 to-blue-600",
      text: "text-indigo-300",
    },
    {
      title: "Approved",
      value: approved,
      icon: BadgeCheck,
      linear: "from-emerald-500 to-green-600",
      text: "text-emerald-300",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock3,
      linear: "from-amber-500 to-orange-500",
      text: "text-yellow-300",
    },
  ];

  const getStatusBadge = (status) => {
    if (status === "approved") {
      return "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    }
    if (status === "rejected") {
      return "border border-rose-400/20 bg-rose-400/10 text-rose-300";
    }

    return "border border-yellow-400/20 bg-yellow-400/10 text-yellow-300";
  };

  return (
    <div className="site-shell p-3 text-white sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="glass-panel relative mb-8 overflow-hidden rounded-[28px] p-4 sm:p-8">
        <div className="absolute -top-16 -left-10 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Manage Organizers
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-300">
              Review organizer accounts, approve verified profiles, and remove
              unwanted requests from one clean admin workspace.
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                className={`absolute top-0 left-0 h-1.5 w-full bg-linear-to-r ${card.linear}`}
              />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-300">{card.title}</p>
                  <h2 className={`mt-2 text-2xl font-bold sm:text-3xl ${card.text}`}>
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r ${card.linear} shadow-lg`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* SEARCH + FILTER + LIST */}
      <div className="glass-panel rounded-[28px] p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Organizers</h2>
            <p className="mt-1 text-sm text-slate-300">
              Search, filter, approve, and manage organizer accounts.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 w-full sm:w-[320px]">
              <Search className="h-4.5 w-4.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full min-w-[9rem] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none sm:w-auto"
            >
              <option value="all" className="bg-slate-900">
                All Status
              </option>
              <option value="approved" className="bg-slate-900">
                Approved
              </option>
              <option value="pending" className="bg-slate-900">
                Pending
              </option>
              <option value="rejected" className="bg-slate-900">
                Rejected
              </option>
            </select>
          </div>
        </div>

        {filteredOrganizers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-300">
            No organizers found.
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrganizers.map((org, index) => {
              const isOpen = openIds.includes(org._id);
              const isLoading = loadingId === org._id;
              const status = org.organizerRequestStatus;

              return (
                <motion.div
                  key={org._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5"
                >
                  {/* ORGANIZER CARD */}
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-r from-pink-500 via-violet-500 to-indigo-600 text-lg font-bold text-white shadow-lg">
                        {getInitial(org.name)}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold text-white">
                          {org.name}
                        </h3>

                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-300">
                          <Mail className="h-4 w-4 shrink-0 text-cyan-300" />
                          <span className="break-all">{org.email}</span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                              status,
                            )}`}
                          >
                            {status === "approved" ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : status === "rejected" ? (
                              <XCircle className="h-3.5 w-3.5" />
                            ) : (
                              <Clock3 className="h-3.5 w-3.5" />
                            )}
                            {status}
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {org.role || "organizer"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto xl:items-center">
                      <button
                        onClick={() => toggleOpen(org._id)}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-500 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.02] sm:w-auto"
                      >
                        {isOpen ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            View Details
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* DETAILS */}
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
                          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                              <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                                <CalendarDays className="h-4 w-4 text-amber-300" />
                                Joined Date
                              </div>
                              <p className="font-semibold text-white">
                                {org.createdAt
                                  ? new Date(org.createdAt).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                              <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                                Role
                              </div>
                              <p className="font-semibold text-white capitalize">
                                {org.role || "N/A"}
                              </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                              <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                                <BadgeCheck className="h-4 w-4 text-emerald-300" />
                                Approval
                              </div>
                              <p className="font-semibold text-white">
                                {org.isApprovedOrganizer
                                  ? "Approved"
                                  : "Not Approved"}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              onClick={() => handleApprove(org._id)}
                              disabled={isLoading || status === "approved"}
                              className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-green-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              {isLoading && status !== "approved"
                                ? "Processing..."
                                : status === "approved"
                                  ? "Approved"
                                  : "Approve"}
                            </button>

                            <button
                              onClick={() => handleReject(org._id)}
                              disabled={isLoading}
                              className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-rose-500 to-red-600 px-4 py-3 font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <XCircle className="h-4 w-4" />
                              {isLoading ? "Processing..." : "Reject"}
                            </button>
                          </div>
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

export default ManageOrganizers;
