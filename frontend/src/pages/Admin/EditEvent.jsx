import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";

function EditEvent() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}`);

      setForm(res.data);

      if (res.data.image) {
        setPreview(`http://localhost:5000/${res.data.image}`);
      }

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

  // ✅ image change
  const handleImage = (e) => {
    const file = e.target.files[0];

    setImage(file);

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

      if (image) {
        formData.append("image", image);
      }

      await API.put(`/events/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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

          {/* Title */}
          <div>
            <label>Title</label>

            <input
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Category */}
          <div>
            <label>Category</label>

            <input
              name="category"
              value={form.category || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Date */}
          <div>
            <label>Date</label>

            <input
              type="date"
              name="date"
              value={form.date?.substring(0, 10) || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Location */}
          <div>
            <label>Location</label>

            <input
              name="location"
              value={form.location || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Price */}
          <div>
            <label>Price</label>

            <input
              name="price"
              value={form.price || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Seats */}
          <div>
            <label>Total Seats</label>

            <input
              name="totalSeats"
              value={form.totalSeats || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
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
              value={form.description || ""}
              onChange={handleChange}
              rows={3}
              className="border p-2 rounded w-full"
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
              Update Event
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditEvent;