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
import { listPlatformCredentials } from "../controllers/platformCredentialController";

const router = Router();

// Public routes (no authentication required)
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (authentication required)
router.post("/change-password", authenticate, changePassword);
router.get("/profile/:uid", authenticate, getUserProfile);
router.put("/profile/:uid", authenticate, updateUserProfile);

router.get("/:uid/teams", getUserTeams);
router.get("/:uid/opponents", getOpponentTeams); // Ensure this route is protected
router.get("/:uid/platform-credentials", listPlatformCredentials);
// New route to verify token
router.get("/verify-token", verifyToken);

export default router;
