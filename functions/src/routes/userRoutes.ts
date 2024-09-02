import { Router } from "express";
import {
  registerUser,
  loginUser,
  changePassword,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", changePassword);
router.get("/profile/:uid", getUserProfile);
router.put("/profile/:uid", updateUserProfile);

export default router;
