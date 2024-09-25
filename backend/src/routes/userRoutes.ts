import express from "express";
import {
  registerUser,
  loginUser,
  changePassword,
  getUserProfile,
  updateUserProfile,
  verifyToken,
  convertTempUser,
} from "../controllers/userController";
import {
  getOpponentTeams,
  getUserTeams,
} from "../controllers/userTeamController";
import { listPlatformCredentials } from "../controllers/platformCredentialController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/convert-temp-user", convertTempUser);
router.post("/login", loginUser);
router.get("/verify-token", verifyToken);

router.post("/change-password", changePassword);
router.get("/profile/:uid", getUserProfile);
router.put("/profile/:uid", updateUserProfile);

router.get("/:uid/teams", getUserTeams);
router.get("/:uid/opponents", getOpponentTeams);
router.get("/:uid/platform-credentials", listPlatformCredentials);

export default router;
