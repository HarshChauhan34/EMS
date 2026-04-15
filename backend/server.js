import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

// ✅ LOAD ENV VARIABLES FIRST - MUST be before any imports
dotenv.config();

// ✅ Import modules that DON'T depend on env vars
import connectDB from "./config/db.js";
import { protect } from "./middleware/authMiddleware.js";

// ✅ Start async initialization
(async () => {
  // ✅ Dynamic imports for routes that depend on env vars (cloudinary)
  const { default: authRoutes } = await import("./routes/authRoutes.js");
  const { default: eventRoutes } = await import("./routes/eventRoutes.js");
  const { default: bookingRoutes } = await import("./routes/bookingRoutes.js");
  const { default: dashboardRoutes } = await import("./routes/dashboardRoutes.js");
  const { default: adminRoutes } = await import("./routes/adminRoutes.js");

  // ================= CONNECT DB =================
  connectDB();

  const app = express();

  // ================= CORS =================
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
    "http://localhost:3000",
    "https://ems-4.vercel.app"
  ];

  app.use(cors({
    origin: "*",
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));

  // ================= BODY PARSER =================
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ================= STATIC FILES =================
  // Helps frontend load uploaded images properly
  app.use(
    "/uploads",
    express.static(path.resolve("uploads"), {
      setHeaders: (res) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      },
    }),
  );

  // ================= ROUTES =================
  app.use("/api/auth", authRoutes);
  app.use("/api/events", eventRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/admin", adminRoutes);

  // ================= TEST =================
  app.get("/", (req, res) => {
    res.send("🚀 Event Management System API is running...");
  });

  app.get("/api/protected", protect, (req, res) => {
    res.json({
      message: "You are authorized!",
      user: req.user,
    });
  });

  // ================= 404 =================
  app.use((req, res) => {
    res.status(404).json({
      success: false,
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

  console.log(
    "Email service:",
    process.env.EMAIL_USER && process.env.EMAIL_PASS
      ? "Configured"
      : "Not configured",
  );

  // ================= SERVER =================
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();