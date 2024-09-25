import { Router } from "express";
import {
  createPlatformCredential,
  getPlatformCredential,
  updatePlatformCredential,
  deletePlatformCredential,
} from "../controllers/platformCredentialController";

const router = Router();

router.post("/", createPlatformCredential);
router.get("/:id", getPlatformCredential);
router.put("/:id", updatePlatformCredential);
router.delete("/:id", deletePlatformCredential);

export default router;
