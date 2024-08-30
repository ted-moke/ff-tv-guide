import { Router } from "express";
import {
  createPlatformCredential,
  getPlatformCredential,
  updatePlatformCredential,
  deletePlatformCredential,
  listPlatformCredentials,
} from "../controllers/platformCredentialController";

const router = Router();

router.post("/", createPlatformCredential);
router.get("/:id", getPlatformCredential);
router.put("/:id", updatePlatformCredential);
router.delete("/:id", deletePlatformCredential);
router.get("/", listPlatformCredentials);

export default router;
