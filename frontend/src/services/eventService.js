import API from "./api";

// ================= GET =================
export const getEvents = () => API.get("/events");

export const getEventById = (id) => API.get(`/events/${id}`);

// ================= CREATE =================
export const createEvent = (data) => {
  // FormData automatically sets correct Content-Type with boundary
  return API.post("/events", data);
};

// ================= UPDATE =================
export const updateEvent = (id, data) => {
  // FormData automatically sets correct Content-Type with boundary
  return API.put(`/events/${id}`, data);
};

// ================= DELETE =================
export const deleteEvent = (id) => API.delete(`/events/${id}`);