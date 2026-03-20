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
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createEvent(form);

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
          <div>
            <label className="text-sm font-medium">Title</label>

            <input
              name="title"
              placeholder="Event title"
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>

            <input
              name="category"
              placeholder="Category"
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Date</label>

            <input
              type="date"
              name="date"
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Location</label>

            <input
              name="location"
              placeholder="Location"
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Price</label>

            <input
              name="price"
              placeholder="Price"
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Total Seats</label>

            <input
              name="totalSeats"
              placeholder="Total seats"
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Description</label>

            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              className="border p-2 rounded w-full"
              rows={3}
              required
            />
          </div>

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
              hover:opacity-90
              transition
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
