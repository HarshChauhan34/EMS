import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Ticket } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hideNavbar =
    ["/login", "/register", "/forgot-password"].includes(location.pathname) ||
    location.pathname.startsWith("/reset-password/");

  if (hideNavbar) return null;

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

  const isActive = (path) => location.pathname === path;
  const getInitials = (name) => name?.charAt(0).toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#081120]/70 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">
          {/* LOGO */}
          <Link to={getHomeRoute()} className="group flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-fuchsia-500/30 blur-lg transition duration-300 group-hover:bg-fuchsia-500/40" />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 text-white shadow-lg">
                <Ticket size={20} />
              </div>
            </div>

            <div className="flex flex-col leading-none">
              <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-pink-300 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
                EventPro
              </span>
              <span className="hidden text-[10px] uppercase tracking-[0.25em] text-slate-400 sm:block">
                Event Platform
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-3 lg:gap-5 text-slate-200">
            {user?.role === "user" && (
              <NavLink to="/my-bookings" isActive={isActive}>
                My Bookings
              </NavLink>
            )}

            {user?.role === "admin" && (
              <NavLink to="/admin/users" isActive={isActive}>
                Users
              </NavLink>
            )}

            {!user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.03]"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="group flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 text-sm font-bold text-black shadow-lg transition hover:scale-105"
                >
                  {getInitials(user.name)}
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1224]/95 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl"
                    >
                      <div className="border-b border-white/10 bg-white/5 p-4">
                        <p className="truncate text-sm font-semibold text-white">
                          {user.name}
                        </p>
                        <p className="mt-1 truncate text-xs capitalize text-slate-400">
                          {user.role}
                        </p>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            navigate("/profile");
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-200 transition hover:bg-white/10"
                        >
                          <User size={16} />
                          Profile
                        </button>

                        <button
                          onClick={logoutHandler}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10"
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

          {/* MOBILE BUTTON */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.22 }}
            className="md:hidden border-t border-white/10 bg-[#0b1224]/95 backdrop-blur-2xl"
          >
            <div className="mx-auto max-w-7xl px-4 py-5">
              <div className="flex flex-col gap-3">
                {!user && (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-white transition hover:bg-white/10"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 px-4 py-3 text-center font-semibold text-white shadow-lg"
                    >
                      Sign Up
                    </Link>
                  </>
                )}

                {user?.role === "user" && (
                  <>
                    <Link
                      to="/my-bookings"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-white transition hover:bg-white/10"
                    >
                      My Bookings
                    </Link>

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition hover:bg-white/10"
                    >
                      Profile
                    </button>

                    <button
                      onClick={logoutHandler}
                      className="rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-4 py-3 font-medium text-white shadow-lg"
                    >
                      Logout
                    </button>
                  </>
                )}

                {user?.role === "admin" && (
                  <>
                    <Link
                      to="/admin/users"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-white transition hover:bg-white/10"
                    >
                      Users
                    </Link>

                    <Link
                      to="/admin/organizers"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-white transition hover:bg-white/10"
                    >
                      Organizers
                    </Link>

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition hover:bg-white/10"
                    >
                      Profile
                    </button>

                    <button
                      onClick={logoutHandler}
                      className="rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-4 py-3 font-medium text-white shadow-lg"
                    >
                      Logout
                    </button>
                  </>
                )}

                {user?.role === "organizer" && (
                  <>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition hover:bg-white/10"
                    >
                      Profile
                    </button>

                    <button
                      onClick={logoutHandler}
                      className="rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-4 py-3 font-medium text-white shadow-lg"
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
    </nav>
  );
}

function NavLink({ to, children, isActive }) {
  return (
    <Link
      to={to}
      className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
        isActive(to)
          ? "bg-indigo-500/15 text-indigo-300 border border-indigo-400/20"
          : "text-slate-200 hover:bg-white/5 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

export default Navbar;
