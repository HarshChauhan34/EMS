import API from "./api";

// ================= USERS =================
export const getAllUsers = () => API.get("/admin/users");

export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

export const getUserBookings = (id) =>
  API.get(`/admin/users/${id}/bookings`);

// ================= ORGANIZER =================

// Get all organizers
export const getAllOrganizers = () => API.get("/admin/organizers");

// Get only pending requests
export const getPendingOrganizerRequests = () =>
  API.get("/admin/organizers/pending");

// Approve organizer
export const approveOrganizer = (id) =>
  API.put(`/admin/organizers/${id}/approve`);

// Reject organizer
export const rejectOrganizer = (id) =>
  API.put(`/admin/organizers/${id}/reject`);