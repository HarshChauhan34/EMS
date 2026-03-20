import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";

function EditEvent() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({});

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}`);

      setForm(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/events/${id}`, form);

      alert("Event updated");

      navigate("/admin");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-3xl p-6 sm:p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Edit Event
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div>
            <label className="text-sm font-medium">Title</label>

            <input
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>

            <input
              name="category"
              value={form.category || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Date</label>

            <input
              type="date"
              name="date"
              value={form.date?.substring(0, 10) || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Location</label>

            <input
              name="location"
              value={form.location || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Price</label>

            <input
              name="price"
              value={form.price || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Total Seats</label>

            <input
              name="totalSeats"
              value={form.totalSeats || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Description</label>

            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              rows={3}
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
              Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEvent;
