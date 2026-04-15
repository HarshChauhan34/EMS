import axios from "axios";
import { getStoredUser } from "../utils/authStorage";

export const BASE_URL = (
  import.meta.env.VITE_API_URL || "https://ems-4-dflv.onrender.com/api"
).replace(/\/+$/, "");

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

API.interceptors.request.use((req) => {
  const user = getStoredUser();

  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }

  // Don't override Content-Type for FormData - let axios set it with boundary
  if (req.data instanceof FormData) {
    delete req.headers["Content-Type"];
  }

  return req;
});

export default API;
