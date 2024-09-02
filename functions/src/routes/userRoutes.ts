import { Router } from "express";
import {
  registerUser,
  loginUser,
  changePassword,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Public routes (no authentication required)
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (authentication required)
router.post("/change-password", authenticate, changePassword);
router.get("/profile/:uid", authenticate, getUserProfile);
router.put("/profile/:uid", authenticate, updateUserProfile);

export default router;
