import { useEffect, useState } from "react";
import { getEvents } from "../services/eventService";
import EventCard from "../components/EventCard";
import { useNavigate } from "react-router-dom";

function Home() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.role === "admin") {
      navigate("/admin");
      return;
    }

    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await getEvents();
    setEvents(res.data);
  };

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white px-4 py-8">
      {/* HERO SECTION */}
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text">
          Discover Amazing Events 🎉
        </h1>

        <p className="text-gray-300 max-w-2xl mx-auto">
          Book tickets for concerts, workshops, festivals & more — all in one
          place.
        </p>

        {/* SEARCH */}
        <div className="mt-6 flex justify-center">
          <input
            type="text"
            placeholder="🔍 Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* EVENTS SECTION */}
      <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-semibold">
            🎟 Available Events
          </h2>
        </div>

        {filteredEvents.length === 0 ? (
          <p className="text-center text-gray-400">No events found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className="hover:scale-[1.04] transition duration-300"
              >
                <EventCard event={event} refresh={fetchEvents} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
