import express from "express";
import {
  getAllUsers,
  getUserBookings,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/users", protect, adminOnly, getAllUsers);

router.get("/users/:id/bookings", protect, adminOnly, getUserBookings);

export default router;
