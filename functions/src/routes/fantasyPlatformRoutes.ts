import { Router } from "express";
import {
  createFantasyPlatform,
  getFantasyPlatform,
  updateFantasyPlatform,
  deleteFantasyPlatform,
  listFantasyPlatforms,
} from "../controllers/fantasyPlatformController";

const router = Router();

router.post("/", createFantasyPlatform);
router.get("/:id", getFantasyPlatform);
router.put("/:id", updateFantasyPlatform);
router.delete("/:id", deleteFantasyPlatform);
router.get("/", listFantasyPlatforms);

export default router;
