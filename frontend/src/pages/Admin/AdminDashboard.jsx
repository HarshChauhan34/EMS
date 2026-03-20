import { useEffect, useState } from "react";
import { getEvents } from "../../services/eventService";
import EventCard from "../../components/EventCard";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const [events, setEvents] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {
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

    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">

        <h1 className="text-2xl sm:text-3xl font-bold">
          Admin Dashboard
        </h1>


        <button
          onClick={() => navigate("/admin/add-event")}
          className="
          bg-gradient-to-r
          from-indigo-600
          to-purple-600
          text-white
          px-4
          py-2
          rounded-lg
          hover:opacity-90
          transition
          "
        >
          + Add Event
        </button>

      </div>


      {/* Events Grid */}
      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        gap-4
        "
      >

        {events.map((event) => (

          <EventCard
            key={event._id}
            event={event}
            refresh={fetchEvents}
          />

        ))}

      </div>

    </div>

  );
}

export default AdminDashboard;