import API from "./api";

export const getAllUsers = () => API.get("/admin/users");

export const getUserBookings = (id) => API.get(`/admin/users/${id}/bookings`);
