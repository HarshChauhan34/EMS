import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarCheck2,
  ChevronDown,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { getStoredUser } from "../utils/authStorage";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const user = getStoredUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : previousOverflow || "";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const getHomeRoute = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin";
    if (user.role === "organizer") return "/organizer";
    return "/";
  };

  const getInitials = (name) => name?.charAt(0)?.toUpperCase() || "U";

  const navItems =
    user?.role === "user"
      ? [{ label: "My Bookings", to: "/my-bookings", icon: CalendarCheck2 }]
      : [];

  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  const navBgClass = isScrolled
    ? "bg-slate-950/78 border-white/12 shadow-[0_10px_35px_rgba(2,6,23,0.44)]"
    : "bg-slate-950/35 border-white/6 shadow-[0_8px_20px_rgba(2,6,23,0.2)]";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-2xl transition-all duration-300 ${navBgClass}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-linear(circle_at_8%_0%,rgba(99,102,241,0.24),transparent_32%),radial-linear(circle_at_92%_0%,rgba(236,72,153,0.22),transparent_34%),linear-linear(to_right,rgba(2,6,23,0.92),rgba(10,15,36,0.88),rgba(30,27,75,0.86))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-fuchsia-400/65 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-cyan-300/50 to-transparent" />

      <div className="relative flex min-h-16 w-full items-center justify-between gap-2 px-3 sm:min-h-19 sm:gap-4 sm:px-6 lg:px-8">
        <Link
          to={getHomeRoute()}
          className="group flex min-w-0 shrink items-center py-1"
        >
          <img
            src="/logo.svg"
            alt="Event Management System Logo"
            className="block h-10 w-auto max-w-[165px] object-contain sm:h-14 sm:max-w-[240px] md:h-16 md:max-w-[280px] transition duration-300 group-hover:-translate-y-0.5"
          />
        </Link>

        <div className="hidden items-center gap-2 lg:flex lg:gap-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              active={isActive(item.to)}
              icon={item.icon}
            >
              {item.label}
            </NavLink>
          ))}

          {!user ? (
            <div className="ml-2 flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full border border-white/20 bg-white/8 px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/14"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-linear-to-r from-indigo-500 via-violet-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(99,102,241,0.38)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(139,92,246,0.45)]"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div ref={dropdownRef} className="relative ml-2">
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="group flex items-center gap-2 rounded-full border border-white/16 bg-white/10 p-1.5 pr-3 text-white shadow-[0_8px_20px_rgba(2,6,23,0.3)] transition hover:bg-white/14"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-r from-amber-400 via-orange-400 to-pink-500 text-sm font-bold text-white shadow">
                  {getInitials(user.name)}
                </div>
                <span className="hidden max-w-[120px] truncate text-sm font-semibold lg:block">
                  {user.name}
                </span>
                <ChevronDown
                  size={15}
                  className={`text-slate-200 transition ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-3 w-72 overflow-hidden rounded-3xl border border-white/15 bg-slate-950/96 shadow-[0_22px_60px_rgba(2,6,23,0.55)]"
                  >
                    <div className="bg-linear-to-r from-indigo-500/20 via-violet-500/20 to-pink-500/20 p-4">
                      <p className="truncate text-sm font-bold text-white">
                        {user.name}
                      </p>
                      <p className="mt-1 truncate text-xs capitalize text-slate-300">
                        {user.role}
                      </p>
                    </div>
                    <div className="p-3">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/profile");
                        }}
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                      >
                        <User size={16} />
                        Profile
                      </button>
                      <button
                        onClick={logoutHandler}
                        className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/15"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/16 bg-white/10 text-white shadow lg:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.2 }}
            className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-slate-950/94 backdrop-blur-2xl lg:hidden sm:max-h-[calc(100dvh-4.75rem)]"
          >
            <div className="w-full px-3 py-3 sm:px-4 sm:py-4">
              <div className="space-y-3 rounded-3xl border border-white/10 bg-white/6 p-4 shadow-[0_12px_40px_rgba(2,6,23,0.35)]">
                {user && (
                  <div className="mb-1 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 p-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-r from-amber-400 via-orange-400 to-pink-500 font-bold text-white">
                      {getInitials(user.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">
                        {user.name}
                      </p>
                      <p className="truncate text-xs capitalize text-slate-300">
                        {user.role}
                      </p>
                    </div>
                  </div>
                )}

                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive(item.to)
                        ? "bg-linear-to-r from-indigo-500/35 via-violet-500/30 to-pink-500/35 text-white"
                        : "border border-white/10 bg-white/8 text-slate-100 hover:bg-white/12"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}

                {!user ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full rounded-2xl border border-white/14 bg-white/8 px-4 py-3 text-center text-sm font-semibold text-white"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full rounded-2xl bg-linear-to-r from-indigo-500 via-violet-500 to-pink-500 px-4 py-3 text-center text-sm font-bold text-white"
                    >
                      Get Started
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full rounded-2xl border border-white/14 bg-white/8 px-4 py-3 text-sm font-semibold text-white"
                    >
                      Profile
                    </button>
                    <button
                      onClick={logoutHandler}
                      className="w-full rounded-2xl bg-linear-to-r from-rose-500 to-red-600 px-4 py-3 text-sm font-bold text-white"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ to, children, active, icon: Icon }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition duration-200 ${
        active
          ? "bg-linear-to-r from-indigo-500/35 via-violet-500/30 to-pink-500/35 text-white ring-1 ring-white/25"
          : "text-slate-100 hover:bg-white/10 hover:text-white"
      }`}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </Link>
  );
}

export default Navbar;
