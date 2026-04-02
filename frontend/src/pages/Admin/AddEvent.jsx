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
    totalSeats: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= HANDLE IMAGE =================
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setPreview(null);
      return;
    }

    // ✅ Validation (optional but good)
    if (!file.type.startsWith("image")) {
      alert("Only image files allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB");
      return;
    }

    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // ✅ Append all fields
      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== "") {
          formData.append(key, form[key]);
        }
      });

      await createEvent(formData);

      alert("Event created successfully 🚀");
      navigate("/admin");
    } catch (error) {
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-10 border border-white/20">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-indigo-400 text-transparent bg-clip-text">
            🚀 Create New Event
          </h1>
          <p className="text-gray-300 mt-2">
            Fill in the details to publish your event
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* INPUT FIELDS */}
          {[
            { name: "title", label: "Event Title" },
            { name: "category", label: "Category" },
            { name: "location", label: "Location" },
            { name: "price", label: "Price" },
            { name: "totalSeats", label: "Total Seats" },
          ].map((field) => (
            <div key={field.name} className="relative">
              <input
                name={field.name}
                onChange={handleChange}
                required
                placeholder=" "
                className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <label className="absolute left-4 top-2 text-sm text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">
                {field.label}
              </label>
            </div>
          ))}

          {/* DATE */}
          <div>
            <input
              type="date"
              name="date"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div className="md:col-span-2">
            <label className="text-gray-300 font-medium">
              Upload Event Image
            </label>

            <div className="mt-2 border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-indigo-400 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="w-full cursor-pointer"
              />
              <p className="text-sm text-gray-400 mt-1">JPG, PNG (Max 2MB)</p>
            </div>

            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-60 object-cover rounded-xl shadow-lg"
                />
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2 relative">
            <textarea
              name="description"
              rows={4}
              onChange={handleChange}
              required
              placeholder=" "
              className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-pink-500 outline-none"
            />
            <label className="absolute left-4 top-2 text-sm text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">
              Description
            </label>
          </div>

          {/* SUBMIT */}
          <div className="md:col-span-2">
            <button
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-xl hover:scale-[1.03] transition disabled:opacity-50"
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
