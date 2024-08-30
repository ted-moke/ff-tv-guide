import { Router } from "express";
import {
  createFantasyLeague,
  getFantasyLeague,
  updateFantasyLeague,
  deleteFantasyLeague,
  listFantasyLeagues,
} from "../controllers/fantasyLeagueController";

const router = Router();

router.post("/", createFantasyLeague);
router.get("/:id", getFantasyLeague);
router.put("/:id", updateFantasyLeague);
router.delete("/:id", deleteFantasyLeague);
router.get("/", listFantasyLeagues);

export default router;
