import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  organizerOnly,
  adminOrOrganizer,
} from "../middleware/roleMiddleware.js";
import { uploadEventImage } from "../middleware/cloudinaryUpload.js";

const router = express.Router();

// ================= PUBLIC ROUTES =================
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// ================= ORGANIZER ROUTES =================
router.post("/", protect, organizerOnly, uploadEventImage, createEvent);

router.put("/:id", protect, organizerOnly, uploadEventImage, updateEvent);

// ================= ADMIN OR ORGANIZER =================
router.delete("/:id", protect, adminOrOrganizer, deleteEvent);

export default router;
