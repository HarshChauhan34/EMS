import express from "express";
import {
  getAllUsers,
  getUserBookings,
  getOrganizerRequests,
  getPendingOrganizerRequests,
  approveOrganizer,
  rejectOrganizer,
  deleteUser,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ================= USERS =================
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);

// ================= BOOKINGS =================
router.get("/users/:id/bookings", protect, adminOnly, getUserBookings);

// ================= ORGANIZER REQUESTS =================

// All organizers (approved + pending + rejected)
router.get("/organizers", protect, adminOnly, getOrganizerRequests);

// Only pending requests
router.get(
  "/organizers/pending",
  protect,
  adminOnly,
  getPendingOrganizerRequests,
);

// Approve organizer
router.put("/organizers/:id/approve", protect, adminOnly, approveOrganizer);

// Reject organizer
router.put("/organizers/:id/reject", protect, adminOnly, rejectOrganizer);

export default router;
