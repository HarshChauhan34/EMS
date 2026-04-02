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
connectDB();

const app = express();

// ================= MIDDLEWARE =================

app.use(cors());
app.use(express.json());

// ================= ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);

// ❌ REMOVE THIS (no longer needed with Cloudinary)
// app.use("/uploads", express.static("uploads"));

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

// ================= ERROR HANDLER =================

app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(500).json({
    message: err.message || "Server Error",
  });
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
