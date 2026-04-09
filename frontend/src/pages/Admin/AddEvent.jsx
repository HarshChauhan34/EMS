import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../services/eventService";
import { motion } from "framer-motion";

function AddEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    location: "",
    price: "",
    totalSeats: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["price", "totalSeats"].includes(name)) {
      setForm({ ...form, [name]: value === "" ? "" : Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setPreview(null);
      setForm({ ...form, image: null });
      return;
    }

    if (!file.type.startsWith("image/")) return alert("Only image allowed");
    if (file.size > 2 * 1024 * 1024) return alert("Max 2MB allowed");

    setForm({ ...form, image: file });
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) return alert("Upload image");

    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== "") formData.append(k, v);
      });

      await createEvent(formData);
      navigate("/admin");
    } catch {
      alert("Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e1b4b] to-black flex items-center justify-center px-4 py-10 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        {/* HEADER */}
        <div className="relative p-10 text-center border-b border-white/10">
          <div className="absolute inset-0 bg-linear-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 blur-2xl" />
          <h1 className="relative text-4xl md:text-5xl font-extrabold bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text">
            Create Event
          </h1>
          <p className="relative text-gray-400 mt-3">
            Professional event creation dashboard ✨
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-10 grid md:grid-cols-2 gap-10"
        >
          {/* LEFT */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-indigo-300 font-semibold text-lg">
              Event Details
            </h2>

            {[
              { name: "title", label: "Event Title" },
              { name: "category", label: "Category" },
              { name: "location", label: "Location" },
              { name: "price", label: "Price", type: "number" },
              { name: "totalSeats", label: "Seats", type: "number" },
            ].map((field) => (
              <motion.div
                whileFocus={{ scale: 1.02 }}
                key={field.name}
                className="relative"
              >
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-white/5 border border-white/20 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
                <label className="absolute left-4 top-2 text-sm text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm transition-all">
                  {field.label}
                </label>
              </motion.div>
            ))}

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-pink-300 font-semibold text-lg">
              Media & Description
            </h2>

            {/* UPLOAD */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative group border-2 border-dashed border-white/20 rounded-xl p-10 text-center hover:border-indigo-400 transition cursor-pointer"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <p className="text-gray-400 group-hover:text-indigo-400 transition">
                Drag & Drop or Click to Upload
              </p>
            </motion.div>

            {/* PREVIEW */}
            {preview && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="overflow-hidden rounded-xl"
              >
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-56 object-cover hover:scale-110 transition duration-500"
                />
              </motion.div>
            )}

            {/* DESCRIPTION */}
            <div className="relative">
              <textarea
                name="description"
                rows={5}
                value={form.description}
                onChange={handleChange}
                required
                placeholder=" "
                className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-white/5 border border-white/20 focus:ring-2 focus:ring-pink-500 outline-none"
              />
              <label className="absolute left-4 top-2 text-sm text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm transition-all">
                Description
              </label>
            </div>

            {/* BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg hover:shadow-2xl transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Event 🚀"}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}

export default AddEvent;
