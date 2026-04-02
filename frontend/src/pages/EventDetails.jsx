import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { bookEvent } from "../services/bookingService";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState(1);

  const user = JSON.parse(localStorage.getItem("user"));

  const API_URL = "http://localhost:5000/api";
  const SERVER_URL = API_URL.replace("/api", "");

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    const res = await API.get(`/events/${id}`);
    setEvent(res.data);
  };

  const handleBook = async () => {
    if (!user) return navigate("/login");

    try {
      await bookEvent({ eventId: event._id, seats });
      alert("🎉 Booking Confirmed!");
      fetchEvent();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  if (!event) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  const imageUrl = event.image
    ? `${SERVER_URL}/${event.image}`
    : "https://via.placeholder.com/800x400";

  const totalPrice = seats * event.price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-4 py-8">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* LEFT SIDE - EVENT */}
        <div className="lg:col-span-2 space-y-6">

          {/* IMAGE */}
          <div className="relative group rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={imageUrl}
              className="w-full h-[250px] sm:h-[400px] object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            <div className="absolute bottom-4 left-4">
              <h1 className="text-2xl sm:text-4xl font-bold">
                {event.title}
              </h1>
              <p className="opacity-80">{event.category}</p>
            </div>
          </div>

          {/* DETAILS */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <p className="text-gray-200 leading-relaxed">
              {event.description}
            </p>

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

        {/* RIGHT SIDE - BOOKING PANEL */}
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
                  onClick={() => setSeats(seats > 1 ? seats - 1 : 1)}
                  className="w-10 h-10 bg-red-500 text-white rounded-full hover:scale-110 transition"
                >
                  -
                </button>

                <span className="text-xl font-bold">{seats}</span>

                <button
                  onClick={() =>
                    setSeats(
                      seats < event.availableSeats ? seats + 1 : seats
                    )
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
                onClick={() => navigate(`/edit-event/${event._id}`)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:scale-[1.02] transition"
              >
                Edit Event
              </button>
            ) : (
              <button
                onClick={handleBook}
                disabled={event.availableSeats === 0}
                className={`w-full py-3 rounded-xl font-semibold transition ${
                  event.availableSeats === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:scale-[1.03] shadow-lg"
                }`}
              >
                {event.availableSeats === 0
                  ? "Sold Out"
                  : "🚀 Book Now"}
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;