import API from "./api";

export const bookEvent = (data) => API.post("/bookings", data);

export const getMyBookings = () => API.get("/bookings/my");

export const cancelBooking = (id) => API.put(`/bookings/cancel/${id}`);

export const getAllBookings = () => API.get("/bookings");
