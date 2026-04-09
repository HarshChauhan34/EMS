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
  (req, res, next) => {
    upload.single("image")(req, res, function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  createEvent,
);

// Update event
router.put(
  "/:id",
  protect,
  adminOnly,
  (req, res, next) => {
    upload.single("image")(req, res, function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  updateEvent,
);

// Delete event
router.delete("/:id", protect, adminOnly, deleteEvent);

export default router;
