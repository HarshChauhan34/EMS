import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { bookEvent } from "../services/bookingService";

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState(1);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}`);
      setEvent(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBook = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await bookEvent({
        eventId: event._id,
        seats: seats,
      });

      alert("Booking successful");

      fetchEvent();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  if (!event)
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );

  const imageUrl = event.image
    ? `https://ems-4-dflv.onrender.com/${event.image}`
    : "http://localhost:5000/${event.image}";

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-8 px-2 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Image */}
        <img
          src={imageUrl}
          alt="event"
          className="w-full h-52 sm:h-72 object-cover"
        />

        {/* Header */}
        <div
          className="
          bg-gradient-to-r
          from-indigo-600
          via-purple-600
          to-pink-500
          text-white
          p-4 sm:p-6
        "
        >
          <h1 className="text-lg sm:text-3xl font-bold">{event.title}</h1>

          <p className="text-xs sm:text-base opacity-90">{event.category}</p>
        </div>

        {/* Body */}
        <div className="p-3 sm:p-6 space-y-4">
          {/* Description */}
          <p className="text-gray-700 text-sm sm:text-base">
            {event.description}
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-100 p-3 rounded">
              📅 Date
              <br />
              <span className="font-semibold">
                {new Date(event.date).toLocaleDateString()}
              </span>
            </div>

            <div className="bg-gray-100 p-3 rounded">
              📍 Location
              <br />
              <span className="font-semibold">{event.location}</span>
            </div>

            <div className="bg-gray-100 p-3 rounded">
              💰 Price
              <br />
              <span className="font-semibold">₹ {event.price}</span>
            </div>

            <div className="bg-gray-100 p-3 rounded">
              🎟 Seats Available
              <br />
              <span className="font-semibold">{event.availableSeats}</span>
            </div>
          </div>

          {/* Seat selector (only for user) */}
          {user?.role !== "admin" && (
            <div className="mt-4">
              <p className="font-semibold mb-2 text-sm sm:text-base">
                Select Seats
              </p>

              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => setSeats(seats > 1 ? seats - 1 : 1)}
                  className="px-3 py-1 bg-gray-300 rounded text-lg"
                >
                  -
                </button>

                <span className="text-lg sm:text-xl font-bold">{seats}</span>

                <button
                  onClick={() =>
                    setSeats(seats < event.availableSeats ? seats + 1 : seats)
                  }
                  className="px-3 py-1 bg-gray-300 rounded text-lg"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Buttons */}

          {user?.role === "admin" ? (
            <button
              onClick={() => navigate(`/edit-event/${event._id}`)}
              className="
              w-full
              mt-4
              bg-gradient-to-r
              from-blue-500
              to-indigo-600
              text-white
              py-2 sm:py-3
              rounded-lg
              text-sm sm:text-lg
              "
            >
              Edit Event
            </button>
          ) : (
            <button
              onClick={handleBook}
              disabled={event.availableSeats === 0}
              className="
              w-full
              mt-4
              bg-gradient-to-r
              from-green-500
              to-emerald-600
              text-white
              py-2 sm:py-3
              rounded-lg
              text-sm sm:text-lg
              disabled:bg-gray-400
              "
            >
              {event.availableSeats === 0 ? "Sold Out" : "Book Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
