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

  return (
    <nav
      className="
      sticky top-0 z-50
      backdrop-blur-lg
      bg-gradient-to-r
      from-indigo-600/80
      via-purple-600/80
      to-pink-500/80
      border-b
      border-white/20
      shadow-2xl
      text-white
      "
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* LOGO */}
        <Link
          to="/"
          className="
          text-xl sm:text-2xl
          font-bold
          tracking-wide
          flex items-center gap-2
          hover:scale-105
          transition
          "
        >
          🎟 <span>Event System</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          {/* USER */}
          {user && user.role === "user" && (
            <Link
              to="/my-bookings"
              className="
              hover:text-yellow-300
              transition
              font-medium
              "
            >
              My Bookings
            </Link>
          )}

          {/* ADMIN */}
          {user && user.role === "admin" && (
            <Link
              to="/admin/users"
              className="hover:text-yellow-300 transition font-medium"
            >
              Users
            </Link>
          )}

          {/* NOT LOGIN */}
          {!user && (
            <>
              <Link
                to="/login"
                className="
                px-4 py-1
                rounded-full
                bg-white
                text-black
                hover:bg-gray-200
                transition
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
                px-4 py-1
                rounded-full
                bg-yellow-400
                text-black
                hover:bg-yellow-300
                transition
                "
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
                className="
                w-10 h-10
                rounded-full
                bg-white
                text-black
                flex
                items-center
                justify-center
                font-bold
                shadow
                hover:scale-110
                transition
                "
              >
                👤
              </button>

              {profileOpen && (
                <div
                  className="
                  absolute
                  right-0
                  mt-3
                  w-48
                  rounded-xl
                  overflow-hidden
                  shadow-2xl
                  bg-white
                  text-black
                  "
                >
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setProfileOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Profile
                  </button>

                  {user.role === "admin" && (
                    <button
                      onClick={() => {
                        navigate("/admin/users");
                        setProfileOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Users
                    </button>
                  )}

                  <button
                    onClick={() => {
                      logoutHandler();
                      setProfileOpen(false);
                    }}
                    className="
                    w-full
                    px-4 py-2
                    text-left
                    text-red-600
                    hover:bg-red-100
                    "
                  >
                    Logout
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
      {menuOpen && (
        <div
          className="
          md:hidden
          bg-purple-700/95
          backdrop-blur-lg
          px-4
          pb-4
          flex
          flex-col
          gap-3
          text-lg
          "
        >
          {user && user.role === "user" && (
            <Link to="/my-bookings" onClick={() => setMenuOpen(false)}>
              My Bookings
            </Link>
          )}

          {user && user.role === "admin" && (
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
      )}
    </nav>
  );
}

export default Navbar;
