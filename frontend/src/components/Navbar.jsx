import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, [location]);

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  if (hideNavbar) return null;

  const logoutHandler = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-yellow-300 border-b-2 border-yellow-300"
      : "text-white";

  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 shadow-2xl bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-extrabold flex items-center gap-2 group"
        >
          🎟️
          <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent group-hover:brightness-125 transition">
            EventPro
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 text-lg">
          {user?.role === "user" && (
            <Link
              to="/my-bookings"
              className={`${isActive("/my-bookings")} hover:text-yellow-300 transition duration-300`}
            >
              My Bookings
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin/users"
              className={`${isActive("/admin/users")} hover:text-yellow-300 transition duration-300`}
            >
              Users
            </Link>
          )}

          {!user && (
            <>
              <Link
                to="/login"
                className="px-5 py-2 rounded-full bg-white text-black font-semibold hover:scale-105 hover:bg-gray-200 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500 text-black font-bold shadow-lg hover:scale-105 hover:shadow-pink-500/50 transition"
              >
                Register
              </Link>
            </>
          )}

          {/* PROFILE */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-11 h-11 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 text-black font-bold flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-pink-400/60 transition"
              >
                {getInitials(user.name)}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl overflow-hidden shadow-2xl bg-white text-black animate-fadeIn">
                  <div className="px-4 py-2 border-b font-semibold">
                    👋 {user.name}
                  </div>

                  <button
                    onClick={() => {
                      navigate("/profile");
                      setProfileOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    👤 Profile
                  </button>

                  {user.role === "admin" && (
                    <button
                      onClick={() => {
                        navigate("/admin/users");
                        setProfileOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      ⚙️ Admin Panel
                    </button>
                  )}

                  <button
                    onClick={() => {
                      logoutHandler();
                      setProfileOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-100"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden transition-all duration-500 ${
          menuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="bg-gradient-to-b from-indigo-800 via-purple-800 to-pink-700 px-5 py-4 flex flex-col gap-4 text-lg text-center">
          {user?.role === "user" && (
            <Link
              to="/my-bookings"
              onClick={() => setMenuOpen(false)}
            >
              My Bookings
            </Link>
          )}

          {user?.role === "admin" && (
            <Link to="/admin/users" onClick={() => setMenuOpen(false)}>
              Users
            </Link>
          )}

          {!user && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>

              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <button
                onClick={() => {
                  navigate("/profile");
                  setMenuOpen(false);
                }}
              >
                Profile
              </button>

              <button
                onClick={() => {
                  logoutHandler();
                  setMenuOpen(false);
                }}
                className="text-red-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
