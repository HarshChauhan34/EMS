import API from "./api";

// ================= UPDATE PROFILE =================
export const updateProfile = (data) => API.put("/auth/profile", data);