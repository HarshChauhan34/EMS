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
      const res = await updateProfile({
        name,
        email,
      });

      localStorage.setItem("user", JSON.stringify(res.data));

      setUser(res.data);
      setEditMode(false);

      alert("Profile updated");
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  if (!user) return null;

  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-indigo-300
      via-purple-200
      to-pink-200
      flex
      items-center
      justify-center
      px-4
      py-10
      "
    >
      <div
        className="
        w-full
        max-w-xl
        bg-white/70
        backdrop-blur-xl
        rounded-3xl
        shadow-2xl
        overflow-hidden
        "
      >
        {/* Header */}
        <div
          className="
          bg-gradient-to-r
          from-indigo-600
          to-purple-600
          p-6
          text-center
          text-white
          "
        >
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>

        <div className="p-8 text-center">
          {/* Avatar */}
          <div className="flex justify-center">
            <div
              className="
              w-28 h-28
              rounded-full
              bg-gradient-to-r
              from-indigo-600
              to-purple-600
              flex
              items-center
              justify-center
              text-4xl
              text-white
              font-bold
              ring-4
              ring-white
              shadow-lg
              "
            >
              {name ? name[0].toUpperCase() : "U"}
            </div>
          </div>

          {/* Name */}
          <div className="mt-6">
            {editMode ? (
              <input
                className="
                border
                rounded-lg
                px-3
                py-2
                w-full
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-400
                "
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
                className="
                border
                rounded-lg
                px-3
                py-2
                w-full
                focus:ring-2
                focus:ring-indigo-400
                "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              <p className="text-gray-600">{user.email}</p>
            )}
          </div>

          {/* Role */}
          <div className="mt-3">
            <span
              className="
              px-4
              py-1
              text-sm
              rounded-full
              bg-gradient-to-r
              from-indigo-500
              to-purple-600
              text-white
              shadow
              "
            >
              {user.role.toUpperCase()}
            </span>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            {/* Edit */}
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="
                w-full
                bg-blue-500
                text-white
                py-2
                rounded-lg
                hover:bg-blue-600
                transition
                "
              >
                ✏ Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={saveProfile}
                  className="
                  w-full
                  bg-green-500
                  text-white
                  py-2
                  rounded-lg
                  hover:bg-green-600
                  "
                >
                  ✔ Save
                </button>

                <button
                  onClick={() => setEditMode(false)}
                  className="
                  w-full
                  bg-gray-400
                  text-white
                  py-2
                  rounded-lg
                  "
                >
                  Cancel
                </button>
              </>
            )}

            {/* USER */}
            {user.role === "user" && (
              <button
                onClick={() => navigate("/my-bookings")}
                className="
                w-full
                bg-emerald-600
                text-white
                py-2
                rounded-lg
                hover:bg-emerald-700
                "
              >
                📅 My Bookings
              </button>
            )}

            {/* ADMIN */}
            {user.role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="
                w-full
                bg-indigo-600
                text-white
                py-2
                rounded-lg
                hover:bg-indigo-700
                "
              >
                ⚙ Admin Dashboard
              </button>
            )}

            <button
              onClick={() => navigate("/")}
              className="
              w-full
              bg-gray-200
              py-2
              rounded-lg
              hover:bg-gray-300
              "
            >
              🏠 Home
            </button>

            <button
              onClick={logoutHandler}
              className="
              w-full
              bg-red-500
              text-white
              py-2
              rounded-lg
              hover:bg-red-600
              "
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
