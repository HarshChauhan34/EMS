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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ image change
  const handleImage = (e) => {
    const file = e.target.files[0];

    setForm({
      ...form,
      image: file,
    });

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("date", form.date);
      formData.append("location", form.location);
      formData.append("price", form.price);
      formData.append("totalSeats", form.totalSeats);

      if (form.image) {
        formData.append("image", form.image);
      }

      await createEvent(formData);

      alert("Event created");

      navigate("/admin");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-3xl p-6 sm:p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Add New Event
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Title */}
          <div>
            <label>Title</label>

            <input
              name="title"
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label>Category</label>

            <input
              name="category"
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label>Date</label>

            <input
              type="date"
              name="date"
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label>Location</label>

            <input
              name="location"
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label>Price</label>

            <input
              name="price"
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Seats */}
          <div>
            <label>Total Seats</label>

            <input
              name="totalSeats"
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Image */}
          <div className="sm:col-span-2">
            <label>Event Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="border p-2 rounded w-full"
            />

            {preview && (
              <img
                src={preview}
                alt=""
                className="
                mt-2
                w-full
                h-40
                object-cover
                rounded
                "
              />
            )}
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label>Description</label>

            <textarea
              name="description"
              rows={3}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Button */}
          <div className="sm:col-span-2">
            <button
              className="
              w-full
              bg-gradient-to-r
              from-indigo-600
              to-purple-600
              text-white
              py-2
              rounded-lg
              "
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEvent;
