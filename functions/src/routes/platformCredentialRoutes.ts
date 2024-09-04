import { Router } from "express";
import {
  createPlatformCredential,
  getPlatformCredential,
  updatePlatformCredential,
  deletePlatformCredential,
  listPlatformCredentials,
} from "../controllers/platformCredentialController";
import { authenticate } from "../middleware/authMiddleware"; // Add this import

const router = Router();

router.post("/", authenticate, createPlatformCredential);
router.get("/:id", authenticate, getPlatformCredential);
router.put("/:id", authenticate, updatePlatformCredential);
router.delete("/:id", authenticate, deletePlatformCredential);
router.get("/", authenticate, listPlatformCredentials); // Ensure authentication

export default router;
