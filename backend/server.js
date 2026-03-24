import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import adminRoutes from "./routes/adminRoutes.js";


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes); 
app.use("/uploads", express.static("uploads"));
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Event Management System API is running...");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You are authorized!",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
