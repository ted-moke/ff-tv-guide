import { Router } from "express";
import {
  createFantasyTeam,
  getFantasyTeam,
  updateFantasyTeam,
  deleteFantasyTeam,
  listFantasyTeams,
} from "../controllers/fantasyTeamController";

const router = Router();

router.post("/", createFantasyTeam);
router.get("/:id", getFantasyTeam);
router.put("/:id", updateFantasyTeam);
router.delete("/:id", deleteFantasyTeam);
router.get("/", listFantasyTeams);

export default router;
