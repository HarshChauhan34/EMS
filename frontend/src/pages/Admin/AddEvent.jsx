import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../services/eventService";

function AddEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    location: "",
    price: "",
    availableSeats: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["price", "availableSeats"].includes(name)) {
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

    if (!file.type.startsWith("image/")) {
      alert("Only image allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Max 2MB allowed");
      return;
    }

    setForm({ ...form, image: file });

    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      alert("Upload image");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      await createEvent(formData);

      alert("Event Created 🚀");
      navigate("/admin");
    } catch (error) {
      alert("Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-black text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="p-6 md:p-8 border-b border-white/10 bg-gradient-to-r from-pink-500/10 to-indigo-500/10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-indigo-400 text-transparent bg-clip-text">
            🚀 Create Event
          </h1>
          <p className="text-gray-400 mt-2">Launch your event like a pro ✨</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-10 grid md:grid-cols-2 gap-10"
        >
          {/* LEFT SECTION */}
          <div className="space-y-6">
            <h2 className="text-indigo-300 font-semibold text-lg">
              📌 Event Details
            </h2>

            {[
              { name: "title", label: "Event Title" },
              { name: "category", label: "Category" },
              { name: "location", label: "Location" },
              { name: "price", label: "Price", type: "number" },
              { name: "availableSeats", label: "Seats", type: "number" },
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
              value={form.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* RIGHT SECTION */}
          <div className="space-y-6">
            <h2 className="text-pink-300 font-semibold text-lg">
              🖼 Media & Description
            </h2>

            {/* UPLOAD BOX */}
            <div className="relative group border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-indigo-400 transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <p className="text-gray-400 group-hover:text-indigo-400 transition">
                Click or Drag Image Here
              </p>
            </div>

            {/* PREVIEW */}
            {preview && (
              <div className="overflow-hidden rounded-xl">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-56 object-cover hover:scale-110 transition duration-300"
                />
              </div>
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
              <label
                className="absolute left-4 top-2 text-sm text-gray-400 
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
                peer-focus:top-2 peer-focus:text-sm transition-all"
              >
                Description
              </label>
            </div>

            {/* BUTTON */}
            <button
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg hover:scale-[1.05] transition disabled:opacity-50"
            >
              {loading ? "Uploading..." : "🚀 Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEvent;
