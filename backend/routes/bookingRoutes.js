import express from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
} from "../controllers/bookingController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// User Routes
router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);

// Admin Route
router.get("/", protect, adminOnly, getAllBookings);

router.put("/cancel/:id", protect, cancelBooking);

export default router;
