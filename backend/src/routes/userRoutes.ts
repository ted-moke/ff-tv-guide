import { Router } from "express";
import {
  registerUser,
  loginUser,
  changePassword,
  getUserProfile,
  updateUserProfile,
  verifyToken,
} from "../controllers/userController";
import { getUserTeams, getOpponentTeams } from "../controllers/userTeamController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Public routes (no authentication required)
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (authentication required)
router.post("/change-password", authenticate, changePassword);
router.get("/profile/:uid", authenticate, getUserProfile);
router.put("/profile/:uid", authenticate, updateUserProfile);

router.get("/:uid/teams", authenticate, getUserTeams);
router.get("/:uid/opponents", authenticate, getOpponentTeams); // Ensure this route is protected

// New route to verify token
router.get("/verify-token", verifyToken);

export default router;
