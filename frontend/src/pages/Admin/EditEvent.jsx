import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";

const BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    location: "",
    price: "",
    availableSeats: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= FETCH EVENT =================
  useEffect(() => {
    fetchEvent();

    return () => {
      // ✅ Clean blob preview
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}`);
      const data = res.data;

      setForm({
        title: data.title || "",
        description: data.description || "",
        category: data.category || "",
        date: data.date || "",
        location: data.location || "",
        price: data.price || "",
        availableSeats: data.availableSeats || "",
      });

      // ✅ FIXED: correct image URL
      if (data.image) {
        setPreview(`${BASE_URL}/${data.image}`);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["price", "availableSeats"].includes(name)) {
      setForm({
        ...form,
        [name]: value === "" ? "" : Number(value),
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ================= HANDLE IMAGE =================
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    // ✅ Clean old preview
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value !== "" && value !== null) {
          formData.append(key, value);
        }
      });

      if (image) formData.append("image", image);

      await API.put(`/events/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Event updated successfully 🚀");
      navigate("/admin");
    } catch (error) {
      console.error("Update Error:", error);
      alert(error?.response?.data?.message || "Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e1b4b] to-black text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="p-6 md:p-8 border-b border-white/10 bg-linear-to-r from-pink-500/10 to-indigo-500/10">
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-pink-400 to-indigo-400 text-transparent bg-clip-text">
            ✏ Edit Event
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Make your event look amazing ✨
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-10 grid md:grid-cols-2 gap-10"
        >
          {/* LEFT */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-indigo-300">
              📌 Event Details
            </h2>

            {[
              { name: "title", label: "Event Title" },
              { name: "category", label: "Category" },
              { name: "location", label: "Location" },
              { name: "price", label: "Price", type: "number" },
              {
                name: "availableSeats",
                label: "Available Seats",
                type: "number",
              },
            ].map((field) => (
              <div key={field.name} className="relative">
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-white/5 border border-white/20 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
                <label
                  className="absolute left-4 top-2 text-sm text-gray-400 
                  peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
                  peer-focus:top-2 peer-focus:text-sm transition-all"
                >
                  {field.label}
                </label>
              </div>
            ))}

            <input
              type="date"
              name="date"
              value={form.date ? form.date.substring(0, 10) : ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-pink-300">
              🖼 Media & Description
            </h2>

            {/* IMAGE UPLOAD */}
            <div className="relative group border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-indigo-400 transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <p className="text-gray-400 group-hover:text-indigo-400">
                Click or Drag Image Here
              </p>
            </div>

            {/* PREVIEW */}
            {preview && (
              <div className="overflow-hidden rounded-xl">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-56 object-cover hover:scale-110 transition"
                />
              </div>
            )}

            {/* DESCRIPTION */}
            <div className="relative">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder=" "
                className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-white/5 border border-white/20 focus:ring-2 focus:ring-pink-500 outline-none"
              />
              <label
                className="absolute left-4 top-2 text-sm text-gray-400 
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
                peer-focus:top-2 peer-focus:text-sm transition-all"
              >
                Description
              </label>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-semibold bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg hover:scale-[1.05] transition disabled:opacity-50"
              >
                {loading ? "Updating..." : "🚀 Update"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEvent;
