import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../services/userService";
import { motion } from "framer-motion";
import { getStoredUser } from "../utils/authStorage";
import {
  UserCircle2,
  Mail,
  ShieldCheck,
  Pencil,
  Save,
  X,
  Home,
  LogOut,
  LayoutDashboard,
  CalendarDays,
  BadgeCheck,
  Clock3,
} from "lucide-react";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() =>
    getStoredUser(),
  );
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const res = await updateProfile({ name, email });

      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setName(res.data.name);
      setEmail(res.data.email);
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const roleBadgeStyle = useMemo(() => {
    if (user?.role === "admin") {
      return "from-violet-500 to-indigo-600";
    }
    if (user?.role === "organizer") {
      return "from-pink-500 to-purple-600";
    }
    return "from-emerald-500 to-green-600";
  }, [user?.role]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-[#081120] via-[#151a35] to-[#24195c] text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* TOP PROFILE HERO */}
        <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/10 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="absolute -right-16 top-8 h-52 w-52 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[auto,1fr] lg:items-center">
            {/* AVATAR */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mx-auto lg:mx-0"
            >
              <div className="relative">
                <div
                  className={`flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-r ${roleBadgeStyle} text-4xl font-bold text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-4 ring-white/15 sm:h-32 sm:w-32 sm:text-5xl`}
                >
                  {name ? name[0].toUpperCase() : "U"}
                </div>
                <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-2xl" />
              </div>
            </motion.div>

            {/* USER INFO */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="text-center lg:text-left"
            >
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                <UserCircle2 className="h-4 w-4" />
                Personal Profile
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {user.name}
              </h1>

              <p className="mt-2 text-sm text-slate-300 sm:text-base">
                {user.email}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <span
                  className={`inline-flex items-center gap-2 rounded-full bg-linear-to-r ${roleBadgeStyle} px-4 py-2 text-sm font-semibold text-white shadow-lg`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  {user.role?.toUpperCase()}
                </span>

                {user.role === "organizer" && (
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                      user.isApprovedOrganizer
                        ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        : "border border-yellow-400/20 bg-yellow-400/10 text-yellow-300"
                    }`}
                  >
                    {user.isApprovedOrganizer ? (
                      <BadgeCheck className="h-4 w-4" />
                    ) : (
                      <Clock3 className="h-4 w-4" />
                    )}
                    {user.isApprovedOrganizer ? "Approved" : "Pending Approval"}
                  </span>
                )}
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Manage your personal information, access role-based tools, and
                keep your account updated from one professional dashboard.
              </p>
            </motion.div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
          {/* PROFILE FORM */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-[28px] border border-white/10 bg-white/10 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-2xl sm:p-7"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r from-pink-500 to-violet-600 shadow-lg">
                <Pencil className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white">
                  Profile Information
                </h3>
                <p className="text-sm text-slate-300">
                  Update your personal details and keep your account current.
                </p>
              </div>
            </div>

            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full Name
                </label>

                {editMode ? (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#0f172a]/60 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-indigo-400/40"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                    {user.name}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email Address
                </label>

                {editMode ? (
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#0f172a]/60 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-violet-400/40"
                    placeholder="Enter your email address"
                  />
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white break-all">
                    {user.email}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Account Role
                </label>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white capitalize">
                  {user.role}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ACTION PANEL */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="rounded-[28px] border border-white/10 bg-white/10 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-2xl sm:p-7"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r from-cyan-500 to-indigo-600 shadow-lg">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white">
                  Quick Actions
                </h3>
                <p className="text-sm text-slate-300">
                  Access your role-based tools and account actions.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:scale-[1.02]"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-green-600 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02] disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    onClick={() => {
                      setEditMode(false);
                      setName(user.name);
                      setEmail(user.email);
                    }}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 border border-white/15 py-3 font-semibold text-white transition hover:bg-white/15"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </>
              )}

              {user.role === "user" && (
                <button
                  onClick={() => navigate("/my-bookings")}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-600 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02]"
                >
                  <CalendarDays className="h-4 w-4" />
                  My Bookings
                </button>
              )}

              {user.role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-500 to-indigo-600 py-3 font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.02]"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Dashboard
                </button>
              )}

              {user.role === "organizer" && (
                <button
                  onClick={() => navigate("/organizer")}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:scale-[1.02]"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Organizer Dashboard
                </button>
              )}

              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 py-3 font-semibold text-white transition hover:bg-white/15"
              >
                <Home className="h-4 w-4" />
                Home
              </button>

              <button
                onClick={logoutHandler}
                className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-rose-500 to-red-600 py-3 font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:scale-[1.02]"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
