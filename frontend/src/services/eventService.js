import API from "./api";

// ================= GET =================
export const getEvents = () => API.get("/events");

export const getEventById = (id) => API.get(`/events/${id}`);

// ================= CREATE =================
export const createEvent = (data) => {
  return API.post("/events", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ================= UPDATE =================
export const updateEvent = (id, data) => {
  return API.put(`/events/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ================= DELETE =================
export const deleteEvent = (id) => API.delete(`/events/${id}`);