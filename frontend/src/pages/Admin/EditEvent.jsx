import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}`);
      setForm(res.data);

      if (res.data.image) {
        const imgUrl = BASE_URL.replace("/api", "") + "/" + res.data.image;
        setPreview(imgUrl);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (image) formData.append("image", image);

      await API.put(`/events/${id}`, formData);

      alert("Event updated successfully 🚀");
      navigate("/admin");
    } catch (error) {
      alert("Update failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white px-4 py-10 flex items-center justify-center">

      <div className="w-full max-w-6xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">

        {/* HEADER */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-indigo-400 text-transparent bg-clip-text">
            ✏ Edit Event
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            Update your event details professionally
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-8 grid md:grid-cols-2 gap-8"
        >

          {/* LEFT SIDE */}
          <div className="space-y-5">

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
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <label className="absolute left-4 top-2 text-sm text-gray-400 transition-all 
                  peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
                  peer-focus:top-2 peer-focus:text-sm">
                  {field.label}
                </label>
              </div>
            ))}

            {/* DATE */}
            <input
              type="date"
              name="date"
              value={form.date?.substring(0, 10) || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-purple-500 outline-none"
            />

          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-5">

            {/* IMAGE */}
            <div>
              <label className="text-gray-300 text-sm">
                Event Image
              </label>

              <div className="mt-2 border-2 border-dashed border-white/20 rounded-xl p-5 text-center hover:border-indigo-400 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="w-full cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Upload new image (optional)
                </p>
              </div>

              {preview && (
                <div className="mt-4 relative">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-56 object-cover rounded-xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl" />
                </div>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="relative">
              <textarea
                name="description"
                value={form.description || ""}
                onChange={handleChange}
                rows={5}
                placeholder=" "
                className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-pink-500 outline-none"
              />
              <label className="absolute left-4 top-2 text-sm text-gray-400 transition-all 
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
                peer-focus:top-2 peer-focus:text-sm">
                Description
              </label>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 pt-2">

              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 hover:scale-105 transition shadow-lg"
              >
                ✔ Update
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="flex-1 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition"
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