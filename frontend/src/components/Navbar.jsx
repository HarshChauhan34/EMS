import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // ================= CLICK OUTSIDE =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= HIDE NAVBAR =================
  const hideNavbar =
    ["/login", "/register", "/forgot-password"].includes(location.pathname) ||
    location.pathname.startsWith("/reset-password/");

  if (hideNavbar) return null;

  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;
  const getInitials = (name) => name?.charAt(0).toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-black/50 border-b border-gray-200 dark:border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
              🎉
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
              EventPro
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8 text-gray-700 dark:text-gray-200">
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
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-linear-to-r from-indigo-500 to-pink-500 text-white shadow-md hover:scale-105 transition"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div ref={dropdownRef} className="relative">
                {/* PROFILE */}
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 rounded-full bg-linear-to-r from-yellow-400 to-orange-500 text-black font-semibold flex items-center justify-center shadow hover:scale-110 transition"
                >
                  {getInitials(user.name)}
                </button>

                {/* DROPDOWN */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden"
                    >
                      <div className="p-3 border-b border-gray-200 dark:border-white/10">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          {user.name}
                        </p>
                      </div>

                      <button
                        onClick={() => navigate("/profile")}
                        className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition"
                      >
                        <User size={16} />
                        Profile
                      </button>

                      <button
                        onClick={logoutHandler}
                        className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10 transition"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-white/10"
          >
            <div className="p-5 flex flex-col gap-4 text-gray-800 dark:text-white text-center">
              {user?.role === "user" && (
                <Link to="/my-bookings" onClick={() => setMenuOpen(false)}>
                  My Bookings
                </Link>
              )}

              {user?.role === "admin" && (
                <Link to="/admin/users" onClick={() => setMenuOpen(false)}>
                  Users
                </Link>
              )}

              {!user ? (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <button onClick={() => navigate("/profile")}>Profile</button>
                  <button onClick={logoutHandler} className="text-red-500">
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ================= NAV LINK =================
function NavLink({ to, children, isActive }) {
  return (
    <Link
      to={to}
      className={`relative font-medium transition ${
        isActive(to)
          ? "text-indigo-500"
          : "hover:text-indigo-500 text-gray-700 dark:text-gray-200"
      }`}
    >
      {children}

      <span
        className={`absolute left-0 -bottom-1 h-[2px] bg-linear-to-r from-indigo-500 to-pink-500 transition-all duration-300 ${
          isActive(to) ? "w-full" : "w-0 group-hover:w-full"
        }`}
      ></span>
    </Link>
  );
}

export default Navbar;
