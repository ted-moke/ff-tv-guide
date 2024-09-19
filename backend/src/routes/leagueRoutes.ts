import { Router } from "express";
import { upsertLeague, updateLeagueTeam } from "../controllers/leagueController";

const router = Router();

router.post("/", upsertLeague);
router.put("/:leagueId/teams", updateLeagueTeam);

export default router;
