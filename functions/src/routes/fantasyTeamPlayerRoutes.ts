import { Router } from "express";
import {
  createFantasyTeamPlayer,
  getFantasyTeamPlayer,
  updateFantasyTeamPlayer,
  deleteFantasyTeamPlayer,
  listFantasyTeamPlayers,
} from "../controllers/fantasyTeamPlayerController";

const router = Router();

router.post("/", createFantasyTeamPlayer);
router.get("/:id", getFantasyTeamPlayer);
router.put("/:id", updateFantasyTeamPlayer);
router.delete("/:id", deleteFantasyTeamPlayer);
router.get("/", listFantasyTeamPlayers);

export default router;
