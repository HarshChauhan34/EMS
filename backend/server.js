import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Middleware
import { protect } from "./middleware/authMiddleware.js";

dotenv.config();

// Connect Database
connectDB();

const app = express();

// ================= MIDDLEWARE =================

// ✅ CORS (better config)
app.use(
  cors({
    origin: "https://ems-4.vercel.app/", // change to frontend URL in production
    credentials: true,
  }),
);

// ✅ Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static("uploads"));

// ================= TEST ROUTES =================

app.get("/", (req, res) => {
  res.send("Event Management System API is running...");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You are authorized!",
    user: req.user,
  });
});

// ================= 404 HANDLER =================
app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
