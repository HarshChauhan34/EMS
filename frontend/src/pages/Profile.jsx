import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../services/userService";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login");
      return;
    }

    setUser(storedUser);
    setName(storedUser.name);
    setEmail(storedUser.email);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const saveProfile = async () => {
    try {
      const res = await updateProfile({ name, email });

      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setEditMode(false);
    } catch (error) {
      alert("Update failed");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-5xl">

        {/* PROFILE HEADER */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 flex flex-col md:flex-row items-center gap-6">

          {/* AVATAR */}
          <div className="relative">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-4xl font-bold shadow-2xl ring-4 ring-white/20">
              {name ? name[0].toUpperCase() : "U"}
            </div>

            {/* Glow */}
            <div className="absolute inset-0 rounded-full blur-xl bg-pink-500/30"></div>
          </div>

          {/* USER INFO */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold">
              {user.name}
            </h2>

            <p className="text-gray-300 mt-1">{user.email}</p>

            <span className="inline-block mt-3 px-4 py-1 text-sm rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
              {user.role.toUpperCase()}
            </span>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">

          {/* PROFILE FORM */}
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">

            <h3 className="text-xl font-semibold mb-5">
              👤 Profile Info
            </h3>

            {/* NAME */}
            <div className="mb-4">
              <label className="text-sm text-gray-300">Full Name</label>

              {editMode ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              ) : (
                <p className="mt-1 font-medium">{user.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-300">Email</label>

              {editMode ? (
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              ) : (
                <p className="mt-1 font-medium">{user.email}</p>
              )}
            </div>
          </div>

          {/* ACTION PANEL */}
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">

            <h3 className="text-xl font-semibold mb-5">
              ⚙ Actions
            </h3>

            <div className="flex flex-col gap-3">

              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 py-2 rounded-xl hover:scale-105 transition shadow-lg"
                >
                  ✏ Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={saveProfile}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 py-2 rounded-xl hover:scale-105 transition shadow-lg"
                  >
                    ✔ Save Changes
                  </button>

                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-500 py-2 rounded-xl hover:scale-105 transition"
                  >
                    Cancel
                  </button>
                </>
              )}

              {/* ROLE BASED */}
              {user.role === "user" && (
                <button
                  onClick={() => navigate("/my-bookings")}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 py-2 rounded-xl hover:scale-105 transition shadow-lg"
                >
                  📅 My Bookings
                </button>
              )}

              {user.role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 py-2 rounded-xl hover:scale-105 transition shadow-lg"
                >
                  ⚙ Admin Dashboard
                </button>
              )}

              <button
                onClick={() => navigate("/")}
                className="bg-white/10 border border-white/20 py-2 rounded-xl hover:bg-white/20 transition"
              >
                🏠 Home
              </button>

              <button
                onClick={logoutHandler}
                className="bg-gradient-to-r from-red-500 to-pink-600 py-2 rounded-xl hover:scale-105 transition shadow-lg"
              >
                🚪 Logout
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;