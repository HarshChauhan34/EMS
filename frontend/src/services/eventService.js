import API from "./api";

export const getEvents = () => API.get("/events");

export const getEventById = (id) => API.get(`/events/${id}`);

// ✅ FIXED
export const createEvent = (data) => {
  return API.post("/events", data);
};

// ✅ also fix update (for image update)
export const updateEvent = (id, data) => {
  return API.put(`/events/${id}`, data);
};

export const deleteEvent = (id) => API.delete(`/events/${id}`);
