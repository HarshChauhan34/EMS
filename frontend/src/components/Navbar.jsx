import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("user")
    );
    setUser(storedUser);
  }, [location]);

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register";

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
      bg-gradient-to-r
      from-indigo-600
      via-purple-600
      to-pink-500
      text-white
      shadow-lg
      "
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/">
          <h1
            className="
            text-xl sm:text-2xl
            font-bold
            tracking-wide
            hover:scale-105
            transition
            "
          >
            🎟 Event System
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 text-sm sm:text-base">

          {/* User */}
          {user && user.role === "user" && (
            <Link
              to="/my-bookings"
              className="hover:text-yellow-300 transition"
            >
              My Bookings
            </Link>
          )}

          {/* Not logged */}
          {!user && (
            <>
              <Link
                to="/login"
                className="
                bg-white
                text-black
                px-4
                py-1
                rounded-full
                hover:bg-gray-200
                transition
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
                bg-yellow-400
                text-black
                px-4
                py-1
                rounded-full
                hover:bg-yellow-300
                transition
                "
              >
                Register
              </Link>
            </>
          )}

          {/* Logged */}
          {user && (
            <button
              onClick={logoutHandler}
              className="
              bg-red-500
              px-4
              py-1
              rounded-full
              hover:bg-red-600
              transition
              "
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="
          md:hidden
          bg-purple-700
          px-4
          pb-4
          flex
          flex-col
          gap-3
          text-lg
          shadow-lg
          "
        >
          {user && (
            <Link
              to="/my-bookings"
              onClick={() => setMenuOpen(false)}
              className="hover:text-yellow-300"
            >
              My Bookings
            </Link>
          )}

          {!user && (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="
                bg-white
                text-black
                px-3
                py-1
                rounded-full
                text-center
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="
                bg-yellow-400
                text-black
                px-3
                py-1
                rounded-full
                text-center
                "
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={() => {
                logoutHandler();
                setMenuOpen(false);
              }}
              className="
              bg-red-500
              px-3
              py-1
              rounded-full
              "
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;