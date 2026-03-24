import axios from "axios";

const API = axios.create({
  // eslint-disable-next-line no-constant-binary-expression
  baseURL: "https://ems-4-dflv.onrender.com/api" || "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }

  return req;
});

export default API;