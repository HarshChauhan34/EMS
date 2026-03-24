import { useEffect, useState } from "react";
import { getEvents } from "../services/eventService";
import EventCard from "../components/EventCard";
import { useNavigate } from "react-router-dom";

function Home() {
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    // redirect admin
    if (user?.role === "admin") {
      navigate("/admin");
      return;
    }

    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-indigo-100
      via-purple-100
      to-pink-100
      px-4
      py-8
      "
    >
      {/* Title */}
      <h1
        className="
        text-3xl
        md:text-4xl
        font-bold
        text-center
        mb-8
        bg-gradient-to-r
        from-indigo-600
        to-purple-600
        text-transparent
        bg-clip-text
        "
      >
        🎉 Explore Events
      </h1>

      {/* Container */}
      <div
        className="
        max-w-7xl
        mx-auto
        bg-white/60
        backdrop-blur-md
        p-4
        rounded-2xl
        shadow-xl
        "
      >
        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-6
          "
        >
          {events.map((event) => (
            <EventCard key={event._id} event={event} refresh={fetchEvents} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
