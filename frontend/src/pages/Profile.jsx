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

      alert("✅ Profile updated successfully");
    } catch (error) {
      alert("❌ Update failed");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-400 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transition hover:shadow-purple-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-700 p-6 text-center text-white">
          <h1 className="text-3xl font-bold tracking-wide">My Profile</h1>
          <p className="text-sm opacity-80">Manage your account details</p>
        </div>

        <div className="p-8 text-center">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600 flex items-center justify-center text-4xl text-white font-bold shadow-xl ring-4 ring-white hover:scale-105 transition">
              {name ? name[0].toUpperCase() : "U"}
            </div>
          </div>

          {/* Name */}
          <div className="mt-6">
            {editMode ? (
              <input
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            )}
          </div>

          {/* Email */}
          <div className="mt-3">
            {editMode ? (
              <input
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              <p className="text-gray-600 text-lg">{user.email}</p>
            )}
          </div>

          {/* Role Badge */}
          <div className="mt-4">
            <span className="px-5 py-1 text-sm rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md">
              {user.role.toUpperCase()}
            </span>
          </div>

          {/* Buttons */}
          <div className="mt-8 grid gap-3">
            {/* Edit / Save */}
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl transition transform hover:scale-105 shadow-md"
              >
                ✏ Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={saveProfile}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl transition transform hover:scale-105 shadow-md"
                >
                  ✔ Save Changes
                </button>

                <button
                  onClick={() => setEditMode(false)}
                  className="w-full bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-xl transition"
                >
                  Cancel
                </button>
              </>
            )}

            {/* User */}
            {user.role === "user" && (
              <button
                onClick={() => navigate("/my-bookings")}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl transition transform hover:scale-105 shadow-md"
              >
                📅 My Bookings
              </button>
            )}

            {/* Admin */}
            {user.role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl transition transform hover:scale-105 shadow-md"
              >
                ⚙ Admin Dashboard
              </button>
            )}

            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-xl transition"
            >
              🏠 Home
            </button>

            <button
              onClick={logoutHandler}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition transform hover:scale-105 shadow-md"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
