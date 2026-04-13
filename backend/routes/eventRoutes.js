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
import upload from "../middleware/upload.js";

const router = express.Router();

// ================= PUBLIC ROUTES =================
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// ================= ORGANIZER ROUTES =================
router.post(
  "/",
  protect,
  organizerOnly,
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

router.put(
  "/:id",
  protect,
  organizerOnly,
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

// ================= ADMIN OR ORGANIZER =================
router.delete("/:id", protect, adminOrOrganizer, deleteEvent);

export default router;