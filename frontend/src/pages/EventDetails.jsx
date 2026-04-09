import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { bookEvent } from "../services/bookingService";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Use ENV (VERY IMPORTANT)
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const SERVER_URL = API_URL.replace("/api", "");

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(`/events/${id}`);
      setEvent(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load event ❌");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // ================= FETCH EVENT =================
  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  // ================= BOOK =================
  const handleBook = async () => {
    if (!user) return navigate("/login");

    try {
      await bookEvent({ eventId: event._id, seats });
      alert("🎉 Booking Confirmed!");
      fetchEvent();
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed ❌");
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white text-xl">
        ⏳ Loading Event...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="h-screen flex items-center justify-center text-red-400">
        Event not found ❌
      </div>
    );
  }

  // ✅ FIX IMAGE PATH
  const imageUrl = event.image
    ? `${SERVER_URL}${event.image.startsWith("/") ? "" : "/"}${event.image}`
    : "/placeholder.jpg";

  const totalPrice = seats * event.price;

  return (
    <div className="theme-page min-h-screen bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-4 py-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* IMAGE */}
          <div className="relative group rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={imageUrl}
              alt="event"
              className="w-full h-62.5 sm:h-100 object-cover transition duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-4">
              <h1 className="text-2xl sm:text-4xl font-bold">{event.title}</h1>
              <p className="opacity-80">{event.category}</p>
            </div>
          </div>

          {/* DETAILS */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <p className="text-gray-200 leading-relaxed">{event.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-center">
              <div className="bg-white/10 p-4 rounded-xl">
                📅
                <p className="text-xs opacity-70">Date</p>
                <p className="font-semibold">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-white/10 p-4 rounded-xl">
                📍
                <p className="text-xs opacity-70">Location</p>
                <p className="font-semibold">{event.location}</p>
              </div>

              <div className="bg-white/10 p-4 rounded-xl">
                💰
                <p className="text-xs opacity-70">Price</p>
                <p className="font-semibold">₹ {event.price}</p>
              </div>

              <div className="bg-white/10 p-4 rounded-xl">
                🎟
                <p className="text-xs opacity-70">Available</p>
                <p className="font-semibold">{event.availableSeats}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="sticky top-24 h-fit">
          <div className="bg-white text-black rounded-2xl p-6 shadow-2xl space-y-5">
            <h2 className="text-xl font-bold">🎟 Book Tickets</h2>

            {/* PRICE */}
            <div className="flex justify-between">
              <span>Price per seat</span>
              <span className="font-semibold">₹ {event.price}</span>
            </div>

            {/* SEATS */}
            <div>
              <p className="font-medium mb-2">Select Seats</p>

              <div className="flex items-center justify-between bg-gray-100 rounded-xl p-3">
                <button
                  onClick={() => setSeats((prev) => Math.max(1, prev - 1))}
                  className="w-10 h-10 bg-red-500 text-white rounded-full hover:scale-110 transition"
                >
                  -
                </button>

                <span className="text-xl font-bold">{seats}</span>

                <button
                  onClick={() =>
                    setSeats((prev) => Math.min(event.availableSeats, prev + 1))
                  }
                  className="w-10 h-10 bg-green-500 text-white rounded-full hover:scale-110 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* TOTAL */}
            <div className="flex justify-between text-lg font-bold border-t pt-3">
              <span>Total</span>
              <span>₹ {totalPrice}</span>
            </div>

            {/* BUTTON */}
            {user?.role === "admin" ? (
              <button
                onClick={() => navigate(`/admin/edit-event/${event._id}`)}
                className="w-full py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:scale-[1.02] transition"
              >
                ✏ Edit Event
              </button>
            ) : (
              <button
                onClick={handleBook}
                disabled={event.availableSeats === 0}
                className={`w-full py-3 rounded-xl font-semibold transition ${
                  event.availableSeats === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-pink-500 to-purple-600 text-white hover:scale-[1.03] shadow-lg"
                }`}
              >
                {event.availableSeats === 0 ? "❌ Sold Out" : "🚀 Book Now"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
