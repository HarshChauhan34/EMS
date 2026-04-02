import express from "express";

import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ================= PUBLIC ROUTES =================

// Get all events
router.get("/", getAllEvents);

// Get single event
router.get("/:id", getEventById);

// ================= ADMIN ROUTES =================

// Create event
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"), // ✅ Cloudinary upload
  createEvent,
);

// Update event
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"), // ✅ Replace image if new uploaded
  updateEvent,
);

// Delete event
router.delete("/:id", protect, adminOnly, deleteEvent);

export default router;
