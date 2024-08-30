import { Router } from "express";
import {
  createFantasyPlayer,
  getFantasyPlayer,
  updateFantasyPlayer,
  deleteFantasyPlayer,
  listFantasyPlayers,
} from "../controllers/fantasyPlayerController";

const router = Router();

router.post("/", createFantasyPlayer);
router.get("/:id", getFantasyPlayer);
router.put("/:id", updateFantasyPlayer);
router.delete("/:id", deleteFantasyPlayer);
router.get("/", listFantasyPlayers);

export default router;
