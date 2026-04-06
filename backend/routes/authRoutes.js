import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateProfile,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= AUTH =================
router.post("/register", registerUser);
router.post("/login", loginUser);

// ================= PASSWORD =================
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ================= USER =================
router.put("/profile", protect, updateProfile);

// ================= TEST ================= (optional)
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

export default router;
