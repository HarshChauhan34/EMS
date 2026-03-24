import API from "./api";

export const updateProfile = (data) =>
  API.put("/auth/profile", data);