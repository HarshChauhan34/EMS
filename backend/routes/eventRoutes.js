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

// ✅ multer
import upload from "../middleware/upload.js";

const router = express.Router();

// ================= GET =================

router.get("/", getAllEvents);

router.get("/:id", getEventById);

// ================= CREATE =================

router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"), // ✅ add
  createEvent,
);

// ================= UPDATE =================

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"), // ✅ add
  updateEvent,
);

// ================= DELETE =================

router.delete("/:id", protect, adminOnly, deleteEvent);

export default router;
